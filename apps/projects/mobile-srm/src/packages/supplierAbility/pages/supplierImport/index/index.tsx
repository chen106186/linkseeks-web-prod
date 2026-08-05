/*
 * @Description: 供应商录入
 */
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, BaseEventOrig } from '@tarojs/components'
import { Icons, View, Button, Tabs } from '@apps/mobile-ui'
import { TabItem } from '@apps/mobile-ui/packages/types/tabs'
import { useDidShow, showToast, pxTransform, showModal, showLoading } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import {
  getMemberMobileImportPage,
  getMemberMobileImportPageitems,
  postMemberMobileImportCommit,
  postMemberMobileImportDelete,
  GetMemberMobileImportPageResponseDetail,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import Search from '@/components/Search'
import CustomFilterModal, { FilterGroupType, FilterValueType } from '@/components/FilterModal/CustomFilterModal'
import Space from '@/components/Space'
import PageLayout from '@/components/PageLayout'
import { supplierImportIndexKey } from '../const'
import { getListRefreshStorage } from '../../../common/utils/pageStockRefreshUtil'
import MemberCounter from '../../../components/MemberCounter'
import SpaceshipWrap from '../../../components/SpaceshipWrap'
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
  status: number
  level: number
}

type ListFilterQueryType = {
  memberTypeId: number
  roleId: number
  outerStatus: number
}

type MemberItemType = GetMemberMobileImportPageResponseDetail & {}

const SupplierImportIndex: React.FC = () => {
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
    status: 0,
    level: 0,
  })
  const listFilterQueryRef = useRef<ListFilterQueryType>({
    memberTypeId: 0,
    roleId: 0,
    outerStatus: 0,
  })
  // 防止在h5环境下，进入详情页之后刷新了页面，导致进行操作之后返回列表页面
  // 请求两次列表页的问题
  const listInited = useRef(false)

  const getList = (extraParams?: ListParams): Promise<MemberItemType[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      getMemberMobileImportPage({
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
    getMemberMobileImportPageitems().then((res) => {
      if (res.code === 1000) {
        const { memberTypes, memberRoles, outerStatus } = res.data
        if (outerStatus) {
          setTabs(outerStatus.map((item) => ({ title: item.text, key: item.id })))
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
            options: (memberRoles || []).map((item) => ({ name: item.roleName, value: item.roleId })),
          },
          {
            title: '外部状态',
            fieldName: 'outerStatus',
            fieldType: 'custom',
            options: (outerStatus || []).map((item) => ({ name: item.text, value: item.id })),
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
    const listRefresh = getListRefreshStorage()
    if (listInited.current && listRefresh && listRefresh.listKey === supplierImportIndexKey && listRefresh.refresh) {
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
    if ('outerStatus' in listFilterQueryRef.current) {
      const index = tabs.findIndex((item) => item.key === listFilterQueryRef.current.outerStatus)
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
      outerStatus: tabs[index].key,
    }
    pageRef.current = 1
    setList([])
    getList()
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const handleDelete = (e: BaseEventOrig<any>, record: MemberItemType) => {
    e.stopPropagation()
    showModal({
      title: '',
      confirmText: '确认',
      cancelText: '取消',
      content: '确定要删除吗？',
      success: (result: Taro.showModal.SuccessCallbackResult) => {
        if (result.confirm) {
          return new Promise<void>((resolve) => {
            postMemberMobileImportDelete({
              memberId: record.memberId,
              validateId: record.validateId,
            })
              .then((res) => {
                if (res.code === 1000) {
                  refreshList({ pageSize: `${list.length}` })
                  resolve()
                } else {
                  resolve()
                }
              })
              .catch(() => {
                resolve()
              })
          })
        }
      },
    })
  }

  const handleCommit = (e: BaseEventOrig<any>, record: MemberItemType) => {
    e.stopPropagation()
    showLoading({ title: '正在提交...' })
    postMemberMobileImportCommit({
      memberId: record.memberId,
      validateId: record.validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({ title: '提交成功', icon: 'none' })
          refreshList({ pageSize: `${list.length}` })
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  const handleJumpModify = (e: BaseEventOrig<any>, record: MemberItemType) => {
    e.stopPropagation()
    Router.navigateTo('supplierAbility/supplierImport/supplierModify', {
      memberId: record.memberId,
      validateId: record.validateId,
    })
  }

  const handleJumpAdd = () => {
    Router.navigateTo('supplierAbility/supplierImport/supplierAdd')
  }

  const handleJumpRecords = (record: MemberItemType) => {
    Router.navigateTo('supplierAbility/supplierImport/supplierDetails', {
      memberId: record.memberId,
      validateId: record.validateId,
      showDelete: record.showDelete,
      showUpdate: record.showUpdate,
      showCommit: record.showCommit,
    })
  }

  return (
    <PageLayout>
      <View className="supplier-import">
        <CustomFilterModal
          renderHeaderComponent={
            <View id="topbar">
              <NavBar title="供应商录入" />
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
        <View className="supplier-import-scroll">
          <ScrollView
            onScrollToLower={handleLoadMore}
            refresherTriggered={refreshing}
            onRefresherRefresh={() => refreshList()}
            className="supplier-import-scrollView"
            refresherEnabled
            scrollY
          >
            <View className="supplier-import-list">
              {list.map((item) => (
                <View key={item.validateId} className="supplier-import-list-item">
                  <MemberCounter
                    data={{
                      name: item.name,
                      statusName: item.outerStatusName,
                    }}
                    descriptions={[
                      {
                        label: '供应商ID',
                        value: item.memberId,
                      },
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
                        label: '注册来源',
                        value: item.sourceName,
                      },
                      {
                        label: '申请时间',
                        value: item.registerTime ? item.registerTime.split(' ')[0] : '',
                      },
                    ]}
                    onPress={() => handleJumpRecords(item)}
                    customRenderFootRight={
                      <Space>
                        {item.showDelete ? (
                          <Button size="small" onClick={(e) => handleDelete(e, item)}>
                            删除
                          </Button>
                        ) : null}
                        {item.showUpdate ? (
                          <Button size="small" onClick={(e) => handleJumpModify(e, item)}>
                            修改
                          </Button>
                        ) : null}
                        {item.showCommit ? (
                          <Button size="small" type="primary" onClick={(e) => handleCommit(e, item)}>
                            提交审核
                          </Button>
                        ) : null}
                      </Space>
                    }
                  />
                </View>
              ))}
            </View>
            <Loading loading={loading && !refreshing} noMore={!hasMore} empty={!list.length} />
            {/* 占位 */}
            <View style={{ paddingBottom: pxTransform(100) }} />
          </ScrollView>
        </View>
        <SpaceshipWrap>
          <Button type="primary" onClick={handleJumpAdd}>
            <Icons size={16} name="Plus" color="#FFFFFF" className="supplier-import-add-icon" />
            新增供应商
          </Button>
        </SpaceshipWrap>
      </View>
    </PageLayout>
  )
}

export default SupplierImportIndex
