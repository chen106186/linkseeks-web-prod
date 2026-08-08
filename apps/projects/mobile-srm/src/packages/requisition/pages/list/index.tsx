import React, { useEffect, useState, useRef } from 'react'
import { preload } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Tabs, ScrollView } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import NavBar from '@/components/NavBar'
import Search from '@/components/Search'
import Empty from '@/components/Empty'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import { dateFmt } from '@/utils/date'
import GenIndicator from '@/components/GenIndicator'
import FilterModal from '@/components/FilterModal'
import { StatusItem, ConfirmData } from '@/components/FilterModal/StatusFilterModal'
import { useSafeArea } from '@apps/mobile-services'
import { getPurchaseRequisitionSrmFindInnerStatusEnum, getPurchaseRequisitionSrmPage } from '@apps/apis'
import RequisitionItem from '../../components/requisitionItem'
import styles from './index.module.scss'

const operationList = [1, 7]

let flag: boolean = true

const RequisitionList: React.FC<{}> = () => {
  const {
    createStore: { clearStore },
  } = useStores()
  const { safeBottomHeight } = useSafeArea()
  const loadMoreLoading = useRef<boolean>(false)
  const [noMoreDate, setNoMoreData] = useState<boolean>(false)
  const [contentList, setContentList] = useState<any[]>([])
  const [current, setCurrent] = useState<number>(1)
  const [pageSize] = useState<number>(10)
  const [digest, setDigest] = useState<string>('')
  const [innerStatus, setInnerStatus] = useState<number>(0)
  const [innerStatusList, setInnerStatusList] = useState<StatusItem[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [tabCurrent, setTabCurrent] = useState<number>(0)
  const [tabList, setTabList] = useState<any[]>()
  const [filterVisible, setFilterVisible] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState<ConfirmData>()

  const _getStatusNum = () => {
    getPurchaseRequisitionSrmFindInnerStatusEnum().then((res) => {
      if (res.code === 1000) {
        const _list = [{ title: '全部', key: 0 }]
          .concat(
            res.data.map((item) => {
              return { title: item.name, key: item.state }
            }),
          )
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
    if (searchParams?.curInnerStatus) params.innerStatus = searchParams.curInnerStatus
    if (searchParams?.dateGroup) params.startDate = dateFmt(searchParams?.dateGroup[0])
    if (searchParams?.dateGroup) params.endDate = dateFmt(searchParams?.dateGroup[1])
    if (digest && flag) params.digest = digest

    getPurchaseRequisitionSrmPage({ ...params }).then((res: any) => {
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
    setCurrent(1)
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
              placeholder="请购单摘要"
              onChange={(value) => setDigest(value)}
              onSearch={(value) => handleSearchSubmit(value)}
              onClear={(value) => handleClearSubmit(value)}
              searchOnClearAction={false}
              shape="round"
              clearable
            />
          </View>
          <View onClick={() => handleVisibleFilterModal(!filterVisible)}>
            <Icons name="Filter" size={20} color="#252D37" />
          </View>
        </View>
      }
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
    // if (item.innerStatus === 1) {
    //   preload({
    //     id: item.id,
    //     pageStatus: 'PREVIEW',
    //     refresh: () => { refreshFn() }
    //   })
    //   // preload({ refresh: () => { refreshFn() } })
    //   Router.navigateTo('requisition/requisitionDetail')
    // } else {
    preload({
      id: item.id,
      pageStatus: operationList.includes(item.innerStatus) ? 'OPERATION' : 'PREVIEW',
      refresh: () => {
        refreshFn()
      },
      isAudit: false,
    })
    Router.navigateTo('requisition/requisitionDetail')
    // }
  }

  const handleCreate = () => {
    clearStore()
    preload({
      refresh: () => {
        refreshFn()
      },
    })
    Router.navigateTo('requisition/requisitionCreate')
  }

  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => {
    const _showTag =
      item.innerStatus === 1 || (item.innerStatus === 7 && Number(item?.transferQuantity) < Number(item?.quantity))
        ? true
        : false
    const _type = item.innerStatus === 7 ? 1 : 2
    return (
      <RequisitionItem
        data={item}
        key={item.id}
        showTag={_showTag}
        type={_type}
        isAudit={false}
        onClick={() => {
          handleLink(item)
        }}
      />
    )
  }

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
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title="请购单查询" />
            <View className={styles['requisitionList-header']}>
              {renderHeader()}
              {renderTab()}
            </View>
          </>
        }
      >
        <View className={styles['requisitionList-scrollView']}>
          <ScrollView
            className={styles['requisitionList-flatList']}
            data={contentList}
            renderItem={renderItem}
            keyExtractor={(item: any) => `scrollItem${item.id}`}
            onEndReachedThreshold={50}
            listEmptyComponent={<Empty />}
            listFooterComponent={JSON.stringify(contentList) !== '[]' ? <GenIndicator noMoreDate={noMoreDate} /> : null}
            horizontal={false}
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={() => handleRefresh()}
            onEndReached={() => {
              loadMoreData()
            }}
          />
          <View
            className={styles['requisitionList-fixButton']}
            style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
          >
            <View className={styles['requisitionList-fixButton-btn']} onClick={handleCreate}>
              <Icons name="Plus" size={14} color="#fff" />
              <Text className={styles['requisitionList-fixButton-btn-text']}>新增请购单</Text>
            </View>
          </View>
        </View>
      </PageLayout>
    </View>
  )
}
export default RequisitionList
