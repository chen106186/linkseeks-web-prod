import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 17:40:41
 * @LastEditors: GHua
 * @LastEditTime: 2022-03-16 14:41:53
 * @Description: 积分商品详情
 */
import React, { useState, useRef, useMemo } from 'react'
import { useRouter, preload, showToast, hideToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Button } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import useProductConst from '@/hooks/useProductConst'
import { SHOP_TYPE } from '@/constants/const/shop'
import Router from '@/utils/router'
import useStores from '@/store/useStores'
import useCustomerService from '@/hooks/useCustomerService'
import useJmpHome from '@/hooks/useJmpHome'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import BusinessCard from '@/components/BusinessCard'
import useGetProductDetail from '../../../hooks/useGetProductDetail'
import useGetShopInfo from '../../../hooks/useGetShopInfo'
import useGetTradeSummary from '../../../hooks/useGetTradeSummary'
import useGetTradeRecord from '../../../hooks/useGetTradeRecord'
import useGetEvaluateRecord from '../../../hooks/useGetEvaluateRecord'
import useStockAddress from '../../../hooks/useStockAddress'
import { normalizeSpecGroups, ProductSkuType } from '../../../components/SkuPopup/utils'
import GoodsAction from '../../../components/GoodsAction'
import ProductSpecPopup, { SkuListItemType, SkuPopupRefHandle } from '../components/ProductSpecPopup'
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
import { usePageInit } from '@/hooks/usePageInit'
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
   * 渠道会员角色id
   */
  channelMemberRoleId?: string
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
const PointsSourcingDetail: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: {
      commodityId,
      skuId,
      channelMemberId,
      // channelMemberRoleId,
    },
  } = router
  const { DELIVERY_TYPE_TEXT } = useProductConst()
  const [visiblePopup, setVisiblePopup] = useState(false)
  // const [isCollected, setIsCollected] = useState(false);
  // const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [form, setForm] = useState<'add' | 'buyNow' | 'both'>('buyNow')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const {
    userStore: { userInfo, shopAndSite },
  } = useStores()
  const { jmpHome } = useJmpHome()
  const intl = useIntl()
  usePageInit()
  const specPopupRef = useRef<SkuPopupRefHandle | null>(null)
  const formRef = useRef<'add' | 'buyNow' | 'both'>('buyNow')

  // 当前是否是 企业商城且商城属性为B端商城或C端商城时
  const isEnterpriseBCShop = !shopAndSite?.isSelf
  const { banner, productInfo, skuList, currentSku, setCurrentSku, productReducer, loading } = useGetProductDetail({
    commodityId: +commodityId,
    skuId: skuId ? +skuId : undefined,
    from: null,
    channelMemberId: +channelMemberId!,
    specifyShopId: shopAndSite?.id,
    specifyShopType: SHOP_TYPE.POINTS,
  })
  const { supplierInfo } = useGetShopInfo({
    productInfo,
  })
  const { tradeSummary } = useGetTradeSummary({
    commodityId: +commodityId,
  })
  const { transactionRecordLoading, transactionRecord } = useGetTradeRecord({
    commodityId: +commodityId,
    specifyShopId: shopAndSite?.id,
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

  // 获取商品是否收藏
  // const getIsCollected = (productId: number, channelCommodityId?: number) => {
  //   const normalParams = {
  //     commodityId: `${productId}`,
  //     shopId: shopAndSite?.id,
  //   };
  //   const channelParams = {
  //     channelMemberId: `${currentChannelMemberId}`,
  //     channelMemberRoleId: `${currentChannelMemberRoleId}`,
  //     channelCommodityId: `${channelCommodityId}`,
  //   };
  //   if (isNotChannelShop) {
  //     getProductShopCommodityCollectGetCommodityCollect(normalParams).then((res) => {
  //       if (res.code === 1000) {
  //         setIsCollected(res.data.isCollect);
  //       }
  //     });
  //   } else {
  //     getProductMobileShopCommodityCollectChannelGetCommodityCollect(channelParams).then((res) => {
  //       if (res.code === 1000) {
  //         setIsCollected(res.data.isCollect);
  //       }
  //     });
  //   }
  // };

  const handleClosePopup = () => {
    setVisiblePopup(false)
  }
  const handleJumpLogin = () => {
    Router.navigateTo('user/login')
  }

  // const handleCollect = (productId: number, flag: boolean) => {
  //   if (!productId) {
  //     return;
  //   }
  //   if (!userInfo) {
  //     handleJumpLogin();
  //     return;
  //   }
  //   if (collectLoading) {
  //     return;
  //   }
  //   setCollectLoading(true);
  //   const normalParams = {
  //     commodityId: productId,
  //   };
  //   const channelParams = {
  //     channelCommodityId: productInfo?.channelCommodityId,
  //     channelMemberId: currentChannelMemberId,
  //   };
  //   const action: Promise<{ code: number, message: string }> = (
  //     // eslint-disable-next-line no-nested-ternary
  //     flag
  //       ? (
  //         isNotChannelShop
  //           ? postProductShopCommodityCollectDeleteCommodityCollect(normalParams)
  //           : postProductMobileShopCommodityCollectChannelDeleteCommodityCollect(channelParams)
  //       )
  //       : (
  //         isNotChannelShop
  //           ? postProductShopCommodityCollectSaveCommodityCollect(normalParams)
  //           : postProductMobileShopCommodityCollectChannelSaveCommodityCollect(channelParams)
  //       )
  //   );
  //   action.then((res) => {
  //     if (toastIns) {
  //       hideToast(toastIns);
  //     }
  //     if (res.code === 1000) {
  //       toastIns = showToast({ title: flag ? intl.formatMessage({id: 'commodityMerge.common.list.removed',  defaultMessage: '取消收藏' }) : intl.formatMessage('commodityMerge.common.list.adding', { defaultValue: '已收藏' });
  //       setIsCollected(!flag);
  //     }
  //     if (res.code !== 1000 && res.message) {
  //       toastIns = showToast({ title: intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}), icon: 'none' });
  //     }
  //   }).finally(() => {
  //     setCollectLoading(false);
  //   });
  // };

  // 购买数量改变
  const handleStepperChange = (value: number) => {
    const newData: ProductSkuType = {
      ...currentSku,
    }
    newData.quantity = value
    setCurrentSku(newData)
  }
  const handleSkuConfirm = (value: SkuListItemType) => {
    if (confirmLoading) {
      return
    }
    if (!userInfo) {
      setVisiblePopup(false)
      handleJumpLogin()
      return
    }
    if (toastIns) {
      hideToast(toastIns)
    }
    if (currentSku.quantity <= 0) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.quantity.required',
          defaultMessage: '请选择兑换数量',
        }),
        icon: 'none',
      })
      return
    }
    if (value.quantity < productInfo?.minOrder!) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.min.legal',
          defaultMessage: '兑换数量不可小于商品起订量',
        }),
        icon: 'none',
      })
      return
    }
    if (!currentSku.stockNum) {
      toastIns = showToast({
        title: intl.formatMessage({
          id: 'commodityMerge.common.soldOut',
          defaultMessage: '暂无库存，看看其他的吧',
        }),
        icon: 'none',
      })
      return
    }
    setConfirmLoading(true)
    const payload = {
      storeId: supplierInfo.id,
      storePic: supplierInfo.logo,
      storeName: supplierInfo.name,
      supplyMembersId: productInfo?.memberId,
      supplyMembersRoleId: productInfo?.memberRoleId,
      supplyMembersName: productInfo?.memberName,
      commodity: {
        brand: productInfo?.brandName,
        category: productInfo?.customerCategoryName,
        isMemberPrice: productInfo?.isMemberPrice ? 1 : 0,
        memberId: productInfo?.memberId,
        memberRoleId: productInfo?.memberRoleId,
        minOrder: productInfo?.minOrder,
        commodityName: productInfo?.name,
        commodityId: productInfo?.id,
        commodityLogo: productInfo?.mainPic,
        unit: productInfo?.unitName,
        skuItem: {
          unitName: productInfo?.unitName,
          count: value.quantity,
          attributeName: value.specNames.join('；'),
          skuid: value.skuId,
          commodityUnitPriceAndPicId: value?.commodityUnitPriceAndPicId,
          showPrice: value.price,
        },
        deliveryType: productInfo?.logistics.deliveryType,
        logistics: productInfo?.logistics,
        commodityAreaList: productInfo?.commodityAreaList,
        isAllArea: productInfo?.isAllArea,
        isCrossBorder: productInfo?.isCrossBorder,
      },
    }
    setConfirmLoading(false)
    preload({
      orderData: payload,
    })
    Router.navigateTo('order/integral')
  }
  const handleSkuChange2 = (value: SkuListItemType) => {
    // 断言一下下
    setCurrentSku(value as ProductSkuType)
  }
  const handleBuyNow = () => {
    if (!userInfo) {
      setVisiblePopup(false)
      handleJumpLogin()
      return
    }
    setForm('buyNow')
    formRef.current = 'buyNow'
    setVisiblePopup(true)
  }
  const handleBuyNow2 = () => {
    formRef.current = 'buyNow'
    specPopupRef.current?.onConfirm()
  }
  const handleJumpShop = () => {
    // 跳转店铺
    // Router.navigateTo('members/shop', { shopId: isNotChannelShop ? productInfo?.storeId : productInfo?.memberId });
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
              customClassName="pointsSourcing-detail-navbar"
              titleColor="#5A2A12"
              backIconColor="#5A2A12"
              title={intl.formatMessage({
                id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.nav',
                defaultMessage: '积分商品详情',
              })}
            />
          </>
        }
      >
        {() => (
          <Anchor customClassName="pointsSourcing-detail-anchor">
            <View className="pointsSourcing-detail">
              <Anchor.Item
                title={intl.formatMessage({
                  id: 'commodityMerge.common.product',
                  defaultMessage: '商品',
                })}
                customClassName="pointsSourcing-detail-anchor-item"
              >
                {/* 商品图 */}
                <Banner banner={banner} />
                {/* 基本信息 */}
                <Gap />
                <MellowCard>
                  <View className="product-priceWrap">
                    <Text className="product-price">
                      {currentSku?.price || (productInfo && productInfo.min !== undefined) ? `${productInfo?.min}` : ''}
                    </Text>
                    <Text className="product-unit">
                      {intl.formatMessage({
                        id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.price',
                        defaultMessage: '积分',
                      })}
                    </Text>
                  </View>
                  <View className="product-name">{productInfo?.name}</View>
                  {productInfo && productInfo.slogan && <View className="product-describe">{productInfo?.slogan}</View>}
                  {productInfo?.sellingPoint && productInfo?.sellingPoint.length > 0 ? (
                    <View className="product-tags">
                      {productInfo?.sellingPoint.map((item, index) => (
                        <Text key={index} className="product-tags-item">
                          {item}
                        </Text>
                      ))}
                    </View>
                  ) : null}
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
                        onPress={handleBuyNow}
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
                    <Bookshelf.Item
                      label={intl.formatMessage({
                        id: 'commodityMerge.common.payMethod',
                        defaultMessage: '支付',
                      })}
                      content={intl.formatMessage({
                        id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.payMethod.points',
                        defaultMessage: '积分支付',
                      })}
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
                            {`${productInfo ? productInfo.sold : 0}${intl.formatMessage({
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
              </Anchor.Item>
              <Anchor.Item
                title={intl.formatMessage({
                  id: 'commodityMerge.common.reviews',
                  defaultMessage: '评价',
                })}
                customClassName="pointsSourcing-detail-anchor-item"
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
                customClassName="pointsSourcing-detail-anchor-item"
              >
                {/* 兑换记录 */}
                <Gap />
                <TransactionRecordCard
                  title={intl.formatMessage({
                    id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.transaction.record',
                    defaultMessage: '兑换记录',
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
        )}
      </PageLayout>
      <View className="pointsSourcing-detail-fixedWrap pointsSourcing-detail-fixedAction">
        <GoodsAction>
          <GoodsAction.Icon
            text={intl.formatMessage({
              id: 'commodityMerge.common.home',
              defaultMessage: '首页',
            })}
            icon="Home"
            onClick={jmpHome}
          />
          {/* <GoodsAction.Icon
            text={intl.formatMessage({id: 'commodityMerge.common.list',  defaultMessage: '收藏' })}
            icon={!isCollected ? 'Star' : 'StarFill'}
            color={!isCollected ? '#303133' : '#D32F2F'}
            onClick={() => handleCollect(productInfo?.id!, isCollected)}
           /> */}
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
          {productInfo?.isPublish ? (
            <>
              <GoodsAction.Button>
                <Button
                  type="primary"
                  onClick={handleBuyNow}
                  disabled={actionsDisabled}
                  loading={confirmLoading && formRef.current === 'buyNow'}
                >
                  {intl.formatMessage({
                    id: 'commodityMerge.pointsSourcing.pointsSourcingDetail.redeem',
                    defaultMessage: '立即兑换',
                  })}
                </Button>
              </GoodsAction.Button>
            </>
          ) : (
            <GoodsAction.Button>
              <Button type="primary" disabled>
                {!loading
                  ? intl.formatMessage({
                      id: 'commodityMerge.common.removed',
                      defaultMessage: '商品已下架',
                    })
                  : intl.formatMessage({
                      id: 'commodityMerge.common.loading',
                      defaultMessage: '正在加载...',
                    })}
              </Button>
            </GoodsAction.Button>
          )}
        </GoodsAction>
      </View>
      <ProductSpecPopup
        visible={visiblePopup}
        productInfo={productReducer}
        groups={skuGroups}
        skuList={skuList}
        onClose={handleClosePopup}
        value={currentSku}
        onChange={handleSkuChange2}
        onStepperChange={handleStepperChange}
        onConfirm={handleSkuConfirm}
        confirmLoading={confirmLoading}
        ref={specPopupRef}
        customRenderActions={
          form === 'buyNow' ? (
            <View className="pointsSourcing-detail-fixedAction">
              <GoodsAction safeAreaInsetBottom={false}>
                {productInfo?.isPublish ? (
                  <GoodsAction.Button>
                    <Button
                      type="primary"
                      onClick={handleBuyNow2}
                      loading={confirmLoading && formRef.current === 'buyNow'}
                    >
                      {intl.formatMessage({
                        id: 'commodityMerge.common.confirm',
                        defaultMessage: '确定',
                      })}
                    </Button>
                  </GoodsAction.Button>
                ) : (
                  <GoodsAction.Button>
                    <Button type="primary" disabled>
                      {intl.formatMessage({
                        id: 'commodityMerge.common.removed',
                        defaultMessage: '商品已下架',
                      })}
                    </Button>
                  </GoodsAction.Button>
                )}
              </GoodsAction>
            </View>
          ) : null
        }
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
export default GlobalWrapper(observer(PointsSourcingDetail))
