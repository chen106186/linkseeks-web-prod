import React, { useEffect, useState, useRef } from 'react'
import { useRouter, preload } from '@apps/mobile-services/utils/taro'
import { View, Icons, Tabs, ScrollView } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import Search from '@/components/Search'
import Empty from '@/components/Empty'
import Router from '@/utils/router'
import GenIndicator from '@/components/GenIndicator'
import FilterModal from '@/components/FilterModal'
import { StatusItem, ConfirmData } from '@/components/FilterModal/StatusFilterModal'
// import { useSafeArea } from '@apps/mobile-services';
import {
  getSettlementMobileBusinessApplyAmountExamineList,
  getSettlementMobileBusinessApplyAmountList,
  getSettlementMobileBusinessApplyAmountListExamineStatus,
  getSettlementMobileBusinessApplyAmountListStatus,
} from '@apps/apis'
import RequisitionItem from '../../../components/listItem'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'

let flag: boolean = true

const MaterialList: React.FC<{}> = () => {
  const { type, status, _tabCurrent } = useRouter().params
  // const { safeBottomHeight } = useSafeArea();
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [contentList, setContentList] = useState<any[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [digest, setDigest] = useState<string>('')
  const [innerStatus, setInnerStatus] = useState<number>(Number(status || 0))
  const [innerStatusList, setInnerStatusList] = useState<StatusItem[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [tabCurrent, setTabCurrent] = useState<number>(Number(_tabCurrent || 0))
  const [tabList, setTabList] = useState<any[]>()
  const [filterVisible, setFilterVisible] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState<ConfirmData>({ curInnerStatus: Number(status || 0) })
  const [title, setTitle] = useState('请款单查询')

  const _getStatusNum = () => {
    let fn = getSettlementMobileBusinessApplyAmountListStatus
    if (type === 'audit') {
      setTitle('请款单审核')
      fn = getSettlementMobileBusinessApplyAmountListExamineStatus
    }
    fn().then((res) => {
      if (res.code === 1000) {
        const _list = res.data
          .map((item) => {
            return { title: item.text, key: item.status }
          })
          .filter((item) => item.key !== 1000)
        setTabList(_list)
        setInnerStatusList(
          _list.map((item) => {
            return { name: item.title, status: item.key }
          }),
        )
      }
    })
  }

  /** 通过api获取数据 */
  const fetchContentList = (currentPage?: number, merge: boolean = false) => {
    const params: any = {
      current: currentPage || current,
      pageSize,
    }
    if (searchParams?.curInnerStatus) params.status = searchParams.curInnerStatus
    if (digest && flag) params.applyAbstract = digest
    let _fn = getSettlementMobileBusinessApplyAmountList
    if (type === 'audit') {
      _fn = getSettlementMobileBusinessApplyAmountExamineList
    }

    _fn({ ...params }).then((res: any) => {
      if (res.code === 1000) {
        const { data } = res.data
        if (merge) {
          if (!data || data.length <= 0) {
            setNoMoreData(true)
            setCurrent(current - 1)
          } else {
            setContentList([...contentList, ...data])
            loadMoreLoading.current = false
            setNoMoreData(false)
          }
        } else {
          setContentList(data)
          loadMoreLoading.current = false
          if (data.length < pageSize) {
            setNoMoreData(true)
          } else {
            setNoMoreData(false)
          }
        }
      }
    })
  }

  /** 搜索 */
  const handleSearchSubmit = (val: string) => {
    setDigest(val)
    setCurrent(1)
    flag = true
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  /** 清除搜索 */
  const handleClearSubmit = (val: string) => {
    setDigest(val)
    setCurrent(1)
    flag = false
    setContentList([])
    loadMoreLoading.current = false
    setNoMoreData(false)
    fetchContentList()
  }

  const handleVisibleFilterModal = (flag?: boolean) => {
    setFilterVisible(!!flag)
  }

  const handleConfirm = (data: ConfirmData) => {
    const _index = tabList?.findIndex((item) => item.key === (data.curInnerStatus as number))
    handleVisibleFilterModal(false)
    setTabCurrent(_index || 0)
    setSearchParams(data)
    setInnerStatus(data.curInnerStatus as number)
  }

  /** 头部搜索 */
  const renderHeader = () => (
    <FilterModal.Status
      renderHeaderComponent={
        <View className={styles['searchBox']}>
          <View className={styles['searchBox-search']}>
            <Search
              placeholder="请款单摘要搜索"
              onChange={(value) => setDigest(value)}
              onSearch={(value) => handleSearchSubmit(value)}
              onClear={(value) => handleClearSubmit(value)}
              searchOnClearAction={false}
              shape="round"
              clearable
            />
          </View>
          {!type && (
            <View onClick={() => handleVisibleFilterModal(!filterVisible)}>
              <Icons name="Filter" size={20} color="#252D37" />
            </View>
          )}
        </View>
      }
      timer={false}
      visible={filterVisible}
      onClose={() => handleVisibleFilterModal(false)}
      innerStatusValue={innerStatus}
      innerStatus={innerStatusList}
      onConfirm={handleConfirm}
    />
  )

  const onTabChange = (index: number) => {
    if (tabList?.[index].key === innerStatus) return
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    setTabCurrent(index)
    setInnerStatus(tabList?.[index].key)
    let _setSearchParams = searchParams ? { ...searchParams } : {}
    _setSearchParams.curInnerStatus = tabList?.[index].key
    setSearchParams(_setSearchParams)
  }

  useEffect(() => {
    fetchContentList(1, false)
  }, [searchParams])

  useEffect(() => {
    _getStatusNum()
  }, [])

  /** tab 切换 */
  const renderTab = () => (
    <View className={styles['requisitionList-tabBar']}>
      <Tabs height="100%" current={tabCurrent} onClick={onTabChange} tabList={tabList} scroll />
    </View>
  )

  const refreshFn = () => {
    setContentList([])
    setCurrent(1)
    loadMoreLoading.current = true
    setNoMoreData(false)
    fetchContentList(1, false)
  }

  const handleLink = (item) => {
    preload({
      applyAmountId: item.id,
      applyNo: item.applyNo,
      type,
      refresh: () => {
        refreshFn()
      },
    })
    Router.navigateTo('settlement/settlementDetail')
  }

  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => (
    <RequisitionItem
      data={item}
      key={item.id}
      onClick={() => {
        handleLink(item)
      }}
      type={type}
    />
  )

  /** 加载更多 */
  const loadMoreData = () => {
    if (!loadMoreLoading.current && !noMoreDate) {
      loadMoreLoading.current = true
      setCurrent(current + 1)
      fetchContentList(current + 1, true)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    refreshFn()
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }

  return (
    <View className={styles['requisitionList']}>
      <PageLayout
        // style={(safeBottomHeight) ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <View className={styles['requisitionList-header']}>
            <NavBar title={title} />
            {renderHeader()}
            {renderTab()}
          </View>
        }
      >
        <View className={styles['requisitionList-scrollView']}>
          <ScrollView
            className={styles['requisitionList-flatList']}
            data={contentList}
            renderItem={renderItem}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            listEmptyComponent={<View className={styles['empty__description']}>{'暂无数据'}</View>}
            listFooterComponent={JSON.stringify(contentList) !== '[]' ? <GenIndicator noMoreDate={noMoreDate} /> : null}
            horizontal={false}
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={() => handleRefresh()}
            onEndReached={() => {
              loadMoreData()
            }}
          />
        </View>
      </PageLayout>
    </View>
  )
}
export default MaterialList
