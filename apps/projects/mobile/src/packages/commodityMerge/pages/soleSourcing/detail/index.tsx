import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-16 11:30:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-22 16:44:09
 * @Description: 找现货详情
 */
import React, { useState, useMemo } from 'react'
import { View, Text, Button } from '@apps/mobile-ui'
import {
  useRouter,
  showLoading,
  hideLoading,
  showToast,
  hideToast,
  pxTransform,
} from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import useProductConst from '@/hooks/useProductConst'
import { ADD_INQUIRY } from '@/constants/storage'
import Router from '@/utils/router'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import useStores from '@/store/useStores'
// import { GlobalConfig } from '@/constants/global';
import useCustomerService from '@/hooks/useCustomerService'
import useJmpHome from '@/hooks/useJmpHome'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import BusinessCard from '@/components/BusinessCard'
import SkuPopup, { SkuListItemType } from '../../../components/SkuPopup'
import { normalizeSpecGroups, ProductSkuType } from '../../../components/SkuPopup/utils'
import GoodsAction from '../../../components/GoodsAction'
import useGetProductDetail from '../../../hooks/useGetProductDetail'
import useCollectionAction from '../../../hooks/useCollectionAction'
import useGetShopInfo from '../../../hooks/useGetShopInfo'
import useGetTradeSummary from '../../../hooks/useGetTradeSummary'
import useGetTradeRecord from '../../../hooks/useGetTradeRecord'
import useGetEvaluateRecord from '../../../hooks/useGetEvaluateRecord'
import useStockAddress from '../../../hooks/useStockAddress'
import Bookshelf from '../../../components/Bookshelf'
import Anchor from '../../../components/Anchor'
import Gap from '../../../components/Gap'
import ProductDescriptions from '../../../components/Descriptions'
import Banner from '../../../components/Banner'
import EvaluateRecordCard from '../../../components/EvaluateRecordCard'
import TransactionRecordCard from '../../../components/TransactionRecordCard'
import Stock from '../../../components/Stock'
import StockAddressPopup from '../../../components/StockAddressPopup'
import './index.scss'
type RouteParams = {
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
}

// const { customerServiceInfo } = GlobalConfig.global;
const customerServiceInfo = {}
let toastIns: any = null
const SoleSourcingDetail: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { commodityId, skuId, channelMemberId },
  } = router
  const [visibleSkuPopup, setVisibleSkuPopup] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const {
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { jmpHome } = useJmpHome()
  const { banner, productInfo, skuList, currentSku, setCurrentSku, productReducer, getPayWay, renderPayWay, loading } =
    useGetProductDetail({
      commodityId: +commodityId,
      skuId: skuId ? +skuId : undefined,
      from: null,
      channelMemberId: +channelMemberId!,
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
  const { routerToCustomerService } = useCustomerService()
  const {
    visibleStockAddressPopup,
    handleVisibleStockAddressPopup,
    stockAddress,
    handleStockAddressChange,
    stockStatus,
    handleStockStatusChange,
  } = useStockAddress()
  const intl = useIntl()
  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }
  const handleVisibleSkuPopup = (flag?: boolean) => {
    setVisibleSkuPopup(!!flag)
  }
  const handleAdd = () => {
    if (!userInfo) {
      handleVisibleSkuPopup(false)
      handleJumpLogin()
      return
    }
    handleVisibleSkuPopup(true)
  }
  const handleJumpShop = () => {
    // 跳转店铺
    // Router.navigateTo('members/shop', { shopId: isNotChannelShop ? productInfo?.storeId : productInfo?.memberId });
  }
  const handleSkuChange2 = (value: SkuListItemType) => {
    // 断言一下下
    setCurrentSku(value as ProductSkuType)
    if (!productInfo) {
      return
    }
    if (userInfo) {
      getPayWay(productInfo.memberId, productInfo.memberRoleId, {
        productId: productInfo.id,
        skuId: value.skuId,
        freightType: productInfo.logistics?.carriageType,
        crossBorder: productInfo.isCrossBorder,
      })
    }
  }

  // 购买数量改变
  const handleStepperChange = (value: number) => {
    const newData: ProductSkuType = {
      ...currentSku,
    }
    newData.quantity = value
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
    if (toastIns) {
      hideToast(toastIns)
    }
    if (value.quantity <= 0) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.soleSourcing.soleSourcingDetail.quantity.required',
          defaultMessage: '请选择询价数量',
        }),
        icon: 'none',
      })
      return
    }
    if (value.quantity < productInfo?.minOrder!) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.soleSourcing.soleSourcingDetail.quantity.legal',
          defaultMessage: '询价数量不可小于商品起订量',
        }),
        icon: 'none',
      })
      return
    }
    showLoading({
      title: intl.formatMessage({
        id: 'commodityMerge.common.loading',
        defaultMessage: '正在加载...',
      }),
      mask: true,
    })
    setConfirmLoading(true)
    const inquiryListProductRequests = [
      {
        productId: value.skuId,
        // sku id
        commodityId,
        productName: productInfo?.name,
        category: productInfo?.customerCategoryName,
        brand: productInfo?.brandName,
        unit: productInfo?.unitName,
        purchaseCount: value.quantity,
        price: value.priceValue,
        // 这个价格好像是没用的，先传这个
        logistics: productInfo?.logistics,
        memberId: productInfo?.memberId,
        memberRoleId: productInfo?.memberRoleId,
        imgUrl: productInfo?.mainPic,
        stockCount: value.stockNum,
        isDeleted: false,
        minOrder: productInfo?.minOrder, // 最小起订量
      },
    ]
    // 供应商数据
    const supplier = {
      memberName: productInfo?.memberName,
      memberId: productInfo?.memberId,
      memberRoleId: productInfo?.memberRoleId,
      memberRoleName: productInfo?.memberRoleName,
    }
    await setAsyncStorage(ADD_INQUIRY, {
      inquiryListProductRequests,
      ...supplier,
    })
    hideLoading()
    setConfirmLoading(false)
    Router.navigateTo('order/editRfqOrder')
  }
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
    if (productInfo?.isPublish) {
      return (
        <>
          <GoodsAction.Button>
            <Button type="primary" onClick={handleAdd} loading={confirmLoading}>
              {intl.formatMessage({
                id: 'commodityMerge.soleSourcing.soleSourcingDetail.confirm',
                defaultMessage: '在线询价',
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

  // 按钮禁用
  // 目前只有不可以配送状态时
  // 如有需要也可再拆分两个变量各自控制 加入购物车、立即购买的状态
  const actionsDisabled = stockStatus === 0
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
        <Anchor customClassName="soleSourcing-detail-anchor">
          <View className="soleSourcing-detail">
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.product',
                defaultMessage: '商品',
              })}
              customClassName="soleSourcing-detail-anchor-item"
            >
              {/* 商品图 */}
              <Banner banner={banner} />
              {/* 基本信息 */}
              <Gap />
              <MellowCard
                bodyStyle={{
                  padding: 0,
                }}
              >
                <View className="product-head">
                  <View className="product-head-titleWrap">
                    <Text className="product-head-title">
                      {intl.formatMessage({
                        id: 'commodityMerge.soleSourcing.soleSourcingDetail.title',
                        defaultMessage: '询价商品',
                      })}
                    </Text>
                  </View>
                  <View className="product-head-desc">
                    {intl.formatMessage({
                      id: 'commodityMerge.soleSourcing.soleSourcingDetail.description',
                      defaultMessage: '需提交询价单给供应商进行审核',
                    })}
                  </View>
                </View>
                <View className="product-container">
                  <Text className="product-name">{productInfo?.name}</Text>
                  {productInfo && productInfo.slogan && <Text className="product-describe">{productInfo?.slogan}</Text>}
                  {productInfo?.sellingPoint && productInfo?.sellingPoint.length > 0 ? (
                    <View className="product-tags">
                      {productInfo?.sellingPoint.map((item, index) => (
                        <Text key={index} className="product-tags-item">
                          {item}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              </MellowCard>
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
                      onPress={handleAdd}
                      isLink
                    />
                  ) : null}
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.min',
                      defaultMessage: '起订量',
                    })}
                    content={`${productInfo && productInfo.minOrder ? productInfo.minOrder : ''}${
                      productInfo && productInfo.unitName ? `/${productInfo?.unitName}` : ''
                    }`}
                  />
                  <Bookshelf.Item
                    label={intl.formatMessage({
                      id: 'commodityMerge.common.deliveryType',
                      defaultMessage: '配送',
                    })}
                    content={
                      productInfo && productInfo.logistics
                        ? `${DELIVERY_TYPE_TEXT[productInfo?.logistics?.deliveryType] || ''}`
                        : ''
                    }
                  />
                  <Stock
                    unlimited={productInfo?.isAllArea!}
                    areas={productInfo?.commodityAreaList!}
                    address={stockAddress!}
                    onJump={() => handleVisibleStockAddressPopup(true)}
                    onStatusChange={handleStockStatusChange}
                    shippingAddressId={productInfo?.logistics?.sendAddressId!}
                    deliveryType={productInfo?.logistics?.deliveryType!}
                  />
                  {userInfo && (
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
                  )}
                </Bookshelf>
              </MellowCard>
              {/* 采购商名片 */}
              {!shopAndSite?.isSelf && (
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
              )}
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.reviews',
                defaultMessage: '评价',
              })}
              customClassName="soleSourcing-detail-anchor-item"
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
              customClassName="soleSourcing-detail-anchor-item"
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
                  shopId: shopAndSite?.id!,
                }}
              />
            </Anchor.Item>
            <Anchor.Item
              title={intl.formatMessage({
                id: 'commodityMerge.common.details',
                defaultMessage: '详情',
              })}
            >
              <ProductDescriptions
                productInfo={productInfo}
                currentSku={currentSku}
                commodityRemarkList={productInfo?.commodityRemarkList || []}
              />
            </Anchor.Item>
          </View>
        </Anchor>
      </PageLayout>
      <View className="soleSourcing-detail-fixedWrap">
        <GoodsAction>
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'commodityMerge.common.home',
              defaultMessage: '首页',
            })}
            icon="Home"
            onClick={jmpHome}
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
          {customerServiceInfo?.id ? (
            <GoodsAction.Icon
              text={intl.formatMessage({
                id: 'commodityMerge.common.customerService',
                defaultMessage: '客服',
              })}
              icon="Chat"
              onClick={routerToCustomerService}
            />
          ) : null}
          {renderActions()}
        </GoodsAction>
      </View>
      {/* SKU选择弹窗 */}
      <SkuPopup
        visible={visibleSkuPopup}
        productInfo={productReducer}
        groups={skuGroups}
        skuList={skuList}
        commoditySkuList={productInfo?.commoditySkuList}
        onClose={() => handleVisibleSkuPopup(false)}
        value={currentSku}
        onChange={handleSkuChange2}
        onStepperChange={handleStepperChange}
        onConfirm={handleSkuConfirm}
        confirmLoading={confirmLoading}
        customRenderProductContent={(data) => (
          <View>
            <View className="soleSourcing-detail-product-name">{data.name}</View>
            <View className="soleSourcing-detail-product-consulting">
              {intl.formatMessage({
                id: 'commodityMerge.soleSourcing.soleSourcingDetail.confirm',
                defaultMessage: '在线询价',
              })}
            </View>
          </View>
        )}
        customRenderActions={
          productInfo?.isPublish ? null : (
            <GoodsAction safeAreaInsetBottom={false}>
              <GoodsAction.Button>
                <Button type="primary" disabled>
                  {intl.formatMessage({
                    id: 'commodityMerge.common.removed',
                    defaultMessage: '商品已下架',
                  })}
                </Button>
              </GoodsAction.Button>
            </GoodsAction>
          )
        }
        soldOut={false}
        confirmDisabled={actionsDisabled}
      />
      {/* 配送至弹窗 */}
      <StockAddressPopup
        visible={visibleStockAddressPopup}
        onClose={() => handleVisibleStockAddressPopup(false)}
        onChange={handleStockAddressChange}
      />
    </>
  )
}
export default GlobalWrapper(observer(SoleSourcingDetail))
