import React, { useEffect, useState, useRef } from 'react'
import { getCurrentInstance, setNavigationBarTitle, preload } from '@apps/mobile-services/utils/taro'
import { View, Icons, Tabs, ScrollView } from '@apps/mobile-ui'
import PageLayout from '@/components/PageLayout'
import Search from '@/components/Search'
import Empty from '@/components/Empty'
import useStores from '@/store/useStores'
import Router from '@/utils/router'
import GenIndicator from '@/components/GenIndicator'
import FilterModal from '@/components/FilterModal'
import { StatusItem, ConfirmData } from '@/components/FilterModal/StatusFilterModal'
import { useSafeArea } from '@apps/mobile-services'
import { getContractMobileManageGetMenuByUser, getContractMobileManagePageList } from '@apps/apis'
import ContractItem from '../../components/contractItem'
import styles from './index.module.scss'
import NavBar from '@/components/NavBar'

const operationList = [1, 7]

let flag: boolean = true

const RequisitionList: React.FC<{}> = () => {
  const { contractType, innerStatusKey, currentKey } = getCurrentInstance()?.router?.params
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
  const [innerStatus, setInnerStatus] = useState<number>(Number(innerStatusKey))
  const [innerStatusList, setInnerStatusList] = useState<StatusItem[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [tabCurrent, setTabCurrent] = useState<number>(Number(currentKey))
  const [tabList, setTabList] = useState<any[]>()
  const [filterVisible, setFilterVisible] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useState<ConfirmData>()
  const [pageTitle, setPageTitle] = useState<string>()

  const _getStatusNum = () => {
    getContractMobileManageGetMenuByUser().then((res) => {
      if (res.code === 1000) {
        let data: any = []
        if (contractType == 'search') {
          setNavigationBarTitle({ title: '合同查询' })
          setPageTitle('合同查询')
          data = [{ title: '全部', key: 0 }]
          res.data.map((i) => {
            if (i.state !== 0 && i.state !== 1 && i.state !== 10) {
              data.push({ title: i.name, key: i.state })
            }
          })
        }

        if (contractType.indexOf('creat') > -1) {
          setNavigationBarTitle({ title: '合同创建审核' })
          setPageTitle('合同创建审核')
          data = [{ title: '全部', key: 1 }]
          res.data.map((i) => {
            if (i.state == 2 || i.state == 3 || i.state == 4 || i.state == 5) {
              data.push({ title: i.name, key: i.state })
            }
          })
        }

        if (contractType.indexOf('sign') > -1) {
          setNavigationBarTitle({ title: '合同签订审核' })
          setPageTitle('合同签订审核')
          data = [{ title: '全部', key: 10 }]
          res.data.map((i) => {
            if (i.state == 11 || i.state == 12 || i.state == 13 || i.state == 14) {
              data.push({ title: i.name, key: i.state })
            }
          })
        }

        setTabList(data)
        setInnerStatusList(
          data.map((item) => {
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
      menuCode: innerStatus,
    }
    if (searchParams?.curInnerStatus) params.menuCode = searchParams.curInnerStatus
    // if (searchParams?.dateGroup) params.endDate = dateFmt(searchParams?.dateGroup[0]);
    if (digest && flag) params.contractAbstract = digest

    getContractMobileManagePageList({ ...params }).then((res: any) => {
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
              placeholder="合同摘要"
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
      outerStatus={undefined}
      timer={false}
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
      id: item.id,
      contractType: contractType,
      pageStatus: operationList.includes(item.innerStatus) ? 'OPERATION' : 'PREVIEW',
      refresh: () => {
        refreshFn()
      },
    })
    Router.navigateTo('contract/detail')
  }

  /** 列表数据 */
  const renderItem = ({ item }: { item: any }) => (
    <ContractItem
      data={item}
      key={item.id}
      type={contractType}
      onClick={() => {
        handleLink(item)
      }}
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
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title={pageTitle} />
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
          {/* <View className={styles['requisitionList-fixButton']}>
            <View className={styles['requisitionList-fixButton-btn']} onClick={handleCreate}>
              <Icons name='Plus' size={14} color='#fff' />
              <Text className={styles['requisitionList-fixButton-btn-text']}>新增</Text>
            </View>
          </View> */}
        </View>
      </PageLayout>
    </View>
  )
}
export default RequisitionList
