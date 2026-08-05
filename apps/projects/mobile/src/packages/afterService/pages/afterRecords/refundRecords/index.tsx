import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-17 20:01:10
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-19 15:43:47
 * @Description: 退货记录
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ScrollView, BaseEventOrig } from '@tarojs/components'
import { Icons, View, Radio, Button, Tabs } from '@apps/mobile-ui'
import { preload } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import {
  REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS,
  REFUND_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS,
  REFUND_INNER_STATUS_UNACCEPTED_LOGISTICS,
  REFUND_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY,
  REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY,
  REFUND_INNER_STATUS_UNCONFIRMED_FINISHED,
  REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED,
  REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT,
  REFUND_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY,
  REFUND_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY,
} from '@/constants/const/refund'
import {
  getAftersalesMobileReturnGoodsPageByConsumer,
  getAftersalesMobileReturnGoodsPageItems,
  GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
} from '@apps/apis'
import { dateFormat } from '@/utils/date'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import Search from '@/components/Search'
import FilterModal from '@/components/FilterModal'
import { StatusItem } from '@/components/FilterModal/StatusFilterModal'
import { DateRangeValueType } from '@/components/FilterModal/components/DateGroup'
import AsCounter from '../components/AsCounter'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import useStores from '@/store/useStores'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import { useMobileIntl } from '@apps/locales'
import styles from './index.module.scss'
const PAGE_SIZE = 8
interface ListParams {
  /**
   * 页数
   */
  pageSize?: string
}
const RefundRecords: React.FC = () => {
  const [list, setList] = useState<GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [outerStatus, setOuterStatus] = useState<StatusItem[]>([])
  const [innerStatus, setInnerStatus] = useState<StatusItem[]>([])
  const [radioValue] = useState<number>(1)
  const [outerIndex, setOuterIndex] = useState<number>(0)
  const {
    userStore: { shopAndSite },
  } = useStores()
  const pageRef = useRef<number>(1)
  const innerStatusRef = useRef<number>(0)
  const outerStatusRef = useRef<number>(0)
  const dateGroupRef = useRef<string[]>([])
  const searchValue = useRef<string>('')
  const translate = useMobileIntl()
  const intl = useIntl()
  const { navOptions } = useAfterServiceConst()
  const TAB_LIST = [
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.all',
        defaultMessage: '全部',
      }),
      key: '0',
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.NOT_ADDED_REFUND_DELIVERY',
        defaultMessage: '待新增退货发货单',
      }),
      key: `${REFUND_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY}`,
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.CONSUMER_NOT_ADDED_LOGISTICS',
        defaultMessage: '待新增物流单',
      }),
      key: `${REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS}`,
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.UNCONFIRMED_REFUND_DELIVERY',
        defaultMessage: '待退货发货',
      }),
      key: `${REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY}`,
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.UNCONFIRMED_REFUND_RECEIPT',
        defaultMessage: '待确认退货回单',
      }),
      key: `${REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT}`,
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.UNCONFIRMED_REFUNDED',
        defaultMessage: '待确认退款结果',
      }),
      key: `${REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED}`,
    },
    {
      title: intl.formatMessage({
        id: 'refundRecords.refundRecordsIndex.UNCONFIRMED_FINISHED',
        defaultMessage: '待确认售后完成',
      }),
      key: `${REFUND_INNER_STATUS_UNCONFIRMED_FINISHED}`,
    },
  ]
  const _renderTabItems = useMemo(() => {
    const _tabItemList = TAB_LIST.slice()
    if (shopAndSite?.property === SHOP_PROPERTY.CUSTOMER_SELF_SUPPORT) {
      _tabItemList.splice(4, 1)
      _tabItemList.splice(1, 2)
    }
    return _tabItemList
  }, [TAB_LIST])
  const getList = (extraParams?: ListParams): Promise<GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      getAftersalesMobileReturnGoodsPageByConsumer({
        keyword: searchValue.current,
        startTime: dateGroupRef.current[0] || '',
        endTime: dateGroupRef.current[1] || '',
        innerStatus: `${innerStatusRef.current || ''}`,
        outerStatus: `${outerStatusRef.current || ''}`,
        current: `${pageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
        ...extraParams,
      })
        .then((res) => {
          if (res.code === 1000) {
            setHasMore(checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount))
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  const getPageItems = () => {
    getAftersalesMobileReturnGoodsPageItems().then((res) => {
      if (res.code === 1000) {
        setOuterStatus(res.data.outerStatusList)
        setInnerStatus(res.data.innerStatusList)
      }
    })
  }
  useEffect(() => {
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
    getPageItems()
  }, [])

  // 重新加载列表
  const refreshList = () => {
    if (refreshing) {
      return
    }
    pageRef.current = 1
    setRefreshing(true)
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
      .finally(() => {
        setRefreshing(false)
      })
  }
  const handleJumpRecords = (id: number) => {
    Router.navigateTo('afterService/afterRecords/refundRecords/refundDetails', {
      returnId: id,
    })
  }

  /**
   * 跳转确认退货回单
   */
  const handleJumpConfirmBack = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('RefundConfirmBack', {
    //   returnId: record.returnId,
    //   onRefresh: refreshList,
    // });
  }

  /**
   * 跳转新增退货发货单
   * @param record 列表记录
   */
  const handleJumpAddReturnInvoice = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('AddReturnInvoice', {
    //   returnId: record.returnId,
    //   onRefresh: refreshList,
    // });
  }

  /**
   * 跳转审核退货发货单
   * @param record 列表记录
   */
  const handleJumVerifyReturnInvoice = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('VerifyReturnInvoice', {
    //   returnDeliveryId: record.returnDeliveryId,
    //   returnApplyId: record.returnId,
    //   onRefresh: refreshList,
    // });
  }

  /**
   * 跳转退货发货
   * @param record 列表记录
   */
  const handleJumpDelivery = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      returnId: record.returnId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/refundPrSendOut/refundSendOut', {
      returnId: record.returnId,
    })
  }

  /**
   * 跳转确认退款
   * @param record 列表记录
   */
  const handleJumpConfirmResult = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      returnId: record.returnId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/refundPrConfirmResult/refundConfirmResult')
  }

  /**
   * 跳转确认售后完成
   * @param record 列表记录
   */
  const handleJumpFinished = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      returnId: record.returnId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/refundPrFinished/refundSubmitFinished')
  }

  /**
   * 跳转新增物流单页面
   * @param record 列表记录
   */
  const handleJumpAddLogisticsBill = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('AddLogisticsBill', {
    //   createType: CREDIT_TYPE_REFUND,
    //   invoicesId: record.returnId,
    //   onRefresh: refreshList,
    // });
  }

  /**
   * 跳转修改物流单页面
   * @param record 列表记录
   */
  const handleJumpEditLogisticsBill = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('AddLogisticsBill', {
    //   logisticsId: record.returnLogisticsId,
    //   onRefresh: refreshList,
    // });
  }

  /**
   * 跳转查看物流单页面
   * @param record 列表记录
   */
  const handleJumpExchangeLogisticsDetails = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    // Router.navigateTo('RefundLogisticsDetails', {
    //   logisticsId: record.returnLogisticsId,
    // });
  }
  const renderAction = (record: GetAftersalesMobileReturnGoodsPageByConsumerResponseDetail) => {
    if (record.innerStatus === REFUND_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpConfirmBack(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.confirmBack',
            defaultMessage: '确认退货回单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpAddLogisticsBill(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.addLogisticsBill',
            defaultMessage: '新增物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_UNACCEPTED_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpEditLogisticsBill(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.editLogisticsBill',
            defaultMessage: '修改物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpExchangeLogisticsDetails(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.exchangeLogisticsDetails',
            defaultMessage: '查看物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpAddReturnInvoice(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.addExchangeReturnInvoice',
            defaultMessage: '新增退货发货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumVerifyReturnInvoice(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.verifyExchangeReturnInvoice',
            defaultMessage: '审核退货发货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpDelivery(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.delivery',
            defaultMessage: '退货发货',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_UNCONFIRMED_REFUNDED) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpConfirmResult(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.confirmRefund',
            defaultMessage: '确认退款',
          })}
        </Button>
      )
    }
    if (record.innerStatus === REFUND_INNER_STATUS_UNCONFIRMED_FINISHED) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpFinished(e, record)}>
          {intl.formatMessage({
            id: 'refundRecords.refundRecordsIndex.actions.finished',
            defaultMessage: '确认售后完成',
          })}
        </Button>
      )
    }
    return null
  }
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return
    }
    pageRef.current += 1
    getList()
      .then((res) => {
        setList(list.concat(res))
      })
      .catch(() => {})
  }
  const handleSearch = (value: string) => {
    if (loading) {
      return
    }
    pageRef.current = 1
    searchValue.current = value
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }
  const handleVisibleFilterModal = (flag?: boolean) => {
    setFilterVisible(!!flag)
  }
  const handleConfirm = (
    outerStatusValue: number,
    innerStatusValue: number,
    dateGroup: DateRangeValueType['range'],
  ) => {
    if (loading) {
      return
    }
    innerStatusRef.current = innerStatusValue
    outerStatusRef.current = outerStatusValue
    dateGroupRef.current = dateGroup.map((item) => dateFormat(item))
    pageRef.current = 1
    handleVisibleFilterModal(false)
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }
  const handleTabsChange = (index: number) => {
    setOuterIndex(index)
    // 这里根据不同 key 设置检索的内外部状态
    // 当 key 等于 外部状态为 待新增退货发货单 时，设置对应的 外部状态 值
    // 这么做是为了 能够检索出 待新增退货发货单 跟 审核退货发货单 两种状态的数据
    const _key = _renderTabItems[index].key
    if (+_key === REFUND_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY) {
      outerStatusRef.current = +_key
      innerStatusRef.current = 0
    } else {
      innerStatusRef.current = +_key
      outerStatusRef.current = 0
    }
    pageRef.current = 1
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }
  const handleRadioChange = (value: number) => {
    let target = 'afterService/afterRecords/exchangeRecords'
    switch (value) {
      case 1:
        target = 'afterService/afterRecords/refundRecords'
        break
      case 2:
        target = 'afterService/afterRecords/exchangeRecords'
        break
      case 3:
        target = 'afterService/afterRecords/repairRecords'
        break
      default:
        break
    }
    Router.redirectTo(target as any)
  }
  return (
    <View className={styles['refund-records']}>
      <FilterModal.Status
        renderHeaderComponent={
          <View id="topbar">
            <NavBar title={<View className={styles['refund-records-nav']}>退货</View>} />
            <View className={styles['nav-extra']}>
              <View className={styles['nav-extra-search']}>
                <Search
                  placeholder={translate('mobile.resource.order.shenqingdanhaodingdangdanhaoshangpinmingcheng')}
                  onSearch={(value) => handleSearch(value)}
                  clearable
                />
              </View>
              <View className={styles['nav-extra-filter']} onClick={() => handleVisibleFilterModal(!filterVisible)}>
                <Icons name="Filter" size={20} color="#252D37" />
              </View>
            </View>
          </View>
        }
        visible={filterVisible}
        onClose={() => handleVisibleFilterModal(false)}
        outerStatus={outerStatus}
        innerStatus={innerStatus}
        onConfirm={handleConfirm}
      />
      {/* 套个 View，因为 Tabs的 height是 100% */}
      <View>
        <Tabs current={outerIndex} onClick={handleTabsChange} tabList={_renderTabItems} scroll />
      </View>
      <View className={styles['refund-records-scroll']}>
        <ScrollView
          onScrollToLower={handleLoadMore}
          refresherTriggered={refreshing}
          onRefresherRefresh={refreshList}
          className={styles['refund-records-scrollView']}
          refresherEnabled
          scrollY
        >
          <View className={styles['refund-records-list']}>
            {list.map((item) => (
              <View key={item.returnId} className={styles['refund-records-list-item']}>
                <AsCounter
                  afterType={1}
                  data={{
                    vender: {
                      id: item.shopId,
                      name: item.shopName,
                      logo: item.shopLogo,
                    },
                    statusName: item.outerStatusName,
                    products: item.productList.map((product) => ({
                      brand: product.brand,
                      category: product.category,
                      productId: product.productId,
                      productName: product.productName!,
                      skuPic: product.skuPic!,
                      purchaseCount: product.purchaseCount,
                      purchasePrice: product.purchasePrice,
                      unit: product.unit!,
                      skuId: 0,
                      remaining: 0,
                    })),
                    quantity: item.productList.reduce((prev, curr) => prev + (curr.returnCount as number), 0),
                    amount: item.refundAmount,
                  }}
                  onPress={() => handleJumpRecords(item.returnId)}
                  customRenderFootRight={renderAction(item)}
                />
              </View>
            ))}
          </View>
          <Loading loading={loading && !refreshing} noMore={!hasMore} />
        </ScrollView>
      </View>
    </View>
  )
}
export default GlobalWrapper(RefundRecords)
