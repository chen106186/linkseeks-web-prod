/*
 * @Description: 供应商信息查询
 */
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView } from '@tarojs/components'
import { Icons, View, Button, Tabs } from '@apps/mobile-ui'
import { TabItem } from '@apps/mobile-ui/packages/types/tabs'
import { useDidShow } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import {
  getMemberMobileMaintenancePageitems,
  postMemberMobileMaintenancePage,
  PostMemberMobileMaintenancePageResponseDetail,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import Search from '@/components/Search'
import CustomFilterModal, { FilterGroupType, FilterValueType } from '@/components/FilterModal/CustomFilterModal'
import Space from '@/components/Space'
import PageLayout from '@/components/PageLayout'
import { getActionsRefreshStorage } from '../../../common/utils/pageStockRefreshUtil'
import MemberCounter from '../../../components/MemberCounter'
import './index.scss'

const PAGE_SIZE = 8

interface ListParams {
  /**
   * 页数
   */
  pageSize?: string
}

type TabItemType = TabItem & { key: number }

type ListQueryType = {
  name: string
  startDate: string
  endDate: string
  level: number
}

type ListFilterQueryType = {
  memberTypeId: number
  roleId: number
  status: number
  innerStatus: number
}

type MemberItemType = PostMemberMobileMaintenancePageResponseDetail & {}

const SupplierManagementIndex: React.FC = () => {
  const [list, setList] = useState<MemberItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [tabs, setTabs] = useState<TabItemType[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterGroupType[]>([])

  const pageRef = useRef<number>(1)
  const listExtraQueryRef = useRef<ListQueryType>({
    name: '',
    startDate: '',
    endDate: '',
    level: 0,
  })
  const listFilterQueryRef = useRef<ListFilterQueryType>({
    memberTypeId: 0,
    roleId: 0,
    status: 0,
    innerStatus: 0,
  })
  // 防止在h5环境下，进入详情页之后刷新了页面，导致进行操作之后返回列表页面
  // 请求两次列表页的问题
  const listInited = useRef(false)

  const getList = (extraParams?: ListParams): Promise<MemberItemType[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      postMemberMobileMaintenancePage({
        ...(listExtraQueryRef.current as any),
        ...(listFilterQueryRef.current as any),
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
    getMemberMobileMaintenancePageitems().then((res) => {
      if (res.code === 1000) {
        const { memberTypes, roles, status, innerStatus } = res.data
        if (innerStatus) {
          setTabs(innerStatus.map((item) => ({ title: item.text, key: item.id })))
        }
        setFilterOptions([
          {
            title: '供应商类型',
            fieldName: 'memberTypeId',
            fieldType: 'custom',
            options: (memberTypes || []).map((item) => ({ name: item.memberTypeName, value: item.memberTypeId })),
          },
          {
            title: '供应商角色',
            fieldName: 'roleId',
            fieldType: 'custom',
            options: (roles || []).map((item) => ({ name: item.roleName, value: item.roleId })),
          },
          {
            title: '供应商状态',
            fieldName: 'status',
            fieldType: 'custom',
            options: (status || []).map((item) => ({ name: item.text, value: item.id })),
          },
          {
            title: '内部状态',
            fieldName: 'innerStatus',
            fieldType: 'custom',
            options: (innerStatus || []).map((item) => ({ name: item.text, value: item.id })),
          },
        ])
      }
    })
  }

  useEffect(() => {
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
      .finally(() => {
        listInited.current = true
      })
    getPageItems()
  }, [])

  // 重新加载列表
  const refreshList = (params?: ListParams) => {
    if (refreshing) {
      return
    }
    pageRef.current = 1
    setRefreshing(true)
    // setList([]);
    getList(params)
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
      .finally(() => {
        setRefreshing(false)
      })
  }

  useDidShow(() => {
    const listRefresh = getActionsRefreshStorage()
    if (listInited.current && listRefresh) {
      refreshList({ pageSize: `${list.length || PAGE_SIZE}` })
    }
  })

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
    listExtraQueryRef.current = {
      ...listExtraQueryRef.current,
      name: value,
    }
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

  const handleConfirm = (value: FilterValueType) => {
    if (loading) {
      return
    }
    listFilterQueryRef.current = value as ListFilterQueryType
    pageRef.current = 1
    handleVisibleFilterModal(false)

    // 联动Tabs的当前选项
    if ('innerStatus' in listFilterQueryRef.current) {
      const index = tabs.findIndex((item) => item.key === listFilterQueryRef.current.innerStatus)
      if (index !== -1 || index !== activeIndex) {
        setActiveIndex(index)
      }
    }

    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const handleTabsChange = (index: number) => {
    setActiveIndex(index)
    listFilterQueryRef.current = {
      ...listFilterQueryRef.current,
      innerStatus: tabs[index].key,
    }
    pageRef.current = 1
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const handleJumpRecords = (record: MemberItemType) => {
    Router.navigateTo('supplierAbility/supplierManagement/supplierActions', {
      validateId: record.validateId,
      showBlacklist: record.showBlacklist,
      showEliminate: record.showEliminate,
      showFreeze: record.showFreeze,
      showUnfreeze: record.showUnfreeze,
    })
  }

  return (
    <PageLayout>
      <View className="supplier-management">
        <CustomFilterModal
          renderHeaderComponent={
            <View id="topbar">
              <NavBar title="供应商查询" />
              <View className="nav-extra">
                <View className="nav-extra-search">
                  <Search placeholder="供应商名称" onSearch={(value) => handleSearch(value)} clearable />
                </View>
                <View className="nav-extra-filter" onClick={() => handleVisibleFilterModal(!filterVisible)}>
                  <Icons name="Filter" size={20} color="#252D37" />
                </View>
              </View>
            </View>
          }
          visible={filterVisible}
          onClose={() => handleVisibleFilterModal(false)}
          groups={filterOptions}
          onConfirm={handleConfirm}
        />
        {/* 套个 View，因为 Tabs的 height是 100% */}
        <View>
          <Tabs current={activeIndex} onClick={handleTabsChange} tabList={tabs} scroll />
        </View>
        <View className="supplier-management-scroll">
          <ScrollView
            onScrollToLower={handleLoadMore}
            refresherTriggered={refreshing}
            onRefresherRefresh={() => refreshList()}
            className="supplier-management-scrollView"
            refresherEnabled
            scrollY
          >
            <View className="supplier-management-list">
              {list.map((item) => (
                <View key={item.validateId} className="supplier-management-list-item">
                  <MemberCounter
                    data={{
                      name: item.name,
                      statusName: item.innerStatusName,
                    }}
                    descriptions={[
                      {
                        label: '供应商角色',
                        value: item.roleName,
                      },
                      {
                        label: '供应商类型',
                        value: item.memberTypeName,
                      },
                      {
                        label: '供应商状态',
                        value: item.statusName,
                      },
                      {
                        label: '申请时间',
                        value: item.registerTime ? item.registerTime.split(' ')[0] : '',
                      },
                      {
                        label: '入库时间',
                        value: item.depositTime ? item.depositTime.split(' ')[0] : '',
                      },
                    ]}
                    onPress={() => handleJumpRecords(item)}
                    customRenderFootRight={
                      <Space>
                        {item.showBlacklist ? <Button size="small">拉入黑名单</Button> : null}
                        {item.showEliminate ? <Button size="small">解除关系</Button> : null}
                        {item.showFreeze ? <Button size="small">冻结</Button> : null}
                        {item.showUnfreeze ? <Button size="small">解冻</Button> : null}
                      </Space>
                    }
                  />
                </View>
              ))}
            </View>
            <Loading loading={loading && !refreshing} noMore={!hasMore} empty={!list.length} />
          </ScrollView>
        </View>
      </View>
    </PageLayout>
  )
}

export default SupplierManagementIndex
