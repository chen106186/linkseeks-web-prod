/*
 * @Description: 供应商变更审核
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { ScrollView, BaseEventOrig } from '@tarojs/components'
import { Icons, View, Button, Tabs } from '@apps/mobile-ui'
import { TabItem } from '@apps/mobile-ui/packages/types/tabs'
import { useDidShow, useRouter } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { checkMore } from '@/utils'
import {
  MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE,
  MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO,
  MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY,
  MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED,
  MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED,
} from '@/constants/const/member'
import {
  getMemberMobileModityGradePage,
  getMemberMobileModityPageConditions,
  GetMemberMobileModityGradeOnePageResponseDetail,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import Loading from '@/components/Loading'
import Search from '@/components/Search'
import CustomFilterModal, { FilterGroupType, FilterValueType } from '@/components/FilterModal/CustomFilterModal'
import Space from '@/components/Space'
import PageLayout from '@/components/PageLayout'
import { getModifiesRefreshStorage } from '../../../common/utils/pageStockRefreshUtil'
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
}

type ListFilterQueryType = {
  memberTypeId: number
  roleId: number
  innerStatus?: number
}

type MemberItemType = GetMemberMobileModityGradeOnePageResponseDetail & {}

type SupplierModifiesIndexRouteParams = {
  /**
   * 内部状态
   */
  innerStatus?: string
}

const SupplierModifiesIndex: React.FC = () => {
  const router = useRouter<SupplierModifiesIndexRouteParams>()
  const {
    params: { innerStatus: defaultInnerStatus },
  } = router

  const [list, setList] = useState<MemberItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [filterOptions, setFilterOptions] = useState<FilterGroupType[]>([])
  const [tabs, setTabs] = useState<TabItemType[]>([])

  const pageRef = useRef<number>(1)
  const listExtraQueryRef = useRef<ListQueryType>({
    name: '',
  })
  const listFilterQueryRef = useRef<ListFilterQueryType>({
    memberTypeId: 0,
    roleId: 0,
    innerStatus: defaultInnerStatus ? +defaultInnerStatus : undefined,
  })
  // 防止在h5环境下，进入详情页之后刷新了页面，导致进行操作之后返回列表页面
  // 请求两次列表页的问题
  const listInited = useRef(false)

  const detailsUrlMap: Record<number, string> = useMemo(
    () => ({
      [MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE]:
        'supplierAbility/supplierModifies/supplierModifyGradeOne/supplierModifyDetails',
      [MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO]:
        'supplierAbility/supplierModifies/supplierModifyGradeTwo/supplierModifyDetails',
      [MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyDetails',
      [MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyDetails',
      [MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyDetails',
    }),
    [],
  )

  const verifyUrlMap: Record<number, string> = useMemo(
    () => ({
      [MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE]:
        'supplierAbility/supplierModifies/supplierModifyGradeOne/supplierModifyGradeOneVerify',
      [MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO]:
        'supplierAbility/supplierModifies/supplierModifyGradeTwo/supplierModifyGradeTwoVerify',
      [MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyConfirmVerify',
      [MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyConfirmVerify',
      [MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED]:
        'supplierAbility/supplierModifies/supplierModifyConfirm/supplierModifyConfirmVerify',
    }),
    [],
  )

  const getList = (extraParams?: ListParams): Promise<MemberItemType[]> => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      const mergedQuery = { ...listFilterQueryRef.current }
      if (!mergedQuery.innerStatus) {
        delete mergedQuery.innerStatus
      }
      getMemberMobileModityGradePage({
        ...(listExtraQueryRef.current as any),
        ...(mergedQuery as any),
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
    getMemberMobileModityPageConditions().then((res) => {
      if (res.code === 1000) {
        const { memberTypes, roles, innerStatus } = res.data
        let mergedInnerStatus = innerStatus || []
        mergedInnerStatus = [
          {
            code: 0,
            msg: '全部',
          },
          ...mergedInnerStatus,
        ]
        const mergedTabs = mergedInnerStatus.map((item) => ({ title: item.msg, key: item.code }))
        setTabs(mergedTabs)
        if (defaultInnerStatus) {
          const defaultIndex = mergedTabs.findIndex((item) => item.key === +defaultInnerStatus)
          if (defaultIndex !== -1) {
            setActiveIndex(defaultIndex)
          }
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
            title: '内部状态',
            fieldName: 'innerStatus',
            fieldType: 'custom',
            options: mergedInnerStatus.map((item) => ({ name: item.msg, value: item.code })),
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
    const listRefresh = getModifiesRefreshStorage()
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
    getList({})
      .then((res) => {
        setList(res)
      })
      .catch(() => {})
  }

  const handleJumpVerify = (e: BaseEventOrig<any>, record: MemberItemType) => {
    e.stopPropagation()
    const url: any = verifyUrlMap[record.innerStatus]
    if (!url) {
      return
    }
    Router.navigateTo(url, {
      validateId: record.validateId,
    })
  }

  const handleJumpRecords = (record: MemberItemType) => {
    const url: any = detailsUrlMap[record.innerStatus]
    if (!url) {
      return
    }
    Router.navigateTo(url, {
      validateId: record.validateId,
    })
  }

  return (
    <PageLayout>
      <View className="supplier-modifies">
        <CustomFilterModal
          renderHeaderComponent={
            <View id="topbar">
              <NavBar title="供应商变更审核" />
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
        <View className="supplier-modifies-scroll">
          <ScrollView
            onScrollToLower={handleLoadMore}
            refresherTriggered={refreshing}
            onRefresherRefresh={() => refreshList()}
            className="supplier-modifies-scrollView"
            refresherEnabled
            scrollY
          >
            <View className="supplier-modifies-list">
              {list.map((item) => (
                <View key={item.validateId} className="supplier-modifies-list-item">
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
                    ]}
                    onPress={() => handleJumpRecords(item)}
                    customRenderFootRight={
                      <Space>
                        {item.innerStatus === MEMBER_INNER_STATUS_VERIFY_TO_MODIFY_GRADE_ONE ||
                        item.innerStatus === MEMBER_INNER_STATUS_TO_MODIFY_GRADE_TWO ||
                        item.innerStatus === MEMBER_INNER_STATUS_TO_COMFIRM_MODIFY ||
                        item.innerStatus === MEMBER_INNER_STATUS_MODIFY_GRADE_ONE_NOT_PASSED ||
                        item.innerStatus === MEMBER_INNER_STATUS_MODIFY_GRADE_TWO_NOT_PASSED ? (
                          <Button type="secondary" size="small" onClick={(e) => handleJumpVerify(e, item)}>
                            审核
                          </Button>
                        ) : null}
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

export default SupplierModifiesIndex
