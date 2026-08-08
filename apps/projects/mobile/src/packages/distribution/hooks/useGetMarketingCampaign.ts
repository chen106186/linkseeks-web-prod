import { useEffect, useMemo, useRef, useState } from 'react'
import { showLoading, hideLoading, showToast, hideToast } from '@apps/mobile-services/utils/taro'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import {
  ACTIVITY_COMBINATION_NUMBER,
  ACTIVITY_GROUPPURCHASE_NUMBER,
  ACTIVITY_SECKILL_NUMBER,
  ACTIVITY_SETMEAL_NUMBER,
} from '@/constants/const/activity'
import {
  postMarketingMobileActivityGoodsCheckQuantity,
  postMarketingMobileActivityGoodsDetailTag,
  PostMarketingMobileActivityGoodsDetailTagRequest,
  PostMarketingMobileActivityGoodsDetailTagResponse,
} from '@apps/apis'
import { ProductSkuType } from '../components/SkuPopup/utils'
import { SeckillStatus } from '../pages/stocksSourcing/components/SeckillWrap'
import { ProductInfo } from './useGetProductDetail'

type OptionsType = {
  /**
   * 商品信息
   */
  productInfo: ProductInfo | null
  /**
   * 设置商品信息
   */
  dispatch: any
  /**
   * sku列表
   */
  skuList: ProductSkuType[]
  /**
   * 设置当前选中的 sku
   */
  setCurrentSku: (skuItem: ProductSkuType) => void
  /**
   * 是否是拼团，默认 false
   */
  isGroupPurchasing?: boolean
  /**
   * 如果带有skuid 进页面，需要对sku 进行互动查询
   */
  skuId?: number
  /**
   * 渠道会员id
   */
  channelMemberId?: number
}

type MarketingCampaignData = PostMarketingMobileActivityGoodsDetailTagResponse & {
  /**
   * 服务器响应时间
   */
  serverTime: number
  /**
   * 是否是套餐活动
   */
  isPackage: boolean
}

/**
 * 将传入时间的 时分秒 转换给 服务器响应的时间的 时分秒
 * @param time 传入时间戳
 * @param moment 服务器响应时间
 * @returns number
 */
function transferDateToToday(time: number, moment: number): number | null {
  if (!time) {
    return null
  }
  const date = new Date(time)
  const serverDate = new Date(moment)
  serverDate.setHours(date.getHours())
  serverDate.setMinutes(date.getMinutes())
  serverDate.setSeconds(date.getSeconds())
  // 设置毫秒为 0，减小误差
  serverDate.setMilliseconds(0)
  return serverDate.getTime()
}

let toastIns: any = null

function useGetMarketingCampaign(options: OptionsType) {
  const { productInfo, dispatch, skuList, setCurrentSku, isGroupPurchasing = false } = options
  const [marketingData, setMarketingData] = useState<MarketingCampaignData | null>(null)

  const seckillStatus = useRef<SeckillStatus>('wait')

  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()
  const intl = useIntl()

  /**
   * 找到指定活动所属的 index
   * @param activities 活动
   * @param type 目标活动类型
   * @returns boolean
   */
  const findSpecifiedActivityIndex = (
    activities: PostMarketingMobileActivityGoodsDetailTagResponse['tagDetailList'],
    type: number,
  ): number => activities.findIndex((item) => item.activityType === type)

  // 获取商品活动相关
  const getMarketingCampaign = async (
    params: Omit<PostMarketingMobileActivityGoodsDetailTagRequest, 'commodityType'>,
  ) => {
    const compoundedParams = {
      ...params,
      commodityType: 1,
    }
    const { data, code, message, time } = await postMarketingMobileActivityGoodsDetailTag(compoundedParams)
    if (code === 1000) {
      const isHasGroupPurchasing = findSpecifiedActivityIndex(data.tagDetailList, ACTIVITY_GROUPPURCHASE_NUMBER) !== -1
      const combinationIndex = findSpecifiedActivityIndex(data.tagDetailList, ACTIVITY_COMBINATION_NUMBER)
      const isHasCombination = combinationIndex !== -1
      const isHasSeckill = findSpecifiedActivityIndex(data.tagDetailList, ACTIVITY_SECKILL_NUMBER) !== -1
      const isHasPackage = findSpecifiedActivityIndex(data.tagDetailList, ACTIVITY_SETMEAL_NUMBER) !== -1

      dispatch({
        type: 'setProductMiniInfo',
        payload: {
          activePrive: data.promotionPrice,
          finalPrive: data.preferentialPrice,
          activityType: 0,
          slogan: '',
          seckillPrice: 0,
        },
      })

      // 处理 拼团活动
      if (isHasGroupPurchasing) {
        dispatch({
          type: 'setProductMiniInfo',
          payload: {
            activityType: ACTIVITY_GROUPPURCHASE_NUMBER,
            activePrive: data.preferentialPrice,
            finalPrive: 0,
          },
        })
      }
      // 处理 组合购活动
      if (isHasCombination) {
        dispatch({
          type: 'setProductMiniInfo',
          payload: {
            activityType: ACTIVITY_COMBINATION_NUMBER,
            slogan: `${data.tagDetailList[combinationIndex].preferentialTag} + ${data.tagDetailList[combinationIndex].preferentialTagDesc}`,
          },
        })
      }
      // 处理 秒杀活动
      if (isHasSeckill) {
        dispatch({
          type: 'setProductMiniInfo',
          payload: {
            activityType: ACTIVITY_SECKILL_NUMBER,
            activePrive: data.preferentialPrice,
            seckillPrice: data.preferentialPrice,
            finalPrive: 0,
          },
        })
      }

      setMarketingData({ ...data, serverTime: time, isPackage: isHasPackage })

      return data
    }
    throw new Error(message)
  }

  useEffect(() => {
    if (!options.productInfo || !userInfo) {
      return
    }
    async function getData() {
      const minSkuItem = options.skuId
        ? skuList.find((_item) => _item.skuId === options.skuId)
        : skuList.sort((a, b) => a.price - b.price)[0]
      const campaignData = await getMarketingCampaign({
        shopId: shopAndSite?.id!,
        categoryId: productInfo?.customerCategoryId!,
        brandId: productInfo?.brandId,
        productId: productInfo?.id!,
        memberId: productInfo?.memberId!,
        roleId: productInfo?.memberRoleId!,
        skuId: minSkuItem?.skuId || undefined,
        filterGroup: !isGroupPurchasing,
      })
      // 如果存在活动最优惠skuId，则设置默认选中 sku
      let activeSkuItem: ProductSkuType | undefined
      if (campaignData.preferentialSkuId) {
        activeSkuItem = skuList.find((item) => item.skuId === campaignData.preferentialSkuId)
        if (activeSkuItem) {
          setCurrentSku(activeSkuItem)
          dispatch({
            type: 'setProductMiniInfo',
            payload: {
              ladderPrice: activeSkuItem.ladderPrice,
              aboutPrice: activeSkuItem.aboutPrice,
              originalPrice: activeSkuItem.ladder[0]?.price || 0, // 取第一阶梯的价格
            },
          })
        }
      }
    }
    getData()
  }, [dispatch, skuList])

  const marketingCampaign = useMemo(() => {
    if (!marketingData) {
      return null
    }
    return {
      couponList: marketingData.couponList.map(({ couponId, completeReceive, ...rest }) => ({
        id: couponId,
        completeReceive,
        status: completeReceive === 3 ? 1 : 0,
        ...rest,
      })),
      tagDetailList: marketingData.tagDetailList,
      canUseCoupon: marketingData.canUseCoupon,
      // 后台返回的是创建的 年月日 时分秒，这里只需要用到 时分秒，所以需要跟 响应时间 做结合 => 响应时间 年月日 + 秒杀时段 时分秒
      seckillStartTime: transferDateToToday(marketingData.seckillStartTime, marketingData.serverTime),
      seckillEndTime: transferDateToToday(marketingData.seckillEndTime, marketingData.serverTime),
      serverTime: marketingData.serverTime,
      isPackage: marketingData.isPackage,
      tagList: marketingData.tagList,
    }
  }, [marketingData])

  /** 拼团数据 */
  const groupPurchasingData = useMemo(() => {
    if (!marketingData) {
      return null
    }
    return {
      activityId: marketingData.tagDetailList?.[0]?.activityId,
      groupPurchasingPrice: marketingData.preferentialPrice,
      groupNum: +(marketingData.tagDetailList?.[0]?.preferentialTagDesc?.match(/(\d+)/)?.[0] || 0),
    }
  }, [marketingData])

  /**
   * 购买前判断限购数量
   * @param operateType 操作类型1：加入购物车2：立即购买3：购物车调整数量
   * @param skuId skuId
   * @param quantity 购买数量
   */
  const fetchCheckQuantity = (operateType: 1 | 2 | 3, productSkuId: number, quantity: number): Promise<boolean> =>
    new Promise((resolve) => {
      showLoading({
        title: intl.formatMessage({ id: 'commodityMerge.common.loading', defaultMessage: '正在加载...' }),
        mask: true,
      })
      postMarketingMobileActivityGoodsCheckQuantity({
        operateType,
        shopId: shopAndSite?.id!,
        productId: productInfo?.id!,
        skuId: productSkuId,
        commodityType: 1,
        quantity,
        upperMemberId: productInfo?.memberId!,
        upperRoleId: productInfo?.memberRoleId!,
      })
        .finally(() => {
          hideLoading()
        })
        .then((res) => {
          if (res.code === 1000) {
            resolve(true)
          } else {
            resolve(false)
          }
          if (res.code !== 1000 && res.message) {
            toastIns && hideToast(toastIns)
            toastIns = showToast({
              title: res.message,
              icon: 'none',
            })
          }
        })
        .catch(() => {
          resolve(false)
        })
    })

  return {
    marketingCampaign,
    getMarketingCampaign,
    groupPurchasingData,
    seckillStatus,
    fetchCheckQuantity,
  }
}

export default useGetMarketingCampaign
