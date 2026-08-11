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
  getLaunchOptionsSync,
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
import { ACTIVITY_SECKILL_NUMBER, ACTIVITY_SETMEAL_NUMBER } from '@/constants/const/activity'
import useCustomerService from '@/hooks/useCustomerService'
import useJmpHome from '@/hooks/useJmpHome'
import useCartType from '@/hooks/useCartType'
import { dateFormat } from '@/utils/date'
import { postProductShopPurchaseSaveOrUpdatePurchase, postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import useGetProductDetail from '../../../hooks/useGetProductDetail'
import useGetPriceHistory from '../../../hooks/useGetPriceHistory'
import useCollectionAction from '../../../hooks/useCollectionAction'
import useGetShopInfo from '../../../hooks/useGetShopInfo'
import useGetTradeSummary from '../../../hooks/useGetTradeSummary'
import useGetTradeRecord from '../../../hooks/useGetTradeRecord'
import useGetEvaluateRecord from '../../../hooks/useGetEvaluateRecord'
import useGetMarketingCampaign from '../../../hooks/useGetMarketingCampaign'
import useStockAddress from '../../../hooks/useStockAddress'
import Banner from '../../../components/Banner'
import Bookshelf from '../../../components/Bookshelf'
import EvaluateRecordCard from '../../../components/EvaluateRecordCard'
import TransactionRecordCard from '../../../components/TransactionRecordCard'
import ProductDescriptions from '../../../components/Descriptions'
import Anchor from '../../../components/Anchor'
import Gap from '../../../components/Gap'
import SkuPopup, { SkuListItemType, SkuPopupRefHandle } from '../../../components/SkuPopup'
import { normalizeSpecGroups, ProductSkuType } from '../../../components/SkuPopup/utils'
import GoodsAction from '../../../components/GoodsAction'
import BasicInfoCard from '../../../components/BasicInfoCard'
import Stock from '../../../components/Stock'
import StockAddressPopup from '../../../components/StockAddressPopup'
import DeliveryCycle from '../../../components/DeliveryCycle'
import HistoricalAnalysisBar from '../components/HistoricalAnalysisBar'
import HistoricalAnalysisPopup from '../components/HistoricalAnalysisPopup'
import MarketingCampaign from '../components/MarketingCampaign'
import MarketingPopup from '../components/MarketingPopup'
import SeckillWrap, { SeckillStatus } from '../components/SeckillWrap'
import DiscountPackage from '../components/DiscountPackage'
import DiscountPackagePopup from '../components/DiscountPackagePopup'
import Taxes from '../components/Taxes'
import TaxesPopup from '../components/TaxesPopup'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useShareAppMessage } from '@tarojs/taro'
import { shareAppMessage } from '@/utils/share'
import { getManageContentNoticeFindWithOutContent } from '@apps/apis'

type StocksSourcingDetailRouteParams = {
  showIM: string
  commodityId: string
  channelMemberId?: string
  skuId?: string
  activityType?: string
  activityId?: string
  belongType?: string
  ic?: string
  scene?: string
  isShare: string
}
const StocksSourcingDetail: React.FC = () => {
  const { routerToCustomerService } = useCustomerService()
  const router = useRouter<StocksSourcingDetailRouteParams>()

  const {
    params: {
      commodityId: commodityIdFromParams,
      skuId,
      channelMemberId,
      activityType,
      activityId,
      belongType,
      ic: invitationCodeFromParams,
      scene,
      isShare,
    },
  } = router

  let commodityId = commodityIdFromParams || ''
  let invitationCode = invitationCodeFromParams || ''
  if (scene) {
    const decoded = decodeURIComponent(scene)
    const searchParams = new URLSearchParams(decoded)
    commodityId = searchParams.get('cid') || commodityId
    invitationCode = searchParams.get('ic') || invitationCode
  }

  const [form, setForm] = useState<'add' | 'buyNow' | 'both'>('buyNow')
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  const [visibleMarketing, setVisibleMarketing] = useState(false)
  const [visibleHistoricalAnalysis, setVisibleHistoricalAnalysis] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [visibleDiscountPackagePopup, setVisibleDiscountPackagePopup] = useState(false)
  const [visibleTaxesPopup, setVisibleTaxesPopup] = useState(false)

  const {
    purchaseOrderStore: { setShopMessageStore },
    confirmOrderStore: { setSocialDistributionInvitationCode },
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const { jmpHome } = useJmpHome()
  const intl = useIntl()
  const { cartAddName } = useCartType()
  const formRef = useRef<'add' | 'buyNow' | 'both'>('buyNow')
  const skuPopupRef = useRef<SkuPopupRefHandle | null>(null)
  usePageInit()
  const isFromScene1179 = getLaunchOptionsSync().scene === 1179 || getLaunchOptionsSync().scene === 1007
  const isEnterpriseBCShop = !shopAndSite?.isSelf

  type FunctionItem = {
    title: string
    columnType: number
    content: string
    status: string
    id: string
    top: string
  }

  const normalHeaders = { type: SHOP_TYPE.ENTERPRISE }

  const {
    banner,
    productInfo,
    skuList,
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
  })

  const { showHistoricalAnalysis } = useGetPriceHistory({ commodityId: +commodityId })
  const { isCollected, handleCollect } = useCollectionAction({ productInfo, channelMemberId: +channelMemberId! })
  const { supplierInfo } = useGetShopInfo({ productInfo })
  const { tradeSummary } = useGetTradeSummary({ commodityId: +commodityId })
  const { transactionRecordLoading, transactionRecord } = useGetTradeRecord({ commodityId: +commodityId })
  const { evaluateRecordLoading, evaluateRecord } = useGetEvaluateRecord({ commodityId: +commodityId })
  const { marketingCampaign, getMarketingCampaign, seckillStatus, fetchCheckQuantity } = useGetMarketingCampaign({
    dispatch: productDispatch,
    skuList,
    setCurrentSku,
    productInfo,
    skuId: skuId ? +skuId : undefined,
    channelMemberId: +channelMemberId!,
  })

  const {
    visibleStockAddressPopup,
    handleVisibleStockAddressPopup,
    stockAddress,
    handleStockAddressChange,
    stockStatus,
    handleStockStatusChange,
  } = useStockAddress()

  const handleJumpLogin = () => Router.navigateTo('user/login')
  const handleVisibleSkuPopup = (flag?: boolean) => setVisibleSkuPopup(!!flag)
  const handleJumpShop = () => {}

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
    setCurrentSku(value as ProductSkuType)
    if (!productInfo) return
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
        originalPrice: (value as ProductSkuType).ladder[0]?.price || 0,
      },
    })
  }

  const handleStepperChange = (value: number) => {
    let newData: ProductSkuType = { ...currentSku, quantity: value }
    if (newData.ladder.length) {
      const current = newData.ladder.findIndex(
        (ladderItem, i) =>
          (value >= ladderItem.star && value <= ladderItem.end) ||
          (newData.ladder[i + 1] && value > ladderItem.end && value < newData.ladder[i + 1].star),
      )
      const active = current !== -1 ? current : newData.ladder.length - 1
      newData = Object.assign(newData, { active, priceValue: newData.ladder[active].price })
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

  const handleSkuConfirm = async (value: SkuListItemType) => {
    if (confirmLoading) return
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    hideToast()
    if (value.quantity <= 0) return showToast({ title: '请选择购买数量', icon: 'none' })
    if (value.quantity < productInfo?.minOrder!) return showToast({ title: '购买数量不可小于商品起订量', icon: 'none' })
    if (!currentSku.stockNum) return showToast({ title: '暂无库存', icon: 'none' })
    setConfirmLoading(true)
    switch (formRef.current) {
      case 'add': {
        if (marketingCampaign?.tagDetailList) {
          const pass = await fetchCheckQuantity(1, value.skuId, value.quantity)
          if (!pass) {
            setConfirmLoading(false)
            return
          }
        }
        showLoading({ title: '正在加载...', mask: true })
        try {
          const hasExchangeActivity = marketingCampaign?.tagDetailList?.find((item) => item.activityType === 13)
          const promises = hasExchangeActivity
            ? [
                postProductMobileShopPurchaseSavePurchaseBatch(
                  {
                    purchaseBatchList: [
                      {
                        commoditySkuId: value.skuId,
                        count: value.quantity,
                        purchaseCommodityType: 4,
                        setMealId: value.skuId,
                        isMain: true,
                        parentSkuId: undefined,
                      },
                    ],
                  },
                  { headers: normalHeaders },
                ),
              ]
            : [
                postProductShopPurchaseSaveOrUpdatePurchase(
                  {
                    commoditySkuId: value.skuId,
                    count: value.quantity,
                    purchaseCommodityType: seckillStatus.current === 'active' ? 3 : 1,
                  },
                  { headers: normalHeaders },
                ),
              ]
          Promise.all(promises)
            .finally(() => {
              hideLoading()
              setConfirmLoading(false)
            })
            .then((responses) => {
              hideToast()
              showToast({
                title: responses.every((item) => item.code === 1000) ? '已加入购物车' : responses[0].message,
                icon: 'none',
              })
            })
        } catch (error: any) {
          hideToast()
          showToast({ title: error?.message, icon: 'none' })
        }
        break
      }
      case 'buyNow': {
        if (marketingCampaign?.tagDetailList) {
          const pass = await fetchCheckQuantity(2, value.skuId, value.quantity)
          if (!pass) {
            setConfirmLoading(false)
            return
          }
        }
        showLoading({ title: '正在加载...', mask: true })
        const sku = productInfo?.commoditySkuList.find((item) => item.id === currentSku.skuId)
        const payload = {
          [`shopId_${productInfo?.memberId}`]: [
            {
              activityDetails: marketingCampaign?.tagDetailList
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
              id: 0,
              isMemberPrice: productInfo?.isMemberPrice,
              isPublish: productInfo?.isPublish,
              logistics: productInfo?.logistics,
              memberId: productInfo?.memberId,
              memberName: productInfo?.memberName,
              memberRoleId: productInfo?.memberRoleId,
              minOrder: productInfo?.minOrder,
              name: productInfo?.name,
              newAction: currentSku?.active,
              newPrice: productReducer?.ladderPrice,
              parameter: vipParameter.current,
              priceType: productInfo?.priceType,
              skuId: currentSku.skuId,
              stockCount: currentSku.stockNum,
              taxRate: productInfo?.taxRate,
              topActivityDetail: {},
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
        setSocialDistributionInvitationCode(invitationCode || '')
        hideLoading()
        setConfirmLoading(false)
        Router.navigateTo('order/ConfirmOrder')
        break
      }
      default:
        break
    }
  }

  const handleVisibleVisibleHistoricalAnalysis = (flag?: boolean) => setVisibleHistoricalAnalysis(!!flag)
  const handleVisibleMarketing = (flag?: boolean) => setVisibleMarketing(!!flag)
  const handleVisibleDiscountPackagePopup = (flag?: boolean) => setVisibleDiscountPackagePopup(!!flag)
  const handleVisibleTaxesPopup = (flag?: boolean) => setVisibleTaxesPopup(!!flag)

  const handleSeckillStatusChange = (status: SeckillStatus) => {
    seckillStatus.current = status
    productDispatch({
      type: 'setProductMiniInfo',
      payload: { activePrive: status === 'active' ? productReducer.seckillPrice : 0 },
    })
  }

  const handleBack = () => {
    if (invitationCode || isShare) {
      jmpHome()
    } else {
      Router.navigateBack()
    }
  }

  const customRenderPrice = () => (
    <>
      <View className="product-priceWrap">
        {!marketingCampaign?.seckillStartTime ? (
          <View className="product-priceWrap-left">
            <Text className="product-price">
              ¥{' '}
              {priceFormat(productReducer?.activePrive) ||
                priceFormat(productReducer?.vipPrice) ||
                priceFormat(currentSku?.ladder?.[0]?.price) ||
                '0.00'}
            </Text>
            <Text className="product-unit">{productInfo?.unitName ? `/${productInfo.unitName}` : ''}</Text>
            {productReducer?.aboutPrice && (
              <Text className="product-price__about">折合约 ¥ {priceFormat(productReducer.aboutPrice)}</Text>
            )}
            {productReducer?.aboutPrice && productInfo?.subUnitName && (
              <Text className="product-unit">/{productInfo.subUnitName}</Text>
            )}
          </View>
        ) : null}
      </View>
      {productReducer?.activePrive && (
        <View className="product-originWrap">
          <Text className="product-price__original">定价</Text>
          <Text className={classNames('product-price__original', 'product-price__through')}>
            ¥ {priceFormat(productInfo?.min)}
          </Text>
        </View>
      )}
    </>
  )

  const actionsDisabled = stockStatus === 0

  const customRenderFoot = () => (
    <>
      {showHistoricalAnalysis && (
        <HistoricalAnalysisBar
          skuId={currentSku.skuId}
          currentPrice={currentSku.price}
          unit={productInfo?.unitName}
          onJump={() => handleVisibleVisibleHistoricalAnalysis(true)}
        />
      )}
    </>
  )

  const renderActions = () => {
    if (loading)
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            正在加载...
          </Button>
        </GoodsAction.Button>
      )
    if (productInfo?.priceType === PRICE_TYPE_ENUM.GIFT)
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            赠品不可购买
          </Button>
        </GoodsAction.Button>
      )
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
              加入购物车
            </Button>
          </GoodsAction.Button>
          <GoodsAction.Button>
            <Button
              type="primary"
              onClick={handleBuyNow}
              loading={confirmLoading && formRef.current === 'buyNow'}
              disabled={actionsDisabled}
            >
              立即购买
            </Button>
          </GoodsAction.Button>
        </>
      )
    }
    return (
      <GoodsAction.Button>
        <Button type="primary" disabled>
          商品已下架
        </Button>
      </GoodsAction.Button>
    )
  }

  const renderSkuPaneActions = () => {
    if (loading)
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            正在加载...
          </Button>
        </GoodsAction.Button>
      )
    if (productInfo?.priceType === PRICE_TYPE_ENUM.GIFT)
      return (
        <GoodsAction.Button>
          <Button type="primary" disabled>
            赠品不可购买
          </Button>
        </GoodsAction.Button>
      )
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
              加入购物车
            </Button>
          </GoodsAction.Button>
          <GoodsAction.Button>
            <Button
              type="primary"
              onClick={handleBuyNow2}
              loading={confirmLoading && formRef.current === 'buyNow'}
              disabled={actionsDisabled}
            >
              立即购买
            </Button>
          </GoodsAction.Button>
        </>
      )
    }
    return (
      <GoodsAction.Button>
        <Button type="primary" disabled>
          商品已下架
        </Button>
      </GoodsAction.Button>
    )
  }

  const skuGroups = useMemo(
    () => normalizeSpecGroups(productInfo?.commoditySkuList as any),
    [productInfo?.commoditySkuList],
  )
  const basicInfoCardData = useMemo(
    () => ({ name: productInfo?.name, slogan: productInfo?.slogan, sellingPoint: productInfo?.sellingPoint }),
    [productInfo],
  )

  const isHasPackage = +activityType! === ACTIVITY_SETMEAL_NUMBER || marketingCampaign?.isPackage
  const lonelyParty = marketingCampaign?.tagDetailList?.[0]

  useShareAppMessage((res) =>
    shareAppMessage(
      res,
      basicInfoCardData.name,
      `/packages/commodityMerge/pages/stocksSourcing/detail/index?commodityId=${commodityId}&routerShopId=${shopAndSite?.id}&routerShopType=1&isShare=1`,
      '',
    ),
  )

  const webView = (item: any) =>
    Router.navigateTo('basicSetting/webView', { id: item.id, type: 'sign', columnType: item.columnType })

  const xy = () => {
    return columnTypeList
      .filter((item) => item.id === productInfo?.adoptionAgreementId)
      .map((items: any) => (
        <Text
          key={items.id}
          className="agrbox-signRight"
          style="font-size:15px;"
          onClick={(e) => {
            e.stopPropagation()
            webView(items)
          }}
        >
          《{items.title}》
        </Text>
      ))
  }

  const [columnTypeList, setColumnTypeList] = useState<FunctionItem[][]>([])
  useEffect(() => {
    if ([1, 2].includes(productInfo?.adoptionType)) {
      getManageContentNoticeFindWithOutContent({ id: productInfo?.adoptionAgreementId }).then((res: any) => {
        if (res.code === 1000) setColumnTypeList(res.data)
      })
    }
  }, [productInfo])

  return (
    <>
      <PageLayout
        renderHeader={
          <NavBar
            title="商品详情"
            titleColor="#5A2A12"
            backIconColor="#5A2A12"
            customStyle="background-color: #FCF7F1;"
            back={isFromScene1179 ? () => Router.reLaunch('root/splashView') : handleBack}
            backIconName={isFromScene1179 ? 'Home' : undefined}
          />
        }
      >
        <Anchor customClassName="stocksSourcing-detail-anchor">
          <View className="stocksSourcing-detail">
            <Anchor.Item title="商品" customClassName="stocksSourcing-detail-anchor-item">
              <Banner banner={banner} />
              <Gap />
              {activityType !== `${ACTIVITY_SECKILL_NUMBER}` && !marketingCampaign?.seckillStartTime ? (
                <BasicInfoCard
                  data={basicInfoCardData}
                  customRenderPrice={customRenderPrice}
                  customRenderFoot={customRenderFoot}
                />
              ) : null}
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
                    customRenderPrice={() => <>{!marketingCampaign?.seckillStartTime ? customRenderPrice() : null}</>}
                    customRenderFoot={customRenderFoot}
                  />
                </SeckillWrap>
              ) : null}
              {marketingCampaign?.couponList?.length || marketingCampaign?.tagDetailList?.length ? (
                <>
                  <Gap />
                  <MarketingCampaign data={marketingCampaign} onClick={() => handleVisibleMarketing(true)} />
                </>
              ) : null}
              <Gap />
              <MellowCard bodyStyle={{ paddingTop: pxTransform(0), paddingBottom: pxTransform(0) }}>
                <Bookshelf labelWidth={64} customStyle={{ paddingRight: pxTransform(0), paddingLeft: pxTransform(0) }}>
                  {skuGroups.length > 0 && (
                    <Bookshelf.Item
                      label="已选"
                      content={currentSku.specNames.length ? currentSku.specNames.join('；') : '请选择规格'}
                      onPress={handleBuyBoth}
                      isLink
                    />
                  )}
                  <Bookshelf.Item
                    label="起订量"
                    content={`${productInfo?.minOrder || ''}${productInfo?.unitName || ''}`}
                  />
                  <Bookshelf.Item
                    label="配送"
                    content={productInfo?.logistics ? DELIVERY_TYPE_TEXT[productInfo.logistics.deliveryType] || '' : ''}
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
                    onJump={() => handleVisibleStockAddressPopup(true)}
                    onStatusChange={handleStockStatusChange}
                    shippingAddressId={productInfo?.logistics?.sendAddressId!}
                    deliveryType={productInfo?.logistics?.deliveryType!}
                    limitWay={productInfo?.salesAreaTemplate?.limitWay}
                  />
                  <DeliveryCycle days={productInfo?.sendCycle!} />
                  {userInfo && (
                    <Bookshelf.Item label="支付" content={renderPayWay()} customStyle={{ alignItems: 'flex-start' }} />
                  )}
                  {userInfo && columnTypeList.length > 0 && (
                    <Bookshelf.Item label="协议" content={xy()} customStyle={{ alignItems: 'flex-start' }} />
                  )}
                </Bookshelf>
              </MellowCard>
              {isEnterpriseBCShop && (
                <>
                  <Gap />
                  <MellowCard>
                    <BusinessCard
                      data={supplierInfo}
                      describeExtra={<Text className="shop-volume">{productInfo?.sold || 0}成交</Text>}
                      extra={
                        supplierInfo.id && (
                          <Button type="secondary" size="small" circle>
                            进店
                          </Button>
                        )
                      }
                      onClick={handleJumpShop}
                    />
                  </MellowCard>
                </>
              )}
              {isHasPackage && (
                <>
                  <Gap />
                  <DiscountPackage
                    activityId={+activityId! || lonelyParty?.activityId || 0}
                    belongType={+belongType! || lonelyParty?.belongType || 0}
                    skuId={currentSku.skuId}
                    onJump={() => handleVisibleDiscountPackagePopup(true)}
                  />
                </>
              )}
            </Anchor.Item>

            <Anchor.Item title="评价" customClassName="stocksSourcing-detail-anchor-item">
              <Gap />
              <EvaluateRecordCard
                dataSource={evaluateRecord.data}
                loading={evaluateRecordLoading}
                tradeSummary={tradeSummary}
                params={{ commodityId: +commodityId, shopType: 1 }}
              />
            </Anchor.Item>

            <Anchor.Item title="成交" customClassName="stocksSourcing-detail-anchor-item">
              <Gap />
              <TransactionRecordCard
                title="交易记录"
                dataSource={transactionRecord}
                loading={transactionRecordLoading}
                priceType={productInfo?.priceType || 0}
                params={{ commodityId: +commodityId, shopId: shopAndSite?.id || 0 }}
              />
            </Anchor.Item>

            <Anchor.Item title="详情">
              <ProductDescriptions
                productInfo={productInfo}
                currentSku={currentSku}
                commodityRemarkList={(productInfo?.commodityRemarkList as any[]) || []}
              />
            </Anchor.Item>
          </View>
        </Anchor>
      </PageLayout>

      <View className="stocksSourcing-detail-fixedWrap stocksSourcing-detail-fixedAction">
        <GoodsAction>
          <GoodsAction.Icon text="首页" icon="Home" onClick={jmpHome} />
          <GoodsAction.Icon
            text="收藏"
            icon={!isCollected ? 'Star' : 'StarFill'}
            color={!isCollected ? '#5A2A12' : '#D32F2F'}
            onClick={() => handleCollect(productInfo?.id!, isCollected)}
          />
          <GoodsAction.Icon
            text="购物车"
            icon="ShoppingCart"
            onClick={() => Router.navigateTo('order/Purchase', { hasTab: false })}
          />
          {renderActions()}
        </GoodsAction>
      </View>

      <SkuPopup
        visible={visibleSkuPopup}
        productInfo={{
          ...productReducer,
          adoptionType: productInfo?.adoptionType,
          adoptionAgreementId: productInfo?.adoptionAgreementId,
        }}
        groups={skuGroups}
        skuList={skuList}
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
      {marketingCampaign && (
        <MarketingPopup
          data={marketingCampaign}
          visible={visibleMarketing}
          onClose={() => handleVisibleMarketing(false)}
          shopId={shopAndSite?.id!}
          skuId={currentSku?.skuId}
        />
      )}
      {isHasPackage && (
        <DiscountPackagePopup
          activityId={+activityId! || lonelyParty?.activityId || 0}
          belongType={+belongType! || lonelyParty?.belongType || 0}
          skuId={currentSku.skuId}
          visible={visibleDiscountPackagePopup}
          onClose={() => handleVisibleDiscountPackagePopup(false)}
        />
      )}
      <StockAddressPopup
        visible={visibleStockAddressPopup}
        onClose={() => handleVisibleStockAddressPopup(false)}
        onChange={handleStockAddressChange}
      />
      <TaxesPopup
        visible={visibleTaxesPopup}
        onClose={() => handleVisibleTaxesPopup(false)}
        crossBorder={!!productInfo?.isCrossBorder}
        taxes={productInfo?.taxRate || 0}
        price={productReducer.vipPrice || currentSku?.ladder?.[0]?.price}
      />
    </>
  )
}

export default GlobalWrapper(observer(StocksSourcingDetail))
