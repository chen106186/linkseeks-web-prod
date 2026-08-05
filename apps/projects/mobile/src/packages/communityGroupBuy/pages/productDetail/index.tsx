import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-29 18:45:01
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-06 16:20:42
 * @Description: 现货商品详情
 */
import React, { useState, useRef, useMemo, useEffect } from 'react'
import { View, Text, Button } from '@apps/mobile-ui'
import {
  useRouter,
  showLoading,
  hideLoading,
  showToast,
  hideToast,
  pxTransform,
} from '@apps/mobile-services/utils/taro'
import classNames from 'classnames'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { observer } from 'mobx-react-lite'
import { SHOP_TYPE } from '@/constants/const/shop'
import useProductConst from '@/hooks/useProductConst'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import Router from '@/utils/router'
import { priceFormat } from '@/utils/numberFormat'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import BusinessCard from '@/components/BusinessCard'
// import { GlobalConfig } from '@/constants/global';
import { ACTIVITY_SECKILL_NUMBER, ACTIVITY_SETMEAL_NUMBER } from '@/constants/const/activity'
import useCustomerService from '@/hooks/useCustomerService'
import useJmpHome from '@/hooks/useJmpHome'
import useCartType from '@/hooks/useCartType'
import { dateFormat } from '@/utils/date'
import { postProductShopPurchaseSaveOrUpdatePurchase, postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import useGetProductDetail from '../../hooks/useGetProductDetail'
import useGetPriceHistory from '../../hooks/useGetPriceHistory'
import useCollectionAction from '../../hooks/useCollectionAction'
import useGetShopInfo from '../../hooks/useGetShopInfo'
import useGetTradeSummary from '../../hooks/useGetTradeSummary'
import useGetTradeRecord from '../../hooks/useGetTradeRecord'
import useGetEvaluateRecord from '../../hooks/useGetEvaluateRecord'
import useGetMarketingCampaign from '../../hooks/useGetMarketingCampaign'
import useStockAddress from '../../hooks/useStockAddress'
import useGetCbgActivityDetail from '../../hooks/useGetCbgActivityDetail'
import Banner from '../../components/Banner'
import Bookshelf from '../../components/Bookshelf'
import EvaluateRecordCard from '../../components/EvaluateRecordCard'
import TransactionRecordCard from '../../components/TransactionRecordCard'
import ProductDescriptions from '../../components/Descriptions'
import Anchor from '../../components/Anchor'
import Gap from '../../components/Gap'
import SkuPopup, { SkuListItemType, SkuPopupRefHandle } from '../../components/SkuPopup'
import { normalizeSpecGroups, ProductSkuType } from '../../components/SkuPopup/utils'
import GoodsAction from '../../components/GoodsAction'
import BasicInfoCard from '../../components/BasicInfoCard'
import Stock from '../../components/Stock'
import StockAddressPopup from '../../components/StockAddressPopup'
import DeliveryCycle from '../../components/DeliveryCycle'
import HistoricalAnalysisBar from './components/HistoricalAnalysisBar'
import HistoricalAnalysisPopup from './components/HistoricalAnalysisPopup'
import MarketingCampaign from './components/MarketingCampaign'
import MarketingPopup from './components/MarketingPopup'
import SeckillWrap, { SeckillStatus } from './components/SeckillWrap'
import DiscountPackage from './components/DiscountPackage'
import DiscountPackagePopup from './components/DiscountPackagePopup'
import Taxes from './components/Taxes'
import TaxesPopup from './components/TaxesPopup'
import DeliveryTypePopup from './components/DeliveryTypePopup'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
type StocksSourcingDetailRouteParams = {
  /**
   * 是否显示IM图标, 如果是从IM界面跳过来的，就不显示
   */
  showIM: string
  /**
   * 商品id
   */
  commodityId: string
  /**
   * 渠道会员id
   */
  channelMemberId?: string
  /**
   * 商品 skuId，用于查详情接口，订单那边只保存了 skuId，
   * 所以要调别的接口来查询商品详情
   * 目前只有 评价那边跳转商品详情才是这样的
   */
  skuId?: string
  /**
   * 活动类型，预先渲染对应的东西，不然等接口响应之后再渲染体验不好
   * 1-特价促销 2-直降促销 3-折扣促销 4-满量促销 5-满额促销 6-赠送促销
   * 7-多件促销 8-组合促销 9-拼团 10-抽奖 11-砍价 12-秒杀 13-换购 14-预售
   * 15-套餐 16-试用
   */
  activityType?: string
  /**
   * 活动id
   */
  activityId?: string
  /**
   * 所属类型，1 平台 2 商家
   */
  belongType?: string
  /**
   * 团购活动id
   */
  cbgActivityId?: string
  /**
   * 团购团长id
   */
  cbgTeamLeaderId?: string
}

// const { customerServiceInfo } = GlobalConfig.global
const customerServiceInfo: any = {}
const StocksSourcingDetail: React.FC = () => {
  const { routerToCustomerService } = useCustomerService()
  const router = useRouter<StocksSourcingDetailRouteParams>()
  const {
    params: {
      commodityId,
      skuId,
      channelMemberId,
      activityType,
      activityId,
      belongType,
      cbgActivityId,
      cbgTeamLeaderId,
      showIM,
    },
  } = router
  const [form, setForm] = useState<'add' | 'buyNow' | 'both'>('buyNow')
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  const [visibleMarketing, setVisibleMarketing] = useState(false)
  const [visibleHistoricalAnalysis, setVisibleHistoricalAnalysis] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visibleDiscountPackagePopup, setVisibleDiscountPackagePopup] = useState(false)
  const [visibleTaxesPopup, setVisibleTaxesPopup] = useState(false)
  const [visibleDeliveryTypePopup, setVisibleDeliveryTypePopup] = useState(false)
  const [isSelfPickup, setIsSelfPickup] = useState(true)
  const {
    purchaseOrderStore: { setShopMessageStore },
    confirmOrderStore: { setstoreItem, setDeliveryType: setDeliveryTypeStore },
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const { jmpHome } = useJmpHome()
  const intl = useIntl()
  const { cartAddName, cartType } = useCartType()
  const formRef = useRef<'add' | 'buyNow' | 'both'>('buyNow')
  const skuPopupRef = useRef<SkuPopupRefHandle | null>(null)
  usePageInit()
  // 当前是否是 企业商城且商城属性为B端商城或C端商城时
  const isEnterpriseBCShop = !shopAndSite?.isSelf

  // 根据当前 商城类型 请求相应的 详情接口
  const normalHeaders = {
    type: SHOP_TYPE.ENTERPRISE,
  }
  const {
    banner,
    productInfo,
    skuList,
    setSkuList,
    currentSku,
    setCurrentSku,
    productReducer,
    getPayWay,
    productDispatch,
    vipParameter,
    renderPayWay,
    loading,
  } = useGetProductDetail({
    commodityId: +commodityId,
    skuId: skuId ? +skuId : undefined,
    from: null,
    channelMemberId: +channelMemberId!,
    cbgActivityId: cbgActivityId ? +cbgActivityId : 0,
  })
  const { showHistoricalAnalysis } = useGetPriceHistory({
    commodityId: +commodityId,
  })
  const { isCollected, handleCollect } = useCollectionAction({
    productInfo,
    channelMemberId: +channelMemberId!,
  })
  const { supplierInfo } = useGetShopInfo({
    productInfo,
  })
  const { tradeSummary } = useGetTradeSummary({
    commodityId: +commodityId,
  })
  const { transactionRecordLoading, transactionRecord } = useGetTradeRecord({
    commodityId: +commodityId,
  })
  const { evaluateRecordLoading, evaluateRecord } = useGetEvaluateRecord({
    commodityId: +commodityId,
  })
  const { marketingCampaign, getMarketingCampaign, seckillStatus, fetchCheckQuantity } = useGetMarketingCampaign({
    dispatch: productDispatch,
    skuList,
    setCurrentSku,
    productInfo,
    skuId: skuId ? +skuId : undefined,
    channelMemberId: +channelMemberId!,
    cbgActivityId: cbgActivityId ? +cbgActivityId : 0,
  })
  const {
    visibleStockAddressPopup,
    handleVisibleStockAddressPopup,
    stockAddress,
    handleStockAddressChange,
    stockStatus,
    handleStockStatusChange,
  } = useStockAddress()
  const {
    detail: activityDetail,
    productList,
    pickupPoint,
  } = useGetCbgActivityDetail({
    activityId: cbgActivityId ? +cbgActivityId : 0,
    teamLeaderId: cbgTeamLeaderId ? +cbgTeamLeaderId : 0,
  })
  useEffect(() => {
    if (activityDetail?.deliveryType === 1) {
      setIsSelfPickup(false)
    }
  }, [activityDetail])
  const handleSkuList = useMemo(() => {
    let list = JSON.parse(JSON.stringify(skuList))
    let map = {}
    for (const good of productList) {
      if (good.productId === productInfo?.id) {
        for (const sku of good.skuList) {
          map[sku.skuId] = sku.stockNum
        }
        break
      }
    }
    for (const sku of list) {
      let stockNum = Math.min(sku.stockNum, map[sku.skuId])
      sku.stockNum = stockNum
      if (currentSku.skuId === sku.skuId) {
        setCurrentSku(Object.assign({}, currentSku, { stockNum }))
      }
    }
    return list
  }, [productList, skuList])

  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }
  const handleVisibleSkuPopup = (flag?: boolean) => {
    setVisibleSkuPopup(!!flag)
  }
  const handleJumpShop = () => {
    // 跳转店铺
    // Router.navigateTo('members/shop', { shopId: isNotChannelShop ? productInfo?.storeId : productInfo?.memberId });
  }
  const handleJumpKefu = () => {}

  /**
   * Handles the "Buy Both" action:
   * - Checks if user is logged in (redirects to login if not)
   * - Sets the form type to 'both'
   * - Opens the SKU selection popup
   */
  const handleBuyBoth = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm('both')
    formRef.current = 'both'
    handleVisibleSkuPopup(true)
  }
  const handleAdd = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm('add')
    formRef.current = 'add'
    handleVisibleSkuPopup(true)
  }
  const handleAdd2 = () => {
    formRef.current = 'add'
    skuPopupRef.current?.onConfirm()
  }
  const handleBuyNow = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    setForm('buyNow')
    formRef.current = 'buyNow'
    handleVisibleSkuPopup(true)
  }
  const handleBuyNow2 = () => {
    formRef.current = 'buyNow'
    skuPopupRef.current?.onConfirm()
  }
  const handleSkuChange2 = async (value: SkuListItemType) => {
    // 断言一下下
    setCurrentSku(value as ProductSkuType)
    if (!productInfo) {
      return
    }
    getMarketingCampaign({
      shopId: shopAndSite?.id!,
      categoryId: productInfo?.customerCategoryId,
      brandId: productInfo?.brandId,
      productId: productInfo.id,
      memberId: productInfo.memberId,
      roleId: productInfo.memberRoleId,
      skuId: value.skuId,
    })
    if (userInfo) {
      getPayWay(productInfo.memberId, productInfo.memberRoleId, {
        productId: productInfo.id,
        skuId: value.skuId,
        freightType: productInfo.logistics?.carriageType,
        crossBorder: productInfo.isCrossBorder,
      })
    }
    productDispatch({
      type: 'setProductMiniInfo',
      payload: {
        ladderPrice: (value as ProductSkuType).ladderPrice,
        aboutPrice: (value as ProductSkuType).aboutPrice,
        vipPrice: vipParameter.current
          ? +((value as ProductSkuType).ladderPrice * vipParameter.current).toFixed(2)
          : productReducer.vipPrice,
        originalPrice: (value as ProductSkuType).ladder[0]?.price || 0, // 取第一阶梯的价格
      },
    })
  }

  // 购买数量改变
  const handleStepperChange = (value: number) => {
    let newData: ProductSkuType = {
      ...currentSku,
    }
    newData.quantity = value
    if (newData.ladder.length) {
      // 如果 找不到 active，说明当前数量超过了已有的价格区间，取最后一个价格区间为准
      // 当然这样不够严谨，如果数量小于 0 的话就不适用了
      // 但是当前场景不会出现 数量小于 0 的情况
      const current = newData.ladder.findIndex(
        (ladderItem, i) =>
          (value >= ladderItem.star && value <= ladderItem.end) ||
          (newData.ladder[i + 1] && value > ladderItem.end && value < newData.ladder[i + 1].star),
      )
      const active = current !== -1 ? current : newData.ladder.length - 1
      newData = Object.assign(newData, {
        active,
        priceValue: newData.ladder[active].price,
      })
      productDispatch({
        type: 'setProductMiniInfo',
        payload: {
          ladderPrice: newData.ladder[active].price,
          vipPrice: vipParameter.current
            ? +(newData.ladder[active].price * vipParameter.current).toFixed(2)
            : productReducer.vipPrice,
        },
      })
    }
    setCurrentSku(newData)
  }

  // sku确认
  const handleSkuConfirm = async (value: SkuListItemType) => {
    if (confirmLoading) {
      return
    }
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    hideToast()
    if (value.quantity <= 0) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.required',
          defaultMessage: '请选择购买数量',
        }),
        icon: 'none',
      })
    }
    if (value.quantity < productInfo?.minOrder!) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.quantity.legal',
          defaultMessage: '购买数量不可小于商品起订量',
        }),
        icon: 'none',
      })
    }
    if (!currentSku.stockNum) {
      return showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.soldOut',
          defaultMessage: '暂无库存，看看其他的吧',
        }),
        icon: 'none',
      })
    }
    setConfirmLoading(true)
    switch (formRef.current) {
      // 加入购物车
      case 'add': {
        console.log(marketingCampaign, 'marketingCampaign')
        // 判断当前商品是否有营销活动，有则调用接口判断购买数量是否超过活动限购数量
        if (marketingCampaign && marketingCampaign.tagDetailList) {
          const pass = await fetchCheckQuantity(1, value.skuId, value.quantity)
          if (!pass) {
            setConfirmLoading(false)
            return
          }
        }
        showLoading({
          title: intl.formatMessage({
            id: 'commodityMerge.common.loading',
            defaultMessage: '正在加载...',
          }),
          mask: true,
        })
        try {
          let promises: any[] = []
          const hasExchangeActivity =
            marketingCampaign?.tagDetailList &&
            marketingCampaign?.tagDetailList.length > 0 &&
            marketingCampaign?.tagDetailList.find((item) => item.activityType === 13)
          if (hasExchangeActivity) {
            const purchaseBatchList = [
              {
                commoditySkuId: value.skuId,
                count: value.quantity,
                purchaseCommodityType: 4,
                // 当前秒杀状态未活动中则传入 3，否则 1 普通购买
                setMealId: value.skuId,
                isMain: true,
                // true 为主商品
                parentSkuId: undefined,
              },
            ]
            promises = [
              postProductMobileShopPurchaseSavePurchaseBatch(
                {
                  purchaseBatchList,
                },
                {
                  headers: normalHeaders,
                },
              ),
            ]
          } else {
            let postData = {
              commoditySkuId: value.skuId,
              count: value.quantity,
            }
            if (cbgActivityId) {
              Object.assign(postData, {
                purchaseCommodityType: 1,
                cbgActivityId: +cbgActivityId,
                cbgTeamLeaderId: pickupPoint?.teamLeaderId,
              })
            } else {
              Object.assign(postData, {
                purchaseCommodityType: seckillStatus.current === 'active' ? 3 : hasExchangeActivity ? 4 : 1,
                // 当前秒杀状态未活动中则传入 3，否则 1 普通购买
                setMealId: hasExchangeActivity ? value.skuId : undefined,
              })
            }
            promises = [
              postProductShopPurchaseSaveOrUpdatePurchase(postData, {
                headers: normalHeaders,
              }),
            ]
          }
          Promise.all(promises)
            .finally(() => {
              hideLoading()
              setConfirmLoading(false)
            })
            .then((responses) => {
              hideToast()
              if (responses.every((item) => item.code === 1000)) {
                showToast({
                  title: intl.formatMessage({
                    id: 'commodityMerge.soleSourcingDetail.cart.success',
                    cartType,
                  }),
                  icon: 'none',
                })
              } else {
                showToast({
                  title: responses[0].message,
                  icon: 'none',
                })
              }
            })
        } catch (error: any) {
          hideToast()
          showToast({
            title: error?.message,
            icon: 'none',
          })
        }
        break
      }
      // 立即购买
      case 'buyNow': {
        // 判断当前商品是否有营销活动，有则调用接口判断购买数量是否超过活动限购数量
        if (marketingCampaign && marketingCampaign.tagDetailList) {
          const pass = await fetchCheckQuantity(2, value.skuId, value.quantity)
          if (!pass) {
            setConfirmLoading(false)
            return
          }
        }
        showLoading({
          title: intl.formatMessage({
            id: 'commodityMerge.common.loading',
            defaultMessage: '正在加载...',
          }),
          mask: true,
        })
        const sku = productInfo?.commoditySkuList.find((item) => item.id === currentSku.skuId)
        const payload = {
          [`shopId_${productInfo?.memberId}`]: [
            {
              activityDetails:
                marketingCampaign && marketingCampaign.tagDetailList
                  ? marketingCampaign.tagDetailList.map((item) => ({
                      activityId: item.activityId,
                      preferentialTag: item.preferentialTag,
                      activityType: item.activityType,
                      belongType: item.belongType,
                      startTime: dateFormat(new Date(item.startTime), 'YYYY-MM-DD'),
                      endTime: dateFormat(new Date(item.endTime), 'YYYY-MM-DD'),
                      canUseCoupon: marketingCampaign.canUseCoupon,
                      concreteType: item.concreteType,
                      ladders: item.ladders,
                    }))
                  : [],
              brandId: productInfo?.brandId,
              brandName: productInfo?.brandName,
              commodityId: productInfo?.id,
              commodityLogo: productInfo?.mainPic,
              commoditySku: sku?.commoditySkuAttributeList.map((item) => ({
                name: item.customerAttribute?.name,
                value: item.customerAttributeValue?.value,
                id: item.id,
              })),
              count: currentSku.quantity,
              customerCategoryId: productInfo?.customerCategoryId,
              customerCategoryName: productInfo?.customerCategoryName,
              estimatePrice: 0,
              // 预计到手价，购物车那边说不用传
              id: 0,
              // 购物车id，无
              isMemberPrice: productInfo?.isMemberPrice,
              isPublish: productInfo?.isPublish,
              logistics: productInfo?.logistics,
              memberId: productInfo?.memberId,
              memberName: productInfo?.memberName,
              memberRoleId: productInfo?.memberRoleId,
              minOrder: productInfo?.minOrder,
              name: productInfo?.name,
              newAction: currentSku?.active,
              // 当前阶梯
              newPrice: productReducer?.ladderPrice,
              // 当前价格，购物车那边说目前只传阶梯价哇
              parameter: vipParameter.current,
              priceType: productInfo?.priceType,
              skuId: currentSku.skuId,
              stockCount: currentSku.stockNum,
              taxRate: productInfo?.taxRate,
              topActivityDetail: {},
              // 购物车那边说是 顶部的活动，不用传哇
              unitName: productInfo?.unitName,
              unitPrice: sku?.unitPrice,
              upperCommodityId: productInfo?.upperCommodityId,
              upperMemberId: productInfo?.upperMemberId,
              upperMemberName: productInfo?.upperMemberName,
              upperMemberRoleId: productInfo?.upperMemberRoleId,
              upperMemberRoleName: productInfo?.upperMemberRoleName,
              storeId: productInfo?.storeId,
              storeLogo: productInfo?.storeLogo || supplierInfo?.logo,
              storeName: productInfo?.storeName || supplierInfo?.name,
              commodityAreaList: productInfo?.commodityAreaList,
              limitWay: productInfo?.salesAreaTemplate?.limitWay,
              isAllArea: productInfo?.isAllArea,
              isCrossBorder: productInfo?.isCrossBorder,
            },
          ],
        }
        setShopMessageStore(payload)
        hideLoading()
        setConfirmLoading(false)
        setDeliveryTypeStore(activityDetail.deliveryType)
        setstoreItem(pickupPoint)
        Router.navigateTo('order/ConfirmOrder', {
          cbgActivityId,
          cbgTeamLeaderId,
          defaultDeliveryType: isSelfPickup ? '2' : '1',
        })
        break
      }
      default:
        break
    }
  }
  const handleVisibleVisibleHistoricalAnalysis = (flag?: boolean) => {
    setVisibleHistoricalAnalysis(!!flag)
  }
  const handleVisibleMarketing = (flag?: boolean) => {
    setVisibleMarketing(!!flag)
  }
  const handleVisibleDiscountPackagePopup = (flag?: boolean) => {
    setVisibleDiscountPackagePopup(!!flag)
  }
  const handleVisibleTaxesPopup = (flag?: boolean) => {
    setVisibleTaxesPopup(!!flag)
  }

  /**
   * 秒杀状态改变触发事件
   * @param status 秒杀状态
   */
  const handleSeckillStatusChange = (status: SeckillStatus) => {
    seckillStatus.current = status
    if (status === 'wait' || status === 'end') {
      productDispatch({
        type: 'setProductMiniInfo',
        payload: {
          activePrive: 0,
        },
      })
    }
    if (status === 'active') {
      productDispatch({
        type: 'setProductMiniInfo',
        payload: {
          activePrive: productReducer.seckillPrice,
        },
      })
    }
  }
  const customRenderPrice = () => (
    <>
      <View className="product-priceWrap">
        {!marketingCampaign?.seckillStartTime ? (
          <View className="product-priceWrap-left">
            <>
              <Text className="product-price">
                {`${intl.formatMessage({
                  id: 'currency',
                  defaultMessage: '¥',
                })} ${
                  priceFormat(productReducer?.activePrive) || priceFormat(currentSku?.ladder?.[0]?.price) || '0.00'
                }`}
              </Text>
              <Text className="product-unit">
                {productInfo && productInfo.unitName ? `/${productInfo?.unitName}` : ''}
              </Text>
            </>
            <>
              {productReducer?.aboutPrice ? (
                <Text className="product-price__about">
                  {`${intl.formatMessage({
                    id: 'commodityMerge.common.aboutPrice',
                    defaultMessage: '折合约',
                  })}${intl.formatMessage({
                    id: 'currency',
                    defaultMessage: '¥',
                  })} ${priceFormat(productReducer?.aboutPrice)}`}
                </Text>
              ) : null}
              {productReducer?.aboutPrice && productInfo?.subUnitName ? (
                <Text className="product-unit">{`/${productInfo?.subUnitName}`}</Text>
              ) : null}
            </>
          </View>
        ) : null}
      </View>
      {/* 商品定价，有活动价的时候才展示 */}
      {productReducer?.activePrive ? (
        <View className="product-originWrap">
          <Text className="product-price__original">
            {intl.formatMessage({
              id: 'commodityMerge.common.pricing',
              defaultMessage: '定价',
            })}
          </Text>
          <Text className={classNames('product-price__original', 'product-price__through')}>
            {intl.formatMessage({
              id: 'currency',
              defaultMessage: '¥',
            })}
            {priceFormat(productInfo?.min)}
          </Text>
        </View>
      ) : null}
    </>
  )

  // 按钮禁用
  // 目前只有不可以配送状态时
  // 如有需要也可再拆分两个变量各自控制 加入购物车、立即购买的状态
  const actionsDisabled = stockStatus === 0
  const customRenderFoot = () => (
    <>
      {/* 历史价格曲线 */}
      {showHistoricalAnalysis ? (
        <HistoricalAnalysisBar
          skuId={currentSku.skuId}
          currentPrice={currentSku.price}
          unit={productInfo?.unitName}
          onJump={() => handleVisibleVisibleHistoricalAnalysis(true)}
        />
      ) : null}
    </>
  )
  const renderActions = () => {
    if (loading) {
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            {intl.formatMessage({
              id: 'commodityMerge.common.loading',
              defaultMessage: '正在加载...',
            })}
          </Button>
        </GoodsAction.Button>
      )
    }
    if (productInfo?.priceType === PRICE_TYPE_ENUM.GIFT) {
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            {intl.formatMessage({
              id: 'commodityMerge.common.gift',
              defaultMessage: '赠品不可购买',
            })}
          </Button>
        </GoodsAction.Button>
      )
    }
    if (productInfo?.isPublish) {
      return (
        <>
          <GoodsAction.Button>
            <Button
              className="button-elegant"
              type="secondary"
              onClick={handleAdd}
              loading={confirmLoading && formRef.current === 'add'}
              disabled={actionsDisabled}
            >
              {cartAddName}
            </Button>
          </GoodsAction.Button>
          <GoodsAction.Button>
            <Button
              type="primary"
              onClick={handleBuyNow}
              loading={confirmLoading && formRef.current === 'buyNow'}
              disabled={actionsDisabled}
            >
              {intl.formatMessage({
                id: 'commodityMerge.soleSourcingDetail.buy',
                defaultMessage: '立即购买',
              })}
            </Button>
          </GoodsAction.Button>
        </>
      )
    }
    return (
      <GoodsAction.Button>
        <Button type="primary" disabled>
          {intl.formatMessage({
            id: 'commodityMerge.common.removed',
            defaultMessage: '商品已下架',
          })}
        </Button>
      </GoodsAction.Button>
    )
  }
  const renderSkuPaneActions = () => {
    if (loading) {
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            {intl.formatMessage({
              id: 'commodityMerge.common.loading',
              defaultMessage: '正在加载...',
            })}
          </Button>
        </GoodsAction.Button>
      )
    }
    if (productInfo?.priceType === PRICE_TYPE_ENUM.GIFT) {
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            {intl.formatMessage({
              id: 'commodityMerge.common.gift',
              defaultMessage: '赠品不可购买',
            })}
          </Button>
        </GoodsAction.Button>
      )
    }
    if (productInfo?.isPublish) {
      return (
        <>
          <GoodsAction.Button>
            <Button
              className="button-elegant"
              type="secondary"
              onClick={handleAdd2}
              loading={confirmLoading && formRef.current === 'add'}
              disabled={actionsDisabled}
            >
              {cartAddName}
            </Button>
          </GoodsAction.Button>
          <GoodsAction.Button>
            <Button
              type="primary"
              onClick={handleBuyNow2}
              loading={confirmLoading && formRef.current === 'buyNow'}
              disabled={actionsDisabled}
            >
              {intl.formatMessage({
                id: 'commodityMerge.soleSourcingDetail.buy',
                defaultMessage: '立即购买',
              })}
            </Button>
          </GoodsAction.Button>
        </>
      )
    }
    return (
      <GoodsAction.Button>
        <Button type="primary" disabled>
          {intl.formatMessage({
            id: 'commodityMerge.common.removed',
            defaultMessage: '商品已下架',
          })}
        </Button>
      </GoodsAction.Button>
    )
  }
  const skuGroups = useMemo(
    () => normalizeSpecGroups(productInfo?.commoditySkuList as any),
    [productInfo?.commoditySkuList],
  )
  const basicInfoCardData = useMemo(
    () => ({
      name: productInfo?.name,
      slogan: productInfo?.slogan,
      sellingPoint: productInfo?.sellingPoint,
    }),
    [productInfo],
  )
  const isHasPackage = +activityType! === ACTIVITY_SETMEAL_NUMBER || marketingCampaign?.isPackage
  // 单体活动数据
  const lonelyParty = marketingCampaign?.tagDetailList?.[0]
  return (
    <>
      <PageLayout
        renderHeader={
          <>
            <NavBar
              title={intl.formatMessage({
                id: 'commodityMerge.common.nav',
                defaultMessage: '商品详情',
              })}
            />
          </>
        }
      >
        <Anchor customClassName="stocksSourcing-detail-anchor">
          <View className="stocksSourcing-detail">
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.product',
                defaultMessage: '商品',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* 商品图 */}
              <Banner banner={banner} />
              <Gap />
              {/* 基本信息 */}
              {activityType !== `${ACTIVITY_SECKILL_NUMBER}` && !marketingCampaign?.seckillStartTime ? (
                <BasicInfoCard
                  data={basicInfoCardData}
                  customRenderPrice={customRenderPrice}
                  customRenderFoot={customRenderFoot}
                />
              ) : null}
              {/* 秒杀信息 */}
              {activityType === `${ACTIVITY_SECKILL_NUMBER}` || marketingCampaign?.seckillStartTime ? (
                <SeckillWrap
                  startTime={marketingCampaign?.seckillStartTime!}
                  endTime={marketingCampaign?.seckillEndTime!}
                  serverTime={marketingCampaign?.serverTime!}
                  seckillPrice={productReducer?.seckillPrice!}
                  wasPrice={productReducer.originalPrice}
                  vipPrice={productReducer.vipPrice}
                  activityEndTime={lonelyParty?.endTime!}
                  pricing={productReducer?.ladderPrice!}
                  onSeckillStatusChange={handleSeckillStatusChange}
                >
                  <BasicInfoCard
                    data={basicInfoCardData}
                    customRenderPrice={() => (
                      <>
                        {!marketingCampaign?.seckillStartTime || !marketingCampaign?.seckillEndTime
                          ? customRenderPrice()
                          : null}
                      </>
                    )}
                    customRenderFoot={customRenderFoot}
                  />
                </SeckillWrap>
              ) : null}
              {/* 优惠活动 */}
              {marketingCampaign &&
              (marketingCampaign.couponList?.length || marketingCampaign.tagDetailList?.length) ? (
                <>
                  <Gap />
                  <MarketingCampaign data={marketingCampaign} onClick={() => handleVisibleMarketing(true)} />
                </>
              ) : null}
              {/* 其他信息 */}
              <Gap />
              <MellowCard
                bodyStyle={{
                  paddingTop: pxTransform(0),
                  paddingBottom: pxTransform(0),
                }}
              >
                <Bookshelf
                  labelWidth={64}
                  customStyle={{
                    paddingRight: pxTransform(0),
                    paddingLeft: pxTransform(0),
                  }}
                >
                  {skuGroups.length > 0 ? (
                    <Bookshelf.Item
                      label={intl.formatMessage({
                        id: 'commodityMerge.common.sku.selected',
                        defaultMessage: '已选',
                      })}
                      content={
                        currentSku.specNames.length
                          ? currentSku.specNames.join('；')
                          : intl.formatMessage({
                              id: 'commodityMerge.common.sku.required',
                              defaultMessage: '请选择规格',
                            })
                      }
                      onPress={handleBuyBoth}
                      isLink
                    />
                  ) : null}
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.min',
                      defaultMessage: '起订量',
                    })}
                    content={`${productInfo && productInfo.minOrder ? productInfo.minOrder : ''}${
                      productInfo && productInfo.unitName ? `${productInfo?.unitName}` : ''
                    }`}
                  />
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.deliveryType',
                      defaultMessage: '配送',
                    })}
                    content={
                      activityDetail?.deliveryType
                        ? isSelfPickup
                          ? '自提'
                          : '物流'
                        : productInfo && productInfo.logistics
                        ? `${DELIVERY_TYPE_TEXT[productInfo?.logistics?.deliveryType] || ''}`
                        : ''
                    }
                    isLink={activityDetail?.deliveryType === 3}
                    onPress={() => {
                      if (activityDetail?.deliveryType === 3) {
                        setVisibleDeliveryTypePopup(true)
                      }
                    }}
                  />
                  <Taxes
                    onJump={() => handleVisibleTaxesPopup(true)}
                    crossBorder={!!productInfo?.isCrossBorder}
                    taxes={productInfo?.taxRate || 0}
                    price={productReducer.vipPrice || currentSku?.ladder?.[0]?.price}
                  />
                  <Stock
                    unlimited={productInfo?.isAllArea!}
                    areas={productInfo?.commodityAreaList!}
                    address={stockAddress!}
                    isSelfPickup={isSelfPickup}
                    onJump={() => {
                      if (isSelfPickup) return
                      handleVisibleStockAddressPopup(true)
                    }}
                    onStatusChange={handleStockStatusChange}
                    shippingAddressId={productInfo?.logistics?.sendAddressId!}
                    deliveryType={productInfo?.logistics?.deliveryType!}
                    limitWay={productInfo?.salesAreaTemplate?.limitWay}
                    pickupPoint={pickupPoint}
                  />
                  <DeliveryCycle days={productInfo?.sendCycle!} />
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.payMethod',
                      defaultMessage: '支付',
                    })}
                    content={renderPayWay()}
                    customStyle={{
                      alignItems: 'flex-start',
                    }}
                  />
                </Bookshelf>
              </MellowCard>
              {/* 采购商名片 */}
              {isEnterpriseBCShop ? (
                <>
                  <Gap />
                  <MellowCard>
                    <BusinessCard
                      data={supplierInfo}
                      describeExtra={
                        <Text className="shop-volume">
                          {`${productInfo ? productInfo.sold || 0 : 0}${intl.formatMessage({
                            id: 'commodityMerge.common.sold',
                            defaultMessage: '成交',
                          })}`}
                        </Text>
                      }
                      extra={
                        supplierInfo.id && (
                          <Button type="secondary" size="small" circle>
                            {intl.formatMessage({
                              id: 'commodityMerge.common.visit',
                              defaultMessage: '进店',
                            })}
                          </Button>
                        )
                      }
                      onClick={handleJumpShop}
                    />
                  </MellowCard>
                </>
              ) : null}
              {/* 优惠套餐 */}
              {isHasPackage ? (
                <>
                  <Gap />
                  <DiscountPackage
                    activityId={+activityId! || lonelyParty?.activityId || 0}
                    belongType={+belongType! || lonelyParty?.belongType || 0}
                    skuId={currentSku.skuId}
                    onJump={() => handleVisibleDiscountPackagePopup(true)}
                  />
                </>
              ) : null}
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.reviews',
                defaultMessage: '评价',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* 评价 */}
              <Gap />
              <EvaluateRecordCard
                dataSource={evaluateRecord.data}
                loading={evaluateRecordLoading}
                tradeSummary={tradeSummary}
                params={{
                  commodityId: +commodityId,
                  shopType: 1,
                }}
              />
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.transaction',
                defaultMessage: '成交',
              })}
              customClassName="stocksSourcing-detail-anchor-item"
            >
              {/* 交易记录 */}
              <Gap />
              <TransactionRecordCard
                title={intl.formatMessage({
                  id: 'commodityMerge.common.transaction.record',
                  defaultMessage: '交易记录',
                })}
                dataSource={transactionRecord}
                loading={transactionRecordLoading}
                priceType={productInfo && productInfo.priceType ? productInfo.priceType : 0}
                params={{
                  commodityId: +commodityId,
                  shopId: shopAndSite?.id || 0,
                }}
              />
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.details',
                defaultMessage: '详情',
              })}
            >
              {/* 商品媒体 */}
              <ProductDescriptions commodityRemarkList={(productInfo?.commodityRemarkList as any[]) || []} />
            </Anchor.Item>
          </View>
        </Anchor>
      </PageLayout>
      <View className="stocksSourcing-detail-fixedWrap stocksSourcing-detail-fixedAction">
        <GoodsAction>
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'communityGroupBuy.commodity.dianpu',
              defaultMessage: '店铺',
            })}
            icon="Storefront"
            onClick={handleJumpShop}
          />
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'communityGroupBuy.commodity.kefu',
              defaultMessage: '客服',
            })}
            icon="Chat"
            onClick={handleJumpKefu}
          />
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'commodityMerge.common.list',
              defaultMessage: '收藏',
            })}
            icon={!isCollected ? 'Star' : 'StarFill'}
            color={!isCollected ? '#303133' : '#D32F2F'}
            onClick={() => handleCollect(productInfo?.id!, isCollected)}
          />
          {renderActions()}
        </GoodsAction>
      </View>
      {/* SKU选择弹窗 */}
      <SkuPopup
        visible={visibleSkuPopup}
        productInfo={productReducer}
        groups={skuGroups}
        skuList={handleSkuList}
        commoditySkuList={productInfo?.commoditySkuList}
        onClose={() => handleVisibleSkuPopup(false)}
        value={currentSku}
        onChange={handleSkuChange2}
        onStepperChange={handleStepperChange}
        onConfirm={handleSkuConfirm}
        confirmLoading={confirmLoading}
        ref={skuPopupRef}
        customRenderActions={
          form === 'both' ? (
            <View className="stocksSourcing-detail-fixedAction">
              <GoodsAction safeAreaInsetBottom={false}>{renderSkuPaneActions()}</GoodsAction>
            </View>
          ) : null
        }
        confirmDisabled={actionsDisabled}
      />
      <HistoricalAnalysisPopup
        visible={visibleHistoricalAnalysis}
        onClose={() => handleVisibleVisibleHistoricalAnalysis(false)}
        skuId={currentSku.skuId}
        currentPrice={currentSku.price}
        unit={productInfo?.unitName}
      />
      {/* 优惠活动弹窗 */}
      {/* 这里本身是放在 MarketingCampaign组件里边的，但是如果放里边要正常显示必须使用 Modal，这就跟 Toast 冲突了，Toast展示不出来 */}
      {marketingCampaign && (
        <MarketingPopup
          data={marketingCampaign}
          visible={visibleMarketing}
          onClose={() => handleVisibleMarketing(false)}
          shopId={shopAndSite?.id!}
          skuId={currentSku?.skuId}
        />
      )}
      {/* 套餐弹窗 */}
      {isHasPackage ? (
        <DiscountPackagePopup
          activityId={+activityId! || lonelyParty?.activityId || 0}
          belongType={+belongType! || lonelyParty?.belongType || 0}
          skuId={currentSku.skuId}
          visible={visibleDiscountPackagePopup}
          onClose={() => handleVisibleDiscountPackagePopup(false)}
        />
      ) : null}
      {/* 配送至弹窗 */}
      <StockAddressPopup
        visible={visibleStockAddressPopup}
        onClose={() => handleVisibleStockAddressPopup(false)}
        onChange={handleStockAddressChange}
      />
      {/* 税费弹窗 */}
      <TaxesPopup
        visible={visibleTaxesPopup}
        onClose={() => handleVisibleTaxesPopup(false)}
        crossBorder={!!productInfo?.isCrossBorder}
        taxes={productInfo?.taxRate || 0}
        price={productReducer.vipPrice || currentSku?.ladder?.[0]?.price}
      />
      {/* 配送方式弹窗 */}
      <DeliveryTypePopup
        visible={visibleDeliveryTypePopup}
        defaultValue={isSelfPickup ? 2 : 1}
        deliveryType={activityDetail.deliveryType}
        onClose={() => {
          setVisibleDeliveryTypePopup(false)
        }}
        onConfirm={(value) => {
          setVisibleDeliveryTypePopup(false)
          setIsSelfPickup(value === 2)
        }}
      />
    </>
  )
}
export default GlobalWrapper(observer(StocksSourcingDetail))
