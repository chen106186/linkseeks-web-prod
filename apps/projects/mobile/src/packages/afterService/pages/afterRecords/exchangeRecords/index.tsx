import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-15 18:53:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 18:14:12
 * @Description: 换货记录
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ScrollView, BaseEventOrig } from '@tarojs/components'
import { View, Tabs, Icons, Radio, Button } from '@apps/mobile-ui'
import { preload } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import {
  EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS,
  EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY,
  EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT,
  EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_LOGISTICS,
  EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS,
  EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY,
  EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY,
  EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE,
  EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE,
} from '@/constants/const/exchange'
import { CREDIT_TYPE_EXCHANGE_REFUND } from '@/constants/const/logistics'
import { dateFormat } from '@/utils/date'
import {
  getAftersalesMobileReplaceGoodsPageByConsumer,
  getAftersalesMobileReplaceGoodsPageItems,
  GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import Search from '@/components/Search'
import FilterModal from '@/components/FilterModal'
import { StatusItem } from '@/components/FilterModal/StatusFilterModal'
import { DateRangeValueType } from '@/components/FilterModal/components/DateGroup'
import useAfterServiceConst from '@/packages/afterService/hooks/useAfterServiceConst'
import AsCounter from '../components/AsCounter'
import { SHOP_PROPERTY } from '@/constants/const/shop'
import useStores from '@/store/useStores'
import { useMobileIntl } from '@apps/locales'
import styles from './index.module.scss'
const PAGE_SIZE = 8
interface ListParams {
  /**
   * 页数
   */
  pageSize?: string
}
const ExchangeRecords: React.FC = () => {
  const [list, setList] = useState<GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [outerStatus, setOuterStatus] = useState<StatusItem[]>([])
  const [innerStatus, setInnerStatus] = useState<StatusItem[]>([])
  const [radioValue] = useState<number>(2)
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
        id: 'exchangeRecords.exchangeRecordsIndex.all',
        defaultMessage: '全部',
      }),
      key: '0',
    },
    // { title: intl.formatMessage({id: 'exchangeRecords.exchangeRecordsIndex.NOT_ADDED_REFUND_DELIVERY',  defaultMessage: '待新增退货发货单' }), key: `${EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY}` },
    // { title: intl.formatMessage({id: 'exchangeRecords.exchangeRecordsIndex.CONSUMER_NOT_ADDED_LOGISTICS',  defaultMessage: '待新增物流单' }), key: `${EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS}` },
    {
      title: intl.formatMessage({
        id: 'exchangeRecords.exchangeRecordsIndex.UNCONFIRMED_REFUND_DELIVERY',
        defaultMessage: '待退货发货',
      }),
      key: `${EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY}`,
    },
    // { title: intl.formatMessage({id: 'exchangeRecords.exchangeRecordsIndex.UNCONFIRMED_REFUND_RECEIPT',  defaultMessage: '待确认退货回单' }), key: `${EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT}` },
    // { title: intl.formatMessage({id: 'exchangeRecords.exchangeRecordsIndex.NOT_ADDED_REPLACE_STORAGE',  defaultMessage: '待新增换货收货单' }), key: `${EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE}` },
    {
      title: intl.formatMessage({
        id: 'exchangeRecords.exchangeRecordsIndex.UNCONFIRMED_REPLACE_RECEIVE',
        defaultMessage: '待换货收货',
      }),
      key: `${EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE}`,
    },
    {
      title: intl.formatMessage({
        id: 'exchangeRecords.exchangeRecordsIndex.UNCONFIRMED_FINISHED',
        defaultMessage: '待确认售后完成',
      }),
      key: `${EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED}`,
    },
  ]
  const getList = (
    extraParams?: ListParams,
  ): Promise<GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      getAftersalesMobileReplaceGoodsPageByConsumer({
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
    getAftersalesMobileReplaceGoodsPageItems().then((res) => {
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
    Router.navigateTo('afterService/afterRecords/exchangeRecords/exchangeDetails', {
      replaceId: id,
    })
  }

  /**
   * 跳转审核换货收货单
   * @param record 列表记录
   */
  const handleJumpAddExchangeGRN = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('AddExchangeGRN', {
      replaceDeliveryId: record.replaceDeliveryId,
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转新增换货收货单
   * @param record 列表记录
   */
  const handleJumpVerifyExchangeGRN = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('VerifyExchangeGRN', {
      replaceDeliveryId: record.replaceDeliveryId,
      replaceApplyId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转新增退货发货单
   * @param record 列表记录
   */
  const handleJumpAddExchangeReturnInvoice = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('AddExchangeReturnInvoice', {
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转审核退货发货单
   * @param record 列表记录
   */
  const handleJumVerifyExchangeReturnInvoice = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('VerifyExchangeInvoice', {
      returnDeliveryId: record.returnDeliveryId,
      replaceApplyId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转退货回单
   * @param record 列表记录
   */
  const handleJumpConfirmBack = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('ExchangeConfirmBack', {
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转退货发货
   * @param record 列表记录
   */
  const handleJumpDelivery = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/exchangePrSendOut/exchangeSendOut')
  }

  /**
   * 跳转换货收货
   * @param record 列表记录
   */
  const handleJumpReceived = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/exchangePrReceived/exchangeReceived')
  }

  /**
   * 跳转确认售后完成
   * @param record 列表记录
   */
  const handleJumpFinished = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      replaceId: record.replaceId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/exchangePrFinished/exchangeSubmitFinished')
  }

  /**
   * 跳转新增物流单页面
   * @param record 列表记录
   */
  const handleJumpAddLogisticsBill = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('AddLogisticsBill', {
      createType: CREDIT_TYPE_EXCHANGE_REFUND,
      invoicesId: record.replaceId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转修改物流单页面
   * @param record 列表记录
   */
  const handleJumpEditLogisticsBill = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('AddLogisticsBill', {
      logisticsId: record.returnLogisticsId,
      onRefresh: refreshList,
    })
  }

  /**
   * 跳转查看物流单页面
   * @param record 列表记录
   */
  const handleJumpExchangeLogisticsDetails = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    Router.navigateTo('ExchangeLogisticsDetails', {
      logisticsId: record.returnLogisticsId,
    })
  }
  const renderAction = (record: GetAftersalesMobileReplaceGoodsPageByConsumerResponseDetail) => {
    if (record.innerStatus === EXCHANGE_INNER_STATUS_NOT_ADDED_REPLACE_STORAGE) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpAddExchangeGRN(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.addExchangeGRN',
            defaultMessage: '新增换货收货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNREVIEWED_REPLACE_STORAGE) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpVerifyExchangeGRN(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.verifyExchangeGRN',
            defaultMessage: '审核换货收货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_RECEIPT) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpConfirmBack(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.confirmBack',
            defaultMessage: '确认退货回单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_CONSUMER_NOT_ADDED_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpAddLogisticsBill(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.addLogisticsBill',
            defaultMessage: '新增物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNACCEPTED_REFUND_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpEditLogisticsBill(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.editLogisticsBill',
            defaultMessage: '修改物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_CONSUMER_UNCONFIRMED_LOGISTICS) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpExchangeLogisticsDetails(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.exchangeLogisticsDetails',
            defaultMessage: '查看物流单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_NOT_ADDED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpAddExchangeReturnInvoice(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.addExchangeReturnInvoice',
            defaultMessage: '新增退货发货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNREVIEWED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumVerifyExchangeReturnInvoice(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.verifyExchangeReturnInvoice',
            defaultMessage: '审核退货发货单',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REFUND_DELIVERY) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpDelivery(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.delivery',
            defaultMessage: '退货发货',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpReceived(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.received',
            defaultMessage: '换货收货',
          })}
        </Button>
      )
    }
    if (record.innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_FINISHED) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpFinished(e, record)}>
          {intl.formatMessage({
            id: 'exchangeRecords.exchangeRecordsIndex.actions.finished',
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
    const key = TAB_LIST[index].key
    if (
      +key === EXCHANGE_OUTER_STATUS_NOT_ADDED_REFUND_DELIVERY ||
      +key === EXCHANGE_OUTER_STATUS_NOT_ADDED_REPLACE_STORAGE
    ) {
      outerStatusRef.current = +key
      innerStatusRef.current = 0
    } else {
      innerStatusRef.current = +key
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
    <View className={styles['exchange-records']}>
      <FilterModal.Status
        renderHeaderComponent={
          <View id="topbar">
            <NavBar
              title={
                <View className={styles['exchange-records-nav']}>
                  <Radio.Group
                    buttonSize="small"
                    type="radio.button"
                    size={14}
                    value={radioValue}
                    onChange={handleRadioChange}
                  >
                    {navOptions.map((item) => (
                      <Radio.Button size="small" key={item.value} value={item.value}>
                        {item.content}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </View>
              }
            />
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
        <Tabs current={outerIndex} onClick={handleTabsChange} tabList={TAB_LIST} scroll />
      </View>
      <View className={styles['exchange-records-scroll']}>
        <ScrollView
          onScrollToLower={handleLoadMore}
          refresherTriggered={refreshing}
          onRefresherRefresh={refreshList}
          className={styles['exchange-records-scrollView']}
          refresherEnabled
          scrollY
        >
          <View className={styles['exchange-records-list']}>
            {list.map((item) => (
              <View key={item.replaceId} className={styles['exchange-records-list-item']}>
                <AsCounter
                  afterType={2}
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
                    quantity: item.productList.reduce((prev, curr) => prev + (curr.replaceCount as number), 0),
                  }}
                  onPress={() => handleJumpRecords(item.replaceId)}
                  customRenderFootRight={renderAction(item)}
                  orderType={item.orderType}
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
export default GlobalWrapper(ExchangeRecords)
