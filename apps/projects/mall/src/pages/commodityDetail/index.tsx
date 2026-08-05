import HelmetProvider from '@/context/helmetProvider'
import { CommodityDetailLoaderReturn } from '@/loaders/commodityDetailLoader'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData, useLocation, useParams } from 'react-router-dom'
import { getWebIntl } from '@/utils/locales'
import cx from 'classnames'
import { LAYOUT_TYPE } from '@/types/global'
import { useGlobalConext } from '@/context/globalProvider'
import { COMMODITY_TYPE } from '@/constants'
import { getQueryString } from '@/utils/getUrlParam'
import { message, Tooltip } from 'antd'
import { Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { accMul, dateFormat, numFormat, priceFormat } from '@apps/utils/src/format'
import { MEMBER_CENTER_URL, getLoginDomainFn } from '@/constants/domain'
import {
  PostOrderCreatePaymentFindRequest,
  postMarketingWebActivityGoodsCheckQuantity,
  postMarketingWebActivityGoodsPriceCalculate,
  postProductMobileShopPurchaseSavePurchaseBatch,
  postProductShopPurchaseSaveOrUpdatePurchase,
  postProductShopPurchaseSavePurchaseBatchByMro,
} from '@apps/apis'
import { MarketingTypeEnum } from '@/constants/marketing'
import isEmpty from 'lodash/isEmpty'
import InputNumber from '@/components/InputNumber'
import { usePurchaseOrderContext } from '@/context/purchaseOrderProvider'
import { LinkTo } from '@/utils'
import IconFont from '@/utils/iconfont'
import { ORDER_TYPE } from '@/types/order'
import useLink from '@/hooks/useLink'
import ErrorResult from './error'
import { CurrentSkuItemType, ImgItemType, PromotionItem } from './types'
import Exhibition from './components/Exhibition'
import CommodityPrice, { getMaxCountRange } from './components/Price'
import SkuInfo, { deleteRepeatImg } from './components/SkuInfo'
import usePayway from './hooks/usePayway'
import useMarketing from './hooks/useMarketing'
import Promotion from './components/Promotion'
import Coupons from './components/Coupons'
import Delivery from './components/Delivery'
import Combination from './components/Combination'
import MroModels, { PriceListItemType } from './components/MroModels'
import GroupBuy from './components/GroupBuy'
import ShopInfo from './components/ShopInfo'
import Interested from './components/Interested'
import ProductDescription from './components/ProductDescription'
import useCommodityDetail from './hooks/useCommodityDetail'
import DialogModal from './components/DialogModal'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'

interface IProps {
  type?: number
}

const CommodityDetail: React.FC<IProps> = (props) => {
  const { type = 1 } = props
  const { commodityDetail: detail, errorMsg } = (useLoaderData() as CommodityDetailLoaderReturn) || {}
  const { mallInfo, userInfo, layoutType, shopInfo, url, isMro } = useGlobalConext()
  const { search } = useLocation()
  const groupId = getQueryString('groupId', search)
  const skuId = getQueryString('skuId', search)
  const [buyCount, setBuyCount] = useState<number>(1)
  const [commodityImgList, setCommodityImgList] = useState<ImgItemType[]>([])
  const [addSuccessVisible, setAddSuccessVisible] = useState<boolean>(false)
  const [currentSku, setCurrentSku] = useState<CurrentSkuItemType>()
  const [inAreaState, setInAreaState] = useState<boolean>(false)
  const [deliveryStateMain, setDeliveryStateMain] = useState<boolean>(true) // 是否能配送
  const { payWayInfo, paymentError, getPayWayListByMemberId, pointPayWay } = usePayway()
  const { purchaseCount, updatePurchaseList, cacheOrderInfo } = usePurchaseOrderContext()
  const { pointInfo, parameter, commonCategoryCommodityList, commodityDetail } = useCommodityDetail(type, detail)
  const { commodityId, storeId } = useParams()
  const { linkPrefix } = useLink()
  const { marketingData, hasActivity, isGroupBuy, currentGroupDetail, getMarketingCampaign, getGroupDetail } =
    useMarketing(type)

  const clickFlag = useRef<boolean>(true)
  const allImgList = useRef<ImgItemType[]>([])
  // 登录域名
  const LOGIN_DOMAIN = getLoginDomainFn(url)

  const translate = getWebIntl()

  useEffect(() => {
    if (type === 3 && groupId && currentSku) {
      getGroupDetail(Number(groupId))
    }
  }, [type, groupId, currentSku])

  const getPaywayParam = (): PostOrderCreatePaymentFindRequest => {
    const param: PostOrderCreatePaymentFindRequest = {
      shopId: mallInfo?.id!,
      vendors: [
        {
          vendorMemberId: commodityDetail?.memberId,
          vendorRoleId: commodityDetail?.memberRoleId,
          products: [
            {
              productId: commodityDetail?.id,
              skuId: skuId ? Number(skuId) : Number(currentSku?.skuId),
              freightType: commodityDetail?.logistics.carriageType || undefined,
              crossBorder: commodityDetail?.isCrossBorder,
            },
          ],
        },
      ],
    }

    return param
  }

  useEffect(() => {
    if (currentSku && commodityDetail && mallInfo) {
      if (userInfo) {
        getPayWayListByMemberId(getPaywayParam())
      }
      if (commodityDetail.priceType !== COMMODITY_TYPE.inquiry && commodityDetail?.customerCategoryId) {
        getMarketingCampaign({
          shopId: mallInfo.id,
          categoryId: commodityDetail?.customerCategoryId,
          brandId: commodityDetail?.brandId,
          productId: commodityDetail.id!,
          memberId: commodityDetail.memberId!,
          roleId: commodityDetail.memberRoleId!,
          skuId: currentSku.skuId,
          filterGroup: false,
        })
      }
    }
  }, [currentSku])

  const fullMoneyReduceActivity = useMemo(() => {
    if (!marketingData?.tagDetailList) {
      return undefined
    }
    return marketingData.tagDetailList.find(
      (item) =>
        item.activityType === MarketingTypeEnum.activity_type_5 &&
        (item.preferentialTag?.includes('满额减') || item.preferentialTagDesc?.includes('满额减')),
    )
  }, [marketingData])

  const shouldIgnoreActivityPrice = Boolean(fullMoneyReduceActivity)

  const judgeIsNotExistActive = (activityType: MarketingTypeEnum) => {
    if (!marketingData) return false
    if (marketingData && marketingData.tagDetailList.some((item) => item.activityType === activityType)) {
      return false
    }
    return true
  }

  const getLadderPrice = (): number => {
    let ladderPrice = 0
    if (!currentSku?.ladder) {
      return 0
    }
    if (currentSku.ladder.length <= 1) {
      ladderPrice = currentSku.ladder[0]?.price
    } else {
      const temp = currentSku.ladder.filter((item) => {
        return Number(buyCount) >= Number(item.min) && Number(buyCount) <= Number(item.max)
      })
      if (isEmpty(temp)) {
        const maxItem = getMaxCountRange(currentSku.ladder, buyCount)
        ladderPrice = maxItem.price
      } else {
        ladderPrice = temp[0]?.price
      }
    }
    return ladderPrice
  }

  /**
   * 判断是否指定的营销活动商品
   */
  const judgeIsGroupBuy = (tagList: PromotionItem[] | undefined, activityType: MarketingTypeEnum): boolean => {
    if (!tagList) return false
    return tagList.some((item) => item.activityType === activityType)
  }

  /**
   * 根据购买的数量获取单前商品单价
   * @param useParameter 是否使用会员价
   * @param useActivityPrice 是否使用活动价
   * @returns
   */
  const getUnitPrice = (useParameter = true, useActivityPrice = true) => {
    let unitPrice = 0
    if (!currentSku?.ladder) {
      return 0
    }

    const useMarketingPrice = useActivityPrice && marketingData && hasActivity && !shouldIgnoreActivityPrice

    if (useMarketingPrice) {
      if (judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_9)) {
        // 拼团活动价格处理
        unitPrice = marketingData.preferentialPrice || marketingData.promotionPrice
      } else if (judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_12)) {
        // 秒杀活动价格处理
        unitPrice = marketingData.preferentialPrice || getLadderPrice()
      } else if (judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_5)) {
        unitPrice = marketingData.preferentialPrice || marketingData.promotionPrice
      } else if (marketingData.promotionPrice) {
        // 其他活动价格处理
        unitPrice = marketingData.promotionPrice
      } else {
        unitPrice = getLadderPrice()
      }
      if (!unitPrice) {
        unitPrice = getLadderPrice()
      }
    } else {
      unitPrice = getLadderPrice()
    }

    // 会员折扣价格(如果含有活动，则不需要在乘会员折扣，后台已计算进去)
    const allowMemberPrice = parameter && useParameter && !isGroupBuy && (!hasActivity || shouldIgnoreActivityPrice)
    if (allowMemberPrice) {
      unitPrice = unitPrice * parameter
    }
    return unitPrice
  }

  /**
   * 初始化商品详情数据
   * @param commoditySkuList
   */
  const initAttributeAndValueList = (dataInfo: any) => {
    const skuList = dataInfo?.commoditySkuList
    if (!skuList) {
      return
    }
    let tempImgList: any = [
      {
        id: dataInfo.id,
        commodityPic: dataInfo.mainPic,
      },
    ]
    for (const item of skuList) {
      // 初始化商品图片-》 商品主图加上商品属性图片
      if (item.commodityPic) {
        const tempCommodityPic = item.commodityPic.map((picItem: any, picIndex: any) => {
          return {
            id: `${item.id}-${picIndex}`,
            commodityPic: picItem,
          }
        })
        tempImgList = deleteRepeatImg(tempImgList, tempCommodityPic)
      }
    }

    setCommodityImgList(tempImgList)
    allImgList.current = tempImgList
  }

  useEffect(() => {
    if (commodityDetail) {
      initAttributeAndValueList(commodityDetail)
    }
  }, [commodityDetail])

  const seoInfo = useMemo(() => {
    if (commodityDetail) {
      const sellingPoint =
        commodityDetail.sellingPoint && commodityDetail.sellingPoint.length > 0
          ? commodityDetail.sellingPoint.join(' ')
          : ''
      return {
        title: commodityDetail.title || commodityDetail.name,
        keyword: commodityDetail.keywords || sellingPoint,
        description: commodityDetail.description || commodityDetail.slogan,
      }
    }
    return {
      title: translate('web.resource.commodity.shanpinxiangqing'),
      keyword: translate('web.resource.commodity.shanpinxiangqing'),
      description: translate('web.resource.commodity.shanpinxiangqing'),
    }
  }, [commodityDetail])

  const getCombinationActivity = useMemo(() => {
    if (!marketingData) return undefined
    if (!marketingData.tagDetailList) return undefined
    const mealDetail = marketingData.tagDetailList.filter(
      (item) => item.activityType === MarketingTypeEnum.activity_type_15,
    )[0]
    if (mealDetail) {
      return mealDetail
    }
    return undefined
  }, [marketingData])

  const fnHandleAddToPurchaseSuccesss = () => {
    updatePurchaseList(mallInfo?.id)
    setAddSuccessVisible(true)
  }

  const checkoutUserInfo: any = validateLoginWrapper(() => {
    if (userInfo?.memberRoleType !== 2) {
      message.info(translate('web.resource.mall.currentRole'))
      return false
    }
    if (userInfo?.memberId === commodityDetail?.memberId) {
      message.info(translate('web.resource.mall.bunenggoumaizijideshangpin'))
      return false
    }
    return true
  })

  //mro筛选器询价按钮
  const handleMroInquiry = (sku: any) => {
    if (!checkoutUserInfo() || !commodityDetail) {
      return
    }

    if (!sku) {
      message.destroy()
      message.info(translate('web.resource.mall.qingxuanzeshangpinshuxing'))
      return
    }

    const values: Array<any>[] = []
    sku.commoditySkuAttributeList &&
      sku.commoditySkuAttributeList.forEach((item: any, i: number) => {
        values.push(item.customerAttributeValue.value)
      })
    const JoinValue = values.reverse().join('/')

    const inquiryParam = {
      id: sku.id,
      brandId: commodityDetail.brandId,
      brandName: commodityDetail.brandName,
      logistics: commodityDetail.logistics,
      memberId: commodityDetail.memberId,
      memberName: commodityDetail.memberName,
      memberRoleId: commodityDetail.memberRoleId,
      memberRoleName: commodityDetail.memberRoleName,
      name: `${commodityDetail.name}/${JoinValue}`,
      packing: commodityDetail.packing,
      unitName: commodityDetail.unitName,
      attribute: sku.commoditySkuAttributeList || [],
      category: commodityDetail?.customerCategoryName,
      imgUrl: commodityDetail.mainPic,
    }

    const sessionKey = `inquiry${sku.id}${new Date().getTime()}`
    cacheOrderInfo(sessionKey, inquiryParam).then(() => {
      LinkTo(
        `${MEMBER_CENTER_URL}/dealAbility/productInquiry/waitAddInquiry/rfq?id=${commodityId}&memberId=${userInfo?.memberId}&spam_id=${sessionKey}&commodityId=${commodityId}&shopId=${mallInfo?.id}`,
      )
    })
  }

  const formatPurchaseBatchList = (skuList: PriceListItemType[]) => {
    if (skuList && Array.isArray(skuList) && skuList.length > 0) {
      return skuList.map((item) => {
        return {
          commoditySkuId: item.id,
          count: item.buyCount,
          purchaseProductPositionRequest:
            item.warehouseId &&
            item.inventoryByProductVOS &&
            Array.isArray(item.inventoryByProductVOS) &&
            item.inventoryByProductVOS.length > 0
              ? {
                  ...item.inventoryByProductVOS.find((inventoryItem) => inventoryItem.warehouseId === item.warehouseId),
                  positionQuantity: item.buyCount,
                }
              : {},
        }
      })
    }
    return []
  }

  // mro筛选器加入购物车
  const handleMroAddToPurchase = async (skuList: PriceListItemType[]): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!checkoutUserInfo()) {
        resolve(false)
        return
      }

      if (clickFlag.current) {
        clickFlag.current = false

        const params = {
          purchaseBatchList: formatPurchaseBatchList(skuList),
        }

        const headers: any = {
          shopId: mallInfo?.id,
        }
        postProductShopPurchaseSavePurchaseBatchByMro(params, { headers })
          .then((res) => {
            if (res.code === 1000) {
              clickFlag.current = true
              updatePurchaseList(mallInfo?.id)
              setAddSuccessVisible(true)
              resolve(true)
            } else if (res.code === 43118) {
              // 加入购物车或提交订单时需判断数量是否超过仓位库存数，若超过则不可加入，并报错提示：采购数量不能超过仓库库存数。报错后刷新库存数
              // fetchDetail()
              resolve(false)
            } else {
              resolve(false)
            }
          })
          .catch(() => {
            clickFlag.current = true
            resolve(false)
          })
      }
    })
  }

  const judegeGroupEndTime = () => {
    const nowTime = new Date().getTime()
    if (!currentGroupDetail) {
      return true
    }
    if (currentGroupDetail.endTime < nowTime) {
      return true
    }
    return false
  }

  const getOrderType = (useActivityPrice: boolean) => {
    if (type === 2) {
      return ORDER_TYPE.integral
    }
    if (isGroupBuy && useActivityPrice) {
      return ORDER_TYPE.group
    }
    return ORDER_TYPE.normal
  }

  const getPromotions = () => {
    if (!marketingData) return []
    return marketingData.tagDetailList.map((item) => {
      return {
        recordId: groupId ? groupId : '',
        promotionId: item.activityId,
        name: item.preferentialTag,
        promotionType: item.activityType,
        belongType: item.belongType,
        ladders: item.ladders || [],
        startTime: dateFormat(new Date(item.startTime), 'YY-MM-DD HH:mm:ss'),
        expireTime: dateFormat(new Date(item.endTime), 'YY-MM-DD HH:mm:ss'),
      }
    })
  }

  /**
   * 校验活动商品数量是否符合活动限购数量
   * 2025-05-23 该接口正常情况下返回数值，但有特殊场景会返回null，返回null时不阻止下单、使用普通订单
   * @param operateType 操作类型1：加入购物车2：立即购买3：购物车调整数量
   * @returns
   */
  const checkActivityProductQuantity = async (operateType: number): Promise<number> => {
    try {
      const param: any = {
        operateType,
        shopId: mallInfo?.id,
        productId: commodityId,
        skuId: currentSku?.skuId,
        commodityType: 1,
        quantity: buyCount,
        upperMemberId: commodityDetail?.memberId,
        upperRoleId: commodityDetail?.memberRoleId,
      }
      const res = await postMarketingWebActivityGoodsCheckQuantity(param)
      message.destroy()
      if (res.code === 1000) {
        return res.data
      } else {
        message.info(res.message)
        return 0
      }
    } catch (error) {
      return 0
    }
  }

  /**
   * 获取合计金额
   */
  const getAmount = (state = true) => {
    const unitPrice = getUnitPrice()
    const amount = accMul(unitPrice, buyCount)
    return state ? priceFormat(amount) : amount
  }

  const judegePointIsEnough = () => {
    if (pointInfo) {
      let maxPoint = pointInfo.memberScore > pointInfo.platformScore ? pointInfo.memberScore : pointInfo.platformScore
      const amountPoint = Number(getAmount(false))
      return maxPoint > amountPoint
    }
    return false
  }

  const checkPriceCalculate = async (): Promise<boolean> => {
    const params = buildPriceCalculateParams(buyCount, currentSku?.skuId)
    if (!params) {
      return false
    }
    const res = await postMarketingWebActivityGoodsPriceCalculate(params)
    if (res.code !== 1000) {
      return false
    } else {
      message.destroy()
    }
    return true
  }

  const buildPriceCalculateParams = (quantity: number, skuId?: number) => {
    const targetSkuId = skuId ?? currentSku?.skuId
    if (!commodityDetail || !mallInfo?.id || !targetSkuId) {
      return undefined
    }
    const commodityTypeValue = (commodityDetail.priceType as 1 | 2 | 3 | 4) || COMMODITY_TYPE.prompt
    return [
      {
        commodityType: commodityTypeValue,
        joinGroup: !judgeIsNotExistActive(MarketingTypeEnum.activity_type_9),
        productId: commodityDetail.id,
        quantity,
        shopId: mallInfo.id,
        skuId: targetSkuId,
        upperMemberId: commodityDetail.memberId,
        upperRoleId: commodityDetail.memberRoleId,
        notJoinList: [{ activityType: 15 }], // 直接购买都不参加套餐活动
      },
    ]
  }

  /**
   * 立即购买/开团/原价购买
   */
  const handleToBuy = async (priceType: COMMODITY_TYPE = COMMODITY_TYPE.prompt, useActivityPrice: boolean = true) => {
    if (!checkoutUserInfo()) {
      return
    }

    if (!currentSku) {
      message.destroy()
      message.info(translate('web.resource.mall.qingxuanzeshangpinshuxing'))
      return
    }

    if (priceType === COMMODITY_TYPE.integral && !judegePointIsEnough()) {
      message.error(translate('web.resource.mall.jifenbuzu'))
      return
    }

    if (paymentError) {
      message.info(paymentError)
      return
    }

    if (!payWayInfo) {
      return
    }
    /** 活动可购买的数量 */
    let activityProductQuantity: number | null = null

    if (hasActivity) {
      // 2025-05-23 该接口正常情况下返回数值，但有特殊场景会返回null，返回null时不阻止下单、使用普通订单
      activityProductQuantity = await checkActivityProductQuantity(2)

      if (activityProductQuantity === 0) {
        return
      }

      // 是否超过活动限购
      // if (!(await checkActivityProductQuantity(2))) {
      //   return
      // }

      // 如果是多件组合活动则判断是否超过组合数量
      if (!(await checkPriceCalculate())) {
        return
      }
    }

    // 参拼下单判断
    if (type === 3 && groupId) {
      if (!currentGroupDetail) {
        message.error(translate('web.resource.mall.gaipintuanbucunzai'))
        return
      }
      if (currentGroupDetail.isJoin) {
        message.error(translate('web.resource.mall.ninyicanjiagaipintuan'))
        return
      }
    }

    const minOrder = commodityDetail?.minOrder ? commodityDetail.minOrder : 1

    if (buyCount < minOrder) {
      message.destroy()
      message.info(translate('web.resource.mall.goumaishuliangbunengdiyuzuixiao'))
      return
    }

    if (clickFlag.current) {
      clickFlag.current = false

      const buyCommodityInfo: any = {
        id: currentSku.skuId,
        count: buyCount,
        productId: commodityDetail?.id,
        unitName: commodityDetail?.unitName,
        unitPrice: getUnitPrice(commodityDetail?.isMemberPrice, false),
        refPrice: getUnitPrice(commodityDetail?.isMemberPrice, useActivityPrice),
        price: getUnitPrice(false, false),
        logistics: commodityDetail?.logistics,
        name: commodityDetail?.name,
        priceRange: currentSku?.ladder,
        memberDiscount: parameter,
        category: commodityDetail?.customerCategoryName,
        brand: commodityDetail?.brandName,
        stockCount: currentSku.stockNum,
        minOrder: commodityDetail?.minOrder,
        commodityPic: currentSku?.commodityPic,
        attribute: currentSku?.commoditySkuAttributeList || [],
        isMemberPrice: commodityDetail?.isMemberPrice ? 1 : 0,
        taxRate: commodityDetail?.taxRate,
        priceType: commodityDetail?.priceType,
        vendorMemberName: commodityDetail?.memberName,
        vendorMemberId: commodityDetail?.memberId,
        vendorRoleId: commodityDetail?.memberRoleId,
        upperCommodityId: commodityDetail?.upperCommodityId,
        upperMemberId: commodityDetail?.upperMemberId,
        upperMemberName: commodityDetail?.upperMemberName,
        upperMemberRoleId: commodityDetail?.upperMemberRoleId,
        upperMemberRoleName: commodityDetail?.upperMemberRoleName,
        commodityAreaList: commodityDetail?.commodityAreaList,
        isCrossBorder: commodityDetail?.isCrossBorder,
        isAllArea: commodityDetail?.isAllArea,
        promotionType: hasActivity && activityProductQuantity !== null ? 5 : 0,
        promotions: getPromotions(),
        limitWay: commodityDetail?.salesAreaTemplate?.limitWay,
      }
      const sessionKey = `${commodityDetail?.id}${new Date().getTime()}`

      const buyOrderInfo: any = {
        orderType: getOrderType(useActivityPrice), // 订单类型
        logistics: commodityDetail?.logistics,
        requiredPay: payWayInfo?.required,
        payWayList: commodityDetail?.priceType === 3 ? pointPayWay.payTypes : payWayInfo?.payTypes,
        supplyMembersName: commodityDetail?.memberName,
        supplyMembersId: commodityDetail?.memberId,
        supplyMembersRoleId: commodityDetail?.memberRoleId,
        isInvoice: commodityDetail?.isInvoice,
        shopId: mallInfo?.id,
        hasContract: payWayInfo?.hasContract,
        contractId: payWayInfo?.contractId,
        payNodes: payWayInfo?.payNodes,
        orderList: [
          {
            id: shopInfo?.id,
            shopname: shopInfo?.name || shopInfo?.memberName,
            orderList: [buyCommodityInfo],
            shopAllPay: buyCommodityInfo.refPrice * buyCount,
          },
        ],
      }
      cacheOrderInfo(sessionKey, buyOrderInfo)
        .then(() => {
          LinkTo(linkPrefix(`/order?spam_id=${sessionKey}&type=${priceType}`))
          clickFlag.current = true
        })
        .catch(() => {
          clickFlag.current = true
        })
    }
  }

  const handleInquiry = () => {
    if (!checkoutUserInfo() || !commodityDetail) {
      return
    }

    if (!currentSku) {
      message.destroy()
      message.info(translate('web.resource.mall.qingxuanzeshangpinshuxing'))
      return
    }

    const values: Array<any>[] = []
    currentSku.commoditySkuAttributeList &&
      currentSku.commoditySkuAttributeList.forEach((item: any, i: number) => {
        values.push(item.customerAttributeValue.value)
      })
    const JoinValue = values.reverse().join('/')

    const inquiryParam = {
      id: currentSku.skuId,
      brandId: commodityDetail.brandId,
      brandName: commodityDetail.brandName,
      logistics: commodityDetail.logistics,
      memberId: commodityDetail.memberId,
      memberName: commodityDetail.memberName,
      memberRoleId: commodityDetail.memberRoleId,
      memberRoleName: commodityDetail.memberRoleName,
      name: `${commodityDetail.name}/${JoinValue}`,
      packing: commodityDetail.packing,
      unitName: commodityDetail.unitName,
      attribute: currentSku.commoditySkuAttributeList || [],
      category: commodityDetail?.customerCategoryName,
      imgUrl: commodityDetail.mainPic,
    }

    const sessionKey = `inquiry${currentSku.skuId}${new Date().getTime()}`
    cacheOrderInfo(sessionKey, inquiryParam).then(() => {
      LinkTo(
        `${MEMBER_CENTER_URL}/dealAbility/productInquiry/waitAddInquiry/rfq?id=${commodityId}&memberId=${userInfo?.memberId}&spam_id=${sessionKey}&commodityId=${commodityId}&shopId=${mallInfo?.id}`,
      )
    })
  }

  /**
   * 加入购物车
   */
  const handleAddToPurchase = async () => {
    if (!checkoutUserInfo()) {
      return
    }

    if (!currentSku) {
      message.destroy()
      message.info(translate('web.resource.mall.qingxuanzeshangpinshuxing'))
      return
    }

    if (hasActivity) {
      if (!(await checkActivityProductQuantity(1))) {
        return
      }
    }

    const minOrder = commodityDetail?.minOrder ? commodityDetail.minOrder : 1

    if (buyCount < minOrder) {
      message.destroy()
      message.info(translate('web.resource.mall.goumaishuliangbunengdiyuzuixiao'))
      return
    }

    if (clickFlag.current) {
      clickFlag.current = false
      const param: any = {
        commoditySkuId: currentSku?.skuId,
        count: buyCount,
      }

      const headers: any = {
        shopId: mallInfo?.id,
      }
      // 有换购商品的话
      if (
        marketingData &&
        marketingData.tagDetailList &&
        marketingData.tagDetailList.length > 0 &&
        marketingData.tagDetailList.find((item) => item.activityType === 13)
      ) {
        const purchaseBatchList = [
          {
            commoditySkuId: currentSku?.skuId,
            setMealId: currentSku?.skuId,
            purchaseCommodityType: 4, // 换购商品
            count: buyCount, // 默认一件
            isMain: true, // true 为主商品
            parentSkuId: undefined,
          },
        ]
        postProductMobileShopPurchaseSavePurchaseBatch({ purchaseBatchList }, { headers })
          .then((res: any) => {
            clickFlag.current = true
            if (res.code === 1000) {
              updatePurchaseList(mallInfo?.id)
              setAddSuccessVisible(true)
            }
          })
          .catch(() => {
            clickFlag.current = true
          })
      } else {
        postProductShopPurchaseSaveOrUpdatePurchase(param, { headers, ctlType: 'none' })
          .then((res: any) => {
            clickFlag.current = true
            if (res.code === 1000) {
              updatePurchaseList(mallInfo?.id)
              setAddSuccessVisible(true)
            } else {
              message.destroy()
              message.error(res.message)
            }
          })
          .catch(() => {
            clickFlag.current = true
          })
      }
    }
  }

  /**
   * 根据条件渲染页面按钮
   */
  const renderBtn = () => {
    if (commodityDetail?.isPublish) {
      switch (commodityDetail?.priceType) {
        case COMMODITY_TYPE.prompt:
          if (isMro) {
            return null
          }
          if ((currentSku && currentSku.stockNum > 0) || !userInfo) {
            if (isGroupBuy) {
              if (groupId) {
                return (
                  <Button
                    disabled={judegeGroupEndTime() || !inAreaState}
                    className={cx(styles.product_info_btn_item, styles.buy)}
                    onClick={() => handleToBuy(COMMODITY_TYPE.prompt, true)}
                  >
                    {judegeGroupEndTime()
                      ? translate('web.resource.mall.pintuanyijieshu')
                      : translate('web.resource.mall.canyutadepintuan')}
                  </Button>
                )
              } else {
                return (
                  <>
                    <Button
                      disabled={!inAreaState}
                      className={cx(styles.product_info_btn_item, styles.buy)}
                      onClick={() => handleToBuy(COMMODITY_TYPE.prompt, true)}
                    >
                      {translate('web.resource.mall.woyaokaituan')}
                    </Button>
                    <Button
                      disabled={!inAreaState}
                      className={cx(styles.product_info_btn_item, styles.add)}
                      onClick={() => handleToBuy(COMMODITY_TYPE.prompt, false)}
                    >
                      {translate('web.resource.mall.yuanjiagoumai')}
                    </Button>
                  </>
                )
              }
            } else {
              return (
                <>
                  <Button
                    disabled={!inAreaState}
                    className={cx(styles.product_info_btn_item, styles.buy)}
                    onClick={() => handleToBuy()}
                  >
                    {translate('web.resource.mall.lijidinggou')}
                  </Button>
                  <Button
                    disabled={!inAreaState}
                    className={cx(styles.product_info_btn_item, styles.add)}
                    onClick={() => handleAddToPurchase()}
                  >
                    <IconFont type="icon-xiadan" />
                    <span>{translate('web.resource.mall.jiarujinhuodan')}</span>
                  </Button>
                </>
              )
            }
          } else {
            return (
              <Button className={cx(styles.product_info_btn_item, styles.buy)}>
                {translate('web.resource.order.zanwukucun')}
              </Button>
            )
          }
        case COMMODITY_TYPE.inquiry:
          if (isMro) {
            return null
          }
          return (
            <div className={cx(styles.product_info_btn_item, styles.buy)} onClick={() => handleInquiry()}>
              {translate('web.resource.mall.lijixunjia')}
            </div>
          )
        case COMMODITY_TYPE.integral:
          return (currentSku && currentSku?.stockNum > 0) || !userInfo ? (
            <div
              className={cx(styles.product_info_btn_item, styles.buy)}
              onClick={() => handleToBuy(COMMODITY_TYPE.integral)}
            >
              {translate('web.resource.mall.lijiduihuan')}
            </div>
          ) : (
            <Button className={cx(styles.product_info_btn_item, styles.buy)}>
              {translate('web.resource.order.zanwukucun')}
            </Button>
          )
      }
    } else {
      return (
        <Button disabled className={cx(styles.product_info_btn_item, styles.buy)}>
          {translate('web.common.yixiajia')}
        </Button>
      )
    }
  }

  const renderPayWay = () => {
    if (commodityDetail.priceType === 3) {
      return pointPayWay.payTypes.map((item) => item.payTypeName).join(' ')
    }
    if (payWayInfo && payWayInfo.required) {
      if (payWayInfo.payTypes && payWayInfo.payTypes.length > 0) {
        return payWayInfo.payTypes.map((item) => item.payTypeName).join(' ')
      }
    } else if (payWayInfo && !payWayInfo.required) {
      return translate('web.resource.mall.wuxuzhifu')
    }
    return '-'
  }

  return (
    <HelmetProvider {...seoInfo}>
      <div
        className={cx(styles.commodity_detail)}
        style={!storeId && layoutType === LAYOUT_TYPE.joint ? { marginTop: 8 } : {}}
      >
        {!errorMsg && commodityDetail ? (
          <div className={styles.commodity_detail_container}>
            <div className={styles.commodity_detail_info_wrap}>
              <div className={styles.commodity_detail_info}>
                <Exhibition
                  imgList={
                    currentSku?.imgList && currentSku?.imgList.length > 0 ? currentSku?.imgList || [] : commodityImgList
                  }
                  commodityDetail={commodityDetail}
                />
                <div className={styles.product_info_container}>
                  <div className={styles.product_info}>
                    <div className={styles.product_info_name}>
                      <span>{commodityDetail?.name}</span>
                    </div>
                    <div className={styles.product_info_tags}>
                      <div className={styles.product_info_tags_item}>{commodityDetail?.slogan}</div>
                    </div>
                    <div className={styles.product_info_sellpoints}>
                      {commodityDetail?.sellingPoint &&
                        commodityDetail?.sellingPoint.length > 0 &&
                        commodityDetail?.sellingPoint.map((item: any, index: number) => (
                          <div className={styles.product_info_sellpoints_item} key={`product_info_tags_item_${index}`}>
                            {item}
                            {index !== commodityDetail?.sellingPoint.length - 1 ? ' ' : ''}
                          </div>
                        ))}
                    </div>
                    {/* 现货商品价格 */}
                    {commodityDetail?.priceType === COMMODITY_TYPE.prompt && (
                      <CommodityPrice
                        skuId={currentSku?.skuId}
                        productInfo={commodityDetail}
                        marketingData={marketingData}
                        commodityPriceInfo={currentSku?.ladder || []}
                        mallId={mallInfo?.id!}
                        hasActivity={hasActivity}
                        currentSku={currentSku}
                        parameter={parameter}
                        buyCount={buyCount}
                        groupDetail={currentGroupDetail}
                        activityPrice={getUnitPrice()}
                        type={type}
                        groupId={Number(groupId)}
                      />
                    )}
                    {/* 促销 */}
                    <Promotion data={marketingData?.tagDetailList} skuId={currentSku?.skuId} />
                    {/* 优惠券 */}
                    {marketingData?.canUseCoupon === 1 && commodityDetail?.priceType !== COMMODITY_TYPE.inquiry && (
                      <Coupons data={marketingData?.couponList} />
                    )}
                    {/* 配送 */}
                    <Delivery
                      productInfo={commodityDetail}
                      onAreaState={(state) => setInAreaState(state)}
                      setDeliveryStateMain={setDeliveryStateMain}
                      limitWay={commodityDetail?.salesAreaTemplate?.limitWay}
                    />
                    {commodityDetail?.sendCycle ? (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>
                          {translate('web.resource.commodity.fahuozhouqi')}
                        </div>
                        <div className={styles.product_info_line_brief}>
                          <span className={styles.text}>
                            {translate('web.resource.mall.xiadanhousendcycletianfahuo', {
                              sendCycle: commodityDetail?.sendCycle || 0,
                            })}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {/* sku信息 */}
                    <SkuInfo
                      skuId={Number(skuId)}
                      type={type}
                      productInfo={commodityDetail}
                      onSelect={(info) => setCurrentSku(info)}
                      currentSku={currentSku}
                    />
                    {commodityDetail?.priceType === COMMODITY_TYPE.integral && (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>
                          {translate('web.resource.commodity.suoxujifen')}
                          <Tooltip
                            placement="top"
                            title={translate('web.resource.mall.keshiyongpingtaitongyongjifenhuoshanghujifen')}
                          >
                            <QuestionCircleOutlined />
                          </Tooltip>
                        </div>
                        <div className={styles.product_info_line_brief}>
                          <span className={styles.text}>
                            {currentSku?.ladder && currentSku?.ladder[0]?.price}
                            {translate('web.resource.mall.fen')}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* 询价商品信息显示 */}
                    {commodityDetail?.priceType === COMMODITY_TYPE.inquiry ? (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>
                          {translate('web.resource.mall.kucunshuliang')}
                        </div>
                        <div className={styles.product_info_line_brief}>
                          <span className={styles.text}>
                            {userInfo ? (
                              `${numFormat(currentSku?.stockNum || 0)}${commodityDetail?.unitName || ''}`
                            ) : (
                              <label className={styles.nologin_stock}>
                                <i>（ </i>
                                <a href={LOGIN_DOMAIN} className={styles.nologin_link}>
                                  {translate('web.resource.mall.login')}
                                </a>
                                <span>{translate('web.resource.mall.chakankucun')}</span>
                                <i> ）</i>
                              </label>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : !isMro ? (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>
                          {commodityDetail?.priceType === COMMODITY_TYPE.prompt
                            ? translate('web.resource.mall.goumaishuliang')
                            : translate('web.resource.mall.duihuanshuliang')}
                        </div>
                        <div className={cx(styles.product_info_line_brief, styles.row)}>
                          <InputNumber
                            disabled={currentSku?.stockNum === 0}
                            value={buyCount}
                            min={commodityDetail?.minOrder || 1}
                            max={currentSku?.stockNum || 0}
                            onChange={(value: number) => setBuyCount(value)}
                          />
                          <span className={cx(styles.text, styles.mar_left_10)}>{commodityDetail?.unitName}</span>
                          <span className={cx(styles.text, styles.mar_left_10)}>
                            {userInfo ? (
                              `(${translate('web.resource.mall.kucun')}${numFormat(currentSku?.stockNum || 0)}${
                                commodityDetail?.unitName || ''
                              })`
                            ) : (
                              <label className={styles.nologin_stock}>
                                <i>（ </i>
                                <a href={LOGIN_DOMAIN} className={styles.nologin_link}>
                                  {translate('web.resource.mall.login')}
                                </a>
                                <span>{translate('web.resource.mall.chakankucun')}</span>
                                <i> ）</i>
                              </label>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {/* 积分商品信息显示 */}
                    {commodityDetail?.priceType !== COMMODITY_TYPE.integral && (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>
                          {translate('web.resource.mall.zuixiaogoumailiang')}
                        </div>
                        <div className={styles.product_info_line_brief}>
                          <span className={styles.text}>
                            {commodityDetail?.minOrder} {commodityDetail?.unitName}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={styles.product_info_btn_group}>{renderBtn()}</div>
                    {userInfo && userInfo.userId && (
                      <div className={styles.product_info_line}>
                        <div className={styles.product_info_line_label}>{translate('web.resource.mall.payType')}</div>
                        <div className={styles.product_info_line_brief}>
                          <span className={styles.text}>{renderPayWay()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* 组合套餐信息 */}
            {judgeIsGroupBuy(marketingData?.tagDetailList, MarketingTypeEnum.activity_type_15) && (
              <Combination
                commodityDetail={commodityDetail}
                productInfo={commodityDetail}
                activityInfo={getCombinationActivity}
                skuId={currentSku?.skuId}
                fnSuccess={fnHandleAddToPurchaseSuccesss}
                checkoutUserInfo={checkoutUserInfo}
                deliveryStateMain={deliveryStateMain}
              />
            )}

            {/* 拼团信息 */}
            {isGroupBuy && type === 3 && !groupId && (
              <GroupBuy
                skuId={currentSku?.skuId}
                productInfo={commodityDetail}
                activityPrice={getUnitPrice(false, true)}
                originalPrice={getUnitPrice(false, false)}
              />
            )}
            {isMro && (
              <MroModels
                CommodityDetail={commodityDetail}
                handleMroInquiry={handleMroInquiry}
                handleMroAddToPurchase={handleMroAddToPurchase}
              />
            )}
            <div className={styles.commodity_detail_body}>
              <div className={styles.commodity_detail_body_left}>
                {layoutType === LAYOUT_TYPE.shop && <ShopInfo />}
                <Interested priceType={commodityDetail?.priceType} />
              </div>
              <div className={styles.commodity_detail_body_right}>
                <ProductDescription
                  memberId={shopInfo?.memberId}
                  commodityDetail={commodityDetail}
                  dataList={commonCategoryCommodityList}
                  currentSku={currentSku}
                />
              </div>
            </div>
          </div>
        ) : (
          <ErrorResult errorMessage={errorMsg} />
        )}
      </div>
      <DialogModal
        purchaseCount={purchaseCount}
        visible={addSuccessVisible}
        setVisible={setAddSuccessVisible}
        commonCategoryCommodityList={commonCategoryCommodityList}
      />
    </HelmetProvider>
  )
}

export default CommodityDetail
