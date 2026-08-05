/**
 * 获取商品详情
 */
import { useEffect, useReducer, useRef, useState } from 'react'
import { Toast } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { useIntl } from '@linkseeks/i18n'
import {
  getProductMobileShopStoreGetCommodityDetail,
  getProductMobileShopStoreGetCommodityDetailBySkuId,
  GetProductMobileShopStoreGetCommodityDetailResponse,
} from '@apps/apis'
import { postOrderMobileCreatePaymentFind, PostOrderMobileCreatePaymentFindResponse } from '@apps/apis'
import { getMemberManageUpperCreditParamGet } from '@apps/apis'
import { normalizeSpecSkuList, ProductSkuType } from '../components/SkuPopup/utils'
import { initialState, reducer } from './productReducer'

type OptionsType = {
  /**
   * 商品id
   */
  commodityId: number
  /**
   * sku
   */
  skuId?: number
  /**
   * 是否强制登录
   */
  from?: 'share' | null
  /**
   * 渠道会员id
   */
  channelMemberId?: number | undefined
  /**
   * 指定的商城id，主要是处理积分商城的商城id是特殊的
   */
  specifyShopId?: number
  /**
   * 指定的商城type，主要是处理积分商城的商城type是特殊的
   */
  specifyShopType?: number
}

/** 商品详情 */
export type ProductInfo = GetProductMobileShopStoreGetCommodityDetailResponse & {
  /**
   * 渠道商品id
   */
  channelCommodityId?: number
  /**
   * 已售数量(会员商品)
   */
  sold: number
  /**
   * 已售数量(渠道商品)
   */
  channelSold?: number
}

/** 企业商城api, 分商品id，和skuid 两种 */
const ENTERPRISE_MAP = {
  commodityId: getProductMobileShopStoreGetCommodityDetail,
  skuId: getProductMobileShopStoreGetCommodityDetailBySkuId,
}

function useGetProductDetail(options: OptionsType) {
  const { specifyShopId, specifyShopType } = options
  const {
    router: {
      params: { routerShopId },
    },
  } = getCurrentInstance()
  const [productReducer, productDispatch] = useReducer(reducer, initialState)
  const [banner, setBanner] = useState<string[]>([])
  const currentMode: 'commodityId' | 'skuId' = options.skuId ? 'skuId' : 'commodityId'
  const [loading, setLoading] = useState<boolean>(false)
  /** 商品详情 */
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  /** sku 列表 */
  const [skuList, setSkuList] = useState<ProductSkuType[]>([])
  const [currentSku, setCurrentSku] = useState<ProductSkuType>({
    ladderPrice: 0,
    aboutPrice: 0,
    skuId: 0,
    price: 0,
    stockNum: 0,
    quantity: 1,
    ladder: [],
    commodityUnitPriceAndPicId: 0,
    active: 0,
    specNames: [],
    code: '',
    commoditySkuAttributeList: [],
  })
  /** 支付方式 */
  const [payWayInfo, setPayWayInfo] = useState<PostOrderMobileCreatePaymentFindResponse | null>(null)

  /** 会员折扣 */
  const vipParameter = useRef<number>(0)

  const {
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const intl = useIntl()

  const service = ENTERPRISE_MAP
  const shouldLogin = !!options.from

  /**
   * 获取支付方式, 当sku 改变时重新获取支付方式
   * @param vendorMemberId 商品所属者id
   * @param vendorRoleId 商品所属者角色id
   * @param product 商品信息
   * @returns null
   */
  const getPayWay = (
    vendorMemberId: number,
    vendorRoleId: number,
    product: {
      productId: number
      skuId: number
      freightType: number
      crossBorder: boolean
    },
  ) => {
    if (!product.skuId) {
      return
    }
    postOrderMobileCreatePaymentFind({
      shopId: shopAndSite?.id! || routerShopId,
      vendors: [
        {
          vendorMemberId,
          vendorRoleId,
          products: [
            {
              productId: product.productId,
              skuId: product.skuId,
              freightType: product.freightType,
              crossBorder: product.crossBorder,
            },
          ],
        },
      ],
    }).then((res) => {
      if (res.code === 1000) {
        setPayWayInfo(res.data)
      }
    })
  }

  // 获取会员权益折扣
  const getMemberCreditParam = async (memberId: number, roleId: number) =>
    getMemberManageUpperCreditParamGet({
      parentMemberId: `${memberId}`,
      parentMemberRoleId: `${roleId}`,
    })

  useEffect(() => {
    async function getProductInfo() {
      const headers = {
        type: 1,
        shopId: specifyShopId || shopAndSite?.id || routerShopId,
      }
      const postData =
        currentMode === 'commodityId' ? { commodityId: options.commodityId } : { commoditySkuId: options.skuId! }
      const withChannelData = {}
      const mergePostData = { ...postData, ...withChannelData }
      try {
        setLoading(true)
        const { data, code, message } = await service[currentMode](mergePostData as any, { headers })
        if (code !== 1000) {
          Toast.show({
            title: intl.formatMessage({ id: `${code}`, defaultMessage: message }),
            icon: 'none',
          })
        }
        setProductInfo(data as unknown as ProductInfo)
        const { commoditySkuList = [] } = data
        const skuListData = normalizeSpecSkuList(commoditySkuList as any, data.minOrder!, PRICE_TYPE_ENUM.SPOT)
        setSkuList(skuListData)

        productDispatch({
          type: 'setProductMiniInfo',
          payload: {
            id: data.id,
            name: data.name,
            min: data.min,
            max: data.max,
            unitName: data.unitName,
            mainPic: data.mainPic,
            minOrder: data.minOrder,
            subUnitName: (data as any).subUnitName as unknown as any,
            originalPrice: data.max,
          },
        })

        const minSkuItem =
          currentMode === 'skuId'
            ? skuListData.find((_item) => _item.skuId === options.skuId)
            : skuListData.sort((a, b) => a.price - b.price)[0]
        if (minSkuItem) {
          setCurrentSku(minSkuItem)
          productDispatch({
            type: 'setProductMiniInfo',
            payload: {
              ladderPrice: minSkuItem.ladderPrice,
              aboutPrice: minSkuItem.aboutPrice,
              originalPrice: minSkuItem.ladder[0]?.price || 0, // 取第一阶梯的价格
            },
          })
        }

        // 商品有关联会员折扣
        if ((data.isMemberPrice && userInfo) || shouldLogin) {
          const value = await getMemberCreditParam(data.memberId, data.memberRoleId)
          const { parameter } = value.data || {}

          if (value.code === 1000 && parameter && parameter !== 1) {
            vipParameter.current = parameter
            if (minSkuItem) {
              productDispatch({
                type: 'setProductMiniInfo',
                payload: {
                  vipPrice: +(minSkuItem.ladderPrice * parameter).toFixed(2),
                },
              })
            }
          }
        }

        if (userInfo || shouldLogin) {
          getPayWay(data.memberId, data.memberRoleId, {
            productId: data.id,
            skuId: minSkuItem ? minSkuItem.skuId : commoditySkuList?.[0]?.id,
            freightType: data.logistics?.carriageType,
            crossBorder: data.isCrossBorder,
          })
        }

        const bannerData: string[] = []
        commoditySkuList.forEach((item: { commodityPic: any[] }) => {
          if (item.commodityPic && item.commodityPic.length) {
            item.commodityPic.forEach((pic) => {
              if (bannerData.indexOf(pic) === -1) {
                bannerData.push(pic)
              }
            })
          }
        })
        setBanner(bannerData)
      } finally {
        setLoading(false)
      }
    }
    getProductInfo()
  }, [userInfo, specifyShopId, specifyShopType])

  const renderPayWay = () => {
    if (payWayInfo && payWayInfo.required) {
      if (payWayInfo.payTypes && payWayInfo.payTypes.length > 0) {
        return payWayInfo.payTypes
          .map((item) => item.payTypeName)
          .filter((item, index, self) => self.indexOf(item) === index)
          .join(' ')
      }
      return ''
    }
    return intl.formatMessage({ id: 'commodityMerge.common.free', defaultMessage: '无需支付' })
  }

  return {
    loading,
    banner,
    productInfo,
    skuList,
    currentSku,
    setCurrentSku,
    productDispatch,
    productReducer,
    payWayInfo,
    getPayWay,
    vipParameter,
    renderPayWay,
  }
}

export default useGetProductDetail
