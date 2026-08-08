import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ScrollView, BaseEventOrig } from '@tarojs/components'
import { Icons, View, Radio, Button, Tabs } from '@apps/mobile-ui'
import { preload } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import { REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE } from '@/constants/const/repair'
import { dateFormat } from '@/utils/date'
import {
  getAftersalesMobileRepairGoodsPageByConsumer,
  GetAftersalesMobileRepairGoodsPageByConsumerResponseDetail,
  getAftersalesMobileRepairGoodsPageItems,
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
const RepairRecords: React.FC = () => {
  const [list, setList] = useState<GetAftersalesMobileRepairGoodsPageByConsumerResponseDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [outerStatus, setOuterStatus] = useState<StatusItem[]>([])
  const [innerStatus, setInnerStatus] = useState<StatusItem[]>([])
  const [radioValue] = useState<number>(3)
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
        id: 'repairRecords.repairRecordsIndex.all',
        defaultMessage: '全部',
      }),
      key: '0',
    },
    {
      title: intl.formatMessage({
        id: 'repairRecords.repairRecordsIndex.CONFIRMED_ACCEPTABLE',
        defaultMessage: '待确认售后完成',
      }),
      key: `${REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE}`,
    },
  ]
  const getList = (extraParams?: ListParams): Promise<GetAftersalesMobileRepairGoodsPageByConsumerResponseDetail[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      getAftersalesMobileRepairGoodsPageByConsumer({
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
    getAftersalesMobileRepairGoodsPageItems().then((res) => {
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
    Router.navigateTo('afterService/afterRecords/repairRecords/repairDetails', {
      repairId: id,
    })
  }

  /**
   * 跳转确认售后完成
   * @param record 列表记录
   */
  const handleJumpFinished = (
    e: BaseEventOrig<any>,
    record: GetAftersalesMobileRepairGoodsPageByConsumerResponseDetail,
  ) => {
    e.stopPropagation()
    preload({
      repairId: record.applyId,
      onRefresh: refreshList,
    })
    Router.navigateTo('afterService/afterTodo/repairPrFinished/repairSubmitFinished')
  }
  const renderAction = (record: GetAftersalesMobileRepairGoodsPageByConsumerResponseDetail) => {
    if (record.innerStatus === REPAIR_INNER_STATUS_CONFIRMED_ACCEPTABLE) {
      return (
        <Button size="small" type="secondary" onClick={(e) => handleJumpFinished(e, record)}>
          {intl.formatMessage({
            id: 'repairRecords.repairRecordsIndex.actions.finished',
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
    const _key = TAB_LIST[index].key
    innerStatusRef.current = +_key
    outerStatusRef.current = 0
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
    <View className={styles['repair-records']}>
      <FilterModal.Status
        renderHeaderComponent={
          <View id="topbar">
            <NavBar
              title={
                <View className={styles['repair-records-nav']}>
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
      <View className={styles['repair-records-scroll']}>
        <ScrollView
          onScrollToLower={handleLoadMore}
          refresherTriggered={refreshing}
          onRefresherRefresh={refreshList}
          className={styles['repair-records-scrollView']}
          refresherEnabled
          scrollY
        >
          <View className={styles['repair-records-list']}>
            {list.map((item) => (
              <View key={item.applyId} className={styles['repair-records-list-item']}>
                <AsCounter
                  afterType={3}
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
                    quantity: item.productList.reduce((prev, curr) => prev + (curr?.repairCount as number), 0),
                  }}
                  onPress={() => handleJumpRecords(item.applyId)}
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
export default GlobalWrapper(RepairRecords)
