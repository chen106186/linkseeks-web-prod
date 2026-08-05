import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { View, Text, Toast, ScrollView, Modal, Button, CheckboxGroup, Checkbox } from '@apps/mobile-ui'
import useSafeArea from '@/hooks/useSafeArea'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import {
  setClipboardData,
  getCurrentInstance,
  setNavigationBarTitle,
  preload,
  showLoading,
  hideLoading,
} from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import {
  getTradeAskPurchaseDetailForShop,
  getTradeMobileAskPurchaseDetail,
  GetTradeMobileAskPurchaseDetailResponse,
  getTradeMobileAskPurchaseAskPurchaseQuoteDetail,
  GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse,
  postProductMobileCommodityGetCommodityByCommoditySkuIdList,
  getTradeAskPurchaseQuoteAskPurchaseDetail,
} from '@apps/apis'
import useStores from '@/store/useStores'
import BasicInfo from './components/BasicInfo'
import Enclosure from './components/Enclosure'
import Other from './components/Other'
import Trading from './components/Trading'
import GoodsInfo from './components/GoodsInfo'
import QuoteMember from './components/QuoteMember'
import QuoteInfo from './components/QuoteInfo'
import QuoteOther from '../quoteDetail/Other'
import PriceComparisonInfo from './components/PriceComparisonInfo'
import PublishType from './components/PublishType'
import { innerStatusList, outerStatusList, PARITY_STATUS } from '../../constants'
import useBuyerList from '../buyer/hooks'
import styles from './index.module.scss'
import { fnGetActivityType, fnGetShopAscription } from '@/packages/order/pages/purchase/commonlyFn'
import Popup from '@/components/Popup'
import ImageBox from '@/components/ImageBox'
import { useMobileIntl } from '@apps/locales'
export type PAGE_TYPE = 'LIST' | 'BUYER_LIST' | 'BUYER_DETAIL' | 'MERCHANTS_DETAIL' | 'MERCHANTS_LIST'
const AskPurchaseDetail: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as {
    id: string
    awardBidQuoteId?: string
    PAGE: PAGE_TYPE
    refresh: () => void
  }
  const intl = useIntl()
  const translate = useMobileIntl()
  const { id, awardBidQuoteId, PAGE, refresh } = params
  const { safeBottomHeight } = useSafeArea()
  const [dataSoucre, setDataSoucre] = React.useState<GetTradeMobileAskPurchaseDetailResponse>()
  const [quoteInfo, setQuoteInfo] = useState<GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse>()
  const [skuList, setSkuList] = useState<any[]>([])
  const [showSkuList, setShowSkuList] = useState<boolean>(false)
  const [selectSkuIds, setSelectSkuIds] = useState<number[]>([])
  const {
    userStore: { userInfo },
    purchaseOrderStore: { setShopMessageStore },
  } = useStores()
  const {
    modalTitle,
    modalVisible,
    quoteList,
    parityList,
    rankList,
    expandIds,
    selectAwardItem,
    optionType,
    setOptionType,
    setSelectAwardItem,
    setExpandIds,
    setModalTitle,
    handlePublish,
    setModalVisible,
    fetchQuoteList,
    fetchParityList,
    fetchQuoteRankList,
    handleAwardBid,
    handleAudit,
  } = useBuyerList()
  const fetchGetApi = useCallback(async () => {
    let fn: any = undefined
    const params = {
      id,
    }
    if (PAGE === 'LIST') {
      fn = getTradeAskPurchaseDetailForShop
    } else if (PAGE === 'MERCHANTS_LIST' || PAGE === 'MERCHANTS_DETAIL') {
      params['askPurchaseId'] = id
      fn = getTradeAskPurchaseQuoteAskPurchaseDetail
    } else {
      fn = getTradeMobileAskPurchaseDetail
    }
    await fn(params).then((res) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        return
      }
      setNavigationBarTitle({
        title: res.data.name,
      })
      setDataSoucre(res.data)
      if (
        res.data.askPurchaseGoodsResponses &&
        res.data.askPurchaseGoodsResponses.length > 0 &&
        res.data.status !== 9
      ) {
        setExpandIds([res.data.askPurchaseGoodsResponses[0].id])
      }
      if (res.data.status > 1 && PAGE.indexOf('BUYER') > -1) {
        fetchQuoteList(Number(id))
      }
      // 查看比价信息
      if (PARITY_STATUS.includes(res.data.status)) {
        fetchParityList(res.data.id)
        fetchQuoteRankList(res.data.id, res.data.status)
      }
    })
  }, [])
  const fnResetShopStore = (shopMessage: any) => {
    const shopStoreMessage: any = {}
    Object.keys(shopMessage).forEach((key: string) => {
      shopStoreMessage[key] = []
      Object.keys(shopMessage[key].commodityType).forEach((keyTwo: any) => {
        shopMessage[key].commodityType[keyTwo].forEach((thisCommodity) => {
          shopStoreMessage[key].push({
            ...thisCommodity,
            askPurchaseQuoteId: awardBidQuoteId,
          })
        })
      })
    })
    setShopMessageStore(shopStoreMessage)
  }
  const fetchQUoteInfo = () => {
    if (awardBidQuoteId) {
      getTradeMobileAskPurchaseAskPurchaseQuoteDetail({
        id: awardBidQuoteId,
      }).then((res) => {
        if (res.code === 1000) {
          setQuoteInfo(res.data)
          if (res.data.askPurchaseQuoteGoodsResponses && res.data.askPurchaseQuoteGoodsResponses.length > 0) {
            setExpandIds([res.data.askPurchaseQuoteGoodsResponses[0].id])
            const idList = res.data.askPurchaseQuoteGoodsResponses.map((item) => item.skuId)
            showLoading()
            postProductMobileCommodityGetCommodityByCommoditySkuIdList({
              idList,
            })
              .then((skuRes) => {
                if (skuRes.code === 1000 && skuRes.data && skuRes.data.length > 0) {
                  // let newShopMessage = {}
                  const result: any[] = []
                  for (const item of skuRes.data) {
                    const commodityItem = res.data.askPurchaseQuoteGoodsResponses.find(
                      (goodsItem) => goodsItem.skuId === item.id,
                    )
                    const price = commodityItem.unitPriceWithTax
                    if (commodityItem) {
                      const newCommodityMessage = {
                        shopId: commodityItem.shopId,
                        shopName: commodityItem.shopName,
                        name: item.name,
                        // 商品名字
                        attribute: item.attribute,
                        skuId: item.id,
                        brandId: item.brandId,
                        // 品牌
                        brandName: item.brandName,
                        // 品牌
                        code: item.code,
                        isMemberPrice: item.isMemberPrice,
                        // 是否允许会员价
                        isMemberProduct: item.isMemberProduct,
                        // 是否为大成特殊会员产品 -----?
                        memberId: item.memberId,
                        // 会员id
                        memberRoleId: item.memberRoleId,
                        // 会员角色id
                        unitPrice: item.unitPrice,
                        // 梯度价格
                        count: commodityItem.num,
                        // 商品的数量
                        minOrder: item.minOrder,
                        // 最小起订
                        stockCount: item.stockCount,
                        // 库存数量
                        limitCount: commodityItem.num,
                        // 限制购买数量
                        newPrice: price,
                        // 当前商品价格
                        estimatePrice: price,
                        // 预估到手价
                        commodityId: item.commodityId,
                        // 商品id
                        id: item.id,
                        // 购物车id
                        commodityLogo: item.mainPic,
                        // 商品logo
                        unitName: item.unitName,
                        // 商品单位
                        logistics: item.logistics,
                        // 物流信息
                        memberName: item.memberName,
                        // 商店名称
                        storeLogo: item.storeLogo,
                        // 商店Logo
                        storeName: item.storeName,
                        // 商店名称
                        storeId: item.storeId,
                        // 店铺id
                        isPublish: item.isPublish,
                        // 是否出版 ----?
                        parameter: item.parameter,
                        // 会员权益比例
                        customerCategoryId: item.customerCategoryId,
                        // 商品分类
                        customerCategoryName: item.customerCategoryName,
                        // 商品分类
                        upperMemberId: item.upperMemberId,
                        // 上游供应会员id
                        upperMemberName: item.upperMemberName,
                        // 上游供应会员名称
                        upperMemberRoleId: item.upperMemberRoleId,
                        // 上游供应会员角色id
                        upperMemberRoleName: item.upperMemberRoleName,
                        // 上游供应会员角色名称
                        taxRate: item.taxRate,
                        // 税率
                        priceType: item.priceType,
                        // 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品
                        commodityAreaList: item.commodityAreaList,
                        isAllArea: true,
                        // 318 新增数据-商品物流配送地址
                        isCrossBorder: item.isCrossBorder,
                        // 判断是不是跨境商品
                        // 商品类型：直播 线上 线下....
                        productType: item.productType,
                        commissionSharingRatio: item.commissionSharingRatio,
                        // 代理人按实付金额返现比例
                        allowCommissionSharing: item.allowCommissionSharing,
                        // 是否允许分佣 True-允许 False-不允许
                        ministrantId: item.ministrantId, // 服务id
                      }
                      result.push(newCommodityMessage)
                    }
                  }
                  setSkuList(result)
                  hideLoading()
                } else {
                  hideLoading()
                }
              })
              .catch(() => {
                hideLoading()
              })
          }
        }
      })
    }
  }
  useEffect(() => {
    fetchGetApi()
    if (awardBidQuoteId) {
      fetchQUoteInfo()
    }
  }, [])
  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: intl.formatMessage({
            id: 'inquiry.fuzhichenggong',
            defaultMessage: '内容复制成功',
          }),
          icon: 'none',
        })
      },
    })
  }
  const handleCreateOrder = () => {
    if (quoteInfo && quoteInfo.askPurchaseQuoteGoodsResponses && quoteInfo.askPurchaseQuoteGoodsResponses.length > 0) {
      setModalVisible(false)
      refresh()
      Router.redirectTo('order/ConfirmOrder', {
        askPurchaseQuoteId: awardBidQuoteId,
      })
    } else {
      Toast.show({
        title: translate('mobile.resource.askPurchase.weiguanlianbaojiashangpinwufashengchengdingdan'),
        icon: 'none',
      })
    }
  }
  const renderBottomButton = () => {
    switch (PAGE) {
      case 'LIST':
        return (
          <View className={styles['inquiryDetailContainer-btnBox']}>
            <View
              className={styles['inquiryDetailContainer-touchableOpacity']}
              onClick={(e) => {
                e.stopPropagation()
                if (dataSoucre?.status === 2 && !dataSoucre?.whetherQuoted) {
                  if (!userInfo) {
                    Router.navigateTo('user/login')
                    return
                  }
                  preload({
                    id,
                    PAGE: 'detail',
                  })
                  Router.navigateTo('askPurchase/add')
                }
              }}
            >
              <View
                className={cx(
                  styles['inquiryDetailContainer-primaryBtn'],
                  (dataSoucre?.status !== 2 || dataSoucre?.whetherQuoted) && styles.disabled,
                )}
              >
                <Text
                  className={cx(styles['inquiryDetailContainer-btnText'], styles['inquiryDetailContainer-primaryText'])}
                >
                  {dataSoucre?.whetherQuoted
                    ? translate('mobile.resource.askPurchase.yibaojia')
                    : translate('mobile.resource.askPurchase.lijibaojia')}
                </Text>
              </View>
            </View>
          </View>
        )
      case 'BUYER_LIST':
        if (dataSoucre) {
          switch (dataSoucre.status) {
            case 1:
              return (
                <View className={styles['inquiryDetailContainer-btnBox']}>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOptionType('publish')
                      setModalTitle(translate('mobile.resource.askPurchase.shifouquerenfabu'))
                      setModalVisible(true)
                    }}
                  >
                    <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                      <Text
                        className={cx(
                          styles['inquiryDetailContainer-btnText'],
                          styles['inquiryDetailContainer-primaryText'],
                        )}
                      >
                        {translate('mobile.resource.askPurchase.fabu')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            case 3:
            case 6:
            case 7:
              return (
                <View className={styles['inquiryDetailContainer-btnBox']}>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!selectAwardItem) {
                        Toast.show({
                          title: translate('mobile.resource.askPurchase.qingxuanzeshoubiaogongyingshang'),
                          icon: 'none',
                        })
                        return
                      }
                      setOptionType('awrad')
                      setModalTitle(translate('mobile.resource.askPurchase.shifoutijiaoshoubaioshenhe'))
                      setModalVisible(true)
                    }}
                  >
                    <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                      <Text
                        className={cx(
                          styles['inquiryDetailContainer-btnText'],
                          styles['inquiryDetailContainer-primaryText'],
                        )}
                      >
                        {translate('mobile.resource.askPurchase.tijiaoshoubiaoshenhe')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            case 4:
            case 5:
              return (
                <View className={styles['inquiryDetailContainer-btnBox']}>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      preload({
                        id,
                        refresh: () => {
                          refresh()
                        },
                      })
                      Router.navigateTo('askPurchase/buyer/feedback')
                    }}
                  >
                    <View
                      className={cx(
                        styles['inquiryDetailContainer-primaryBtn'],
                        styles['inquiryDetailContainer-defaultBtn'],
                      )}
                    >
                      <Text className={cx(styles['inquiryDetailContainer-btnText'])}>
                        {translate('mobile.resource.askPurchase.shenhebutongguo')}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOptionType('audit')
                      setModalTitle(translate('mobile.resource.askPurchase.shifouquerenshenhetongguo'))
                      setModalVisible(true)
                    }}
                  >
                    <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                      <Text
                        className={cx(
                          styles['inquiryDetailContainer-btnText'],
                          styles['inquiryDetailContainer-primaryText'],
                        )}
                      >
                        {translate('mobile.resource.askPurchase.shenhetongguo')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            case 8:
              return (
                <View className={styles['inquiryDetailContainer-btnBox']}>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOptionType('confirmAwrad')
                      setModalTitle(translate('mobile.resource.askPurchase.shifouquerenshoubiao'))
                      setModalVisible(true)
                    }}
                  >
                    <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                      <Text
                        className={cx(
                          styles['inquiryDetailContainer-btnText'],
                          styles['inquiryDetailContainer-primaryText'],
                        )}
                      >
                        {translate('mobile.resource.askPurchase.querenshoubiao')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            case 9:
              return (
                <View className={styles['inquiryDetailContainer-btnBox']}>
                  <View
                    className={styles['inquiryDetailContainer-touchableOpacity']}
                    onClick={(e) => {
                      e.stopPropagation()
                      setOptionType('createOrder')
                      setShowSkuList(true)
                    }}
                  >
                    <View className={cx(styles['inquiryDetailContainer-primaryBtn'])}>
                      <Text
                        className={cx(
                          styles['inquiryDetailContainer-btnText'],
                          styles['inquiryDetailContainer-primaryText'],
                        )}
                      >
                        {translate('mobile.resource.askPurchase.shengchengdingdan')}
                      </Text>
                    </View>
                  </View>
                </View>
              )
            default:
              return null
          }
        }
        return null
      default:
        return null
    }
  }
  const SHOW_STATUS = PAGE !== 'LIST'
  const handleModalConfirm = () => {
    if (dataSoucre) {
      if (optionType === 'publish') {
        handlePublish(dataSoucre.id).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      } else if (optionType === 'awrad') {
        if (selectAwardItem) {
          handleAwardBid(dataSoucre.id, selectAwardItem).then((result) => {
            if (result) {
              refresh()
              Router.navigateBack()
            }
          })
        }
      } else if (optionType === 'audit') {
        handleAudit(dataSoucre.id, 1).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      } else if (optionType === 'confirmAwrad') {
        handleAudit(dataSoucre.id).then((result) => {
          if (result) {
            refresh()
            Router.navigateBack()
          }
        })
      } else if (optionType === 'createOrder') {
        handleCreateOrder()
      }
    }
  }

  /** 是否显示比价信息,交易信息 */
  const showComparisonInfo = useMemo(() => {
    if (dataSoucre) {
      return dataSoucre?.status === 9 ? PAGE !== 'BUYER_LIST' : dataSoucre?.status > 3 || PAGE === 'BUYER_LIST'
    }
    return false
  }, [dataSoucre])

  /** 是否显示交易信息 */
  const showTradeInfo = useMemo(() => {
    return dataSoucre?.status === 9 ? PAGE !== 'BUYER_LIST' : true
  }, [dataSoucre])

  /** 是否显示报价供应商信息 */
  const showQuoteMember = useMemo(() => {
    if (dataSoucre) {
      return dataSoucre.status !== 9
        ? ![1, 2].includes(dataSoucre.status) && PAGE !== 'MERCHANTS_LIST'
        : PAGE !== 'BUYER_LIST'
    }
    return false
  }, [dataSoucre])
  const judgeDisabled = (skuId) => {
    if (selectSkuIds.length > 0) {
      if (!selectSkuIds.includes(skuId)) {
        const skuItem = skuList.find((item) => item.skuId === skuId)
        if (skuItem && !skuList.every((item) => item.shopId === skuItem.shopId)) {
          return true
        }
      }
    }
    return false
  }
  const handleConfirmCreate = () => {
    if (selectSkuIds.length > 0) {
      let newShopMessage = {}
      const selectList = skuList.filter((item) => selectSkuIds.includes(item.skuId))
      for (const selectItem of selectList) {
        newShopMessage = fnGetShopAscription(
          selectItem.memberId,
          selectItem.memberRoleId,
          selectItem.memberName,
          selectItem,
          newShopMessage,
          fnGetActivityType(selectItem),
          selectItem.storeId,
          selectItem.storeLogo,
          selectItem.storeName,
          selectItem.orderAmount,
        )
      }
      fnResetShopStore(newShopMessage)
      setModalTitle(translate('mobile.resource.askPurchase.shifouquerenshengchengdingdan'))
      setModalVisible(true)
    }
  }
  return (
    <View
      className={styles['inquiryDetailContainer']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <FullScreenLoading />
      {dataSoucre && (
        <View
          style={{
            flex: 1,
            height: 0,
          }}
        >
          <ScrollView className={styles['inquiryDetailContainer-scrollView']}>
            {SHOW_STATUS && (
              <View className={styles['status']}>
                {dataSoucre && (
                  <Text className={styles['status-txet']}>
                    {PAGE === 'MERCHANTS_LIST'
                      ? outerStatusList[dataSoucre.status]
                      : innerStatusList[dataSoucre.status]}
                    &gt;
                  </Text>
                )}
              </View>
            )}
            <View className={cx(styles['inquiryDetailContainer-scrollBox'], SHOW_STATUS && styles['mgt'])}>
              <View className={styles['inquiryDetailContainer-contextBox']}>
                <View className={styles['inquiryDetailContainer-productInfo']}>
                  <View className={styles['inquiryDetailContainer-productInfoTitle']}>
                    <View className={styles['inquiryDetailContainer-docLine']} />
                    <Text className={styles['inquiryDetailContainer-productName']}>{dataSoucre?.name}</Text>
                  </View>
                  <View className={styles['inquiryDetailContainer-productInfoNo']}>
                    <Text className={styles['inquiryDetailContainer-productNo']}>{dataSoucre?.askPurchaseNo}</Text>
                    <View>
                      <Text
                        onClick={() => clipboard(dataSoucre?.askPurchaseNo)}
                        className={styles['inquiryDetailContainer-textCopyStyle']}
                      >
                        {intl.formatMessage({
                          id: 'inquiry.fuzhi',
                          defaultMessage: '复制',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                <BasicInfo dataSoucre={dataSoucre} PAGE={PAGE} />
                {/* 不是待发布,待报价和已完成状态时显示报价供应商列表 */}
                {showQuoteMember && <QuoteMember quoteList={quoteList} PAGE={PAGE} status={dataSoucre.status} />}
                {/* 已完成状态显示报价单信息 */}
                {dataSoucre.status === 9 && PAGE !== 'LIST' && PAGE !== 'BUYER_DETAIL' && (
                  <QuoteInfo expandIds={expandIds} quoteInfo={quoteInfo} setExpandIds={setExpandIds} />
                )}
                {/* 比价信息 */}
                {showComparisonInfo && (
                  <PriceComparisonInfo
                    dataSoucre={dataSoucre}
                    PAGE={PAGE}
                    expandIds={expandIds}
                    parityList={parityList}
                    rankList={rankList}
                    selectAwardItem={selectAwardItem}
                    setSelectAwardItem={setSelectAwardItem}
                    setExpandIds={setExpandIds}
                  />
                )}
                {/* 物料信息 */}
                <GoodsInfo dataSoucre={dataSoucre} PAGE={PAGE} expandIds={expandIds} setExpandIds={setExpandIds} />
                {/* 交易信息 */}
                {showTradeInfo && <Trading dataSoucre={dataSoucre} PAGE={PAGE} />}
                {dataSoucre.status === 9 && PAGE !== 'LIST' && <QuoteOther dataSoucre={quoteInfo} />}
                {/* 其他信息 */}
                {(PAGE === 'LIST' || dataSoucre.status !== 9) && <Other dataSoucre={dataSoucre} />}
                {/* 附件 */}
                <Enclosure enclosureUrls={dataSoucre.enclosureUrls} />
                {/* 发布类型 */}
                {(dataSoucre.status !== 9 || PAGE === 'BUYER_DETAIL') && (
                  <PublishType dataSoucre={dataSoucre} PAGE={PAGE} />
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      {renderBottomButton()}
      <Modal
        title={modalTitle}
        isOpened={modalVisible}
        onConfirm={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false)
        }}
        cancelText={translate('mobile.common.cancel')}
        confirmText={translate('mobile.common.confirm')}
        className={styles['order-model']}
      />
      <Popup visible={showSkuList} onClose={() => setShowSkuList(false)}>
        <View className={styles['warp']}>
          <View className={styles['title']}>
            <Text className={styles['text']}>{translate('mobile.resource.askPurchase.xuanzexiadanshangpin')}</Text>
          </View>
        </View>
        <ScrollView className={styles['skuList-main']}>
          <CheckboxGroup value={selectSkuIds} onChange={(val: number[]) => setSelectSkuIds(val)}>
            {skuList.map((item: any, index: number) => (
              <View key={`skuItem${index}`} className={styles['skuList-item']}>
                <ImageBox width={80} height={80} resource={item.commodityLogo} round={4} />
                <View className={styles['skuList-item-main']}>
                  <Text className={styles['skuList-item-name']}>{item.name}</Text>
                  <Text className={styles['skuList-item-channel']}>
                    {translate('mobile.resource.askPurchase.caigouqudao')}：{item.shopName}
                  </Text>
                  <View className={styles['skuList-item-bottom']}>
                    <Text>ID: {item.skuId}</Text>
                    <Text>x{item.count}</Text>
                  </View>
                </View>
                {!judgeDisabled(item.skuId) ? (
                  <Checkbox
                    value={item.skuId}
                    style={{
                      paddingLeft: 24,
                    }}
                  />
                ) : (
                  <View className={styles['skuList-item-disabledCheck']} />
                )}
              </View>
            ))}
          </CheckboxGroup>
        </ScrollView>
        <Button
          disabled={selectSkuIds.length === 0}
          customStyle={{
            margin: 8,
          }}
          onClick={() => handleConfirmCreate()}
          type="primary"
        >
          {translate('mobile.common.confirm')}
        </Button>
      </Popup>
    </View>
  )
}
export default GlobalWrapper(observer(AskPurchaseDetail))
