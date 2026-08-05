/*
 * @Description: 客户档案管理
 */
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Cascader, TabPaneProps, Badge } from 'antd'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  PostMemberCustomerAbilityMaintenancePageResponseDetail,
  getMemberCustomerAbilityMaintenanceRegisterDetailByAllowSelect,
  getMemberCustomerAbilityMaintenanceStatisticLifecycleCount,
  postMemberCustomerLifecycleArchivesManagementPage,
  getMemberCustomerLifecyclePageItems,
} from '@apps/apis'
import useRegisterFields from '@/hooks/useRegisterFields'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import { createQuerySchema } from './querySchema'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const formActions = createFormActions()

const ALL_LIFE_CICLE_KEY = 0

type SearchFormValuesType = {
  name: string
  memberType: number
  roleId: number
  level: number
  source: number
  innerStatus: number
  outerStatus: number
  status: number
  startDate: string
  endDate: string
  memberConfigs: Record<string, any>
  code: string
  currencyType: number
  categoryId: number[]
}

const CustomerArchivesManagementIndex: React.FC<{}> = (props) => {
  const { pathname } = useLocation()

  const [lifeCycle, setLifeCycle] = useState<TabPaneProps[]>([])

  const ref = useRef<any>({})
  const lifeCycleIdRef = useRef(ALL_LIFE_CICLE_KEY)

  const { registerFields, setRegisterFields } = useRegisterFields()

  const intl = useIntl()
  const translate = getWebIntl()

  const defaultColumns: ColumnType<PostMemberCustomerAbilityMaintenancePageResponseDetail>[] = [
    {
      title: 'ID',
      dataIndex: 'memberId',
    },
    {
      title: translate('web.resource.member.memberName'),
      dataIndex: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`${pathname}/detail?id=${record.memberId}&validateId=${record.validateId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: translate('web.resource.member.memberRole'),
      dataIndex: 'roleName',
    },
    {
      title: translate('web.resource.member.shenqingzhuceshijian'),
      dataIndex: 'registerTime',
    },
    {
      title: translate('web.resource.member.rukushijian'),
      dataIndex: 'depositTime',
    },
    {
      title: translate('web.resource.member.kehubianma'),
      dataIndex: 'memberCode',
    },
    {
      title: translate('web.resource.member.shengmingzhouqijieduan'),
      dataIndex: 'lifeCycleStageName',
      render: (text) => (text ? <StatusTag type="default" title={text} /> : null),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action', defaultMessage: '操作' }),
      dataIndex: 'actions',
      render: (_, record) => (
        <>
          <AuthButton type="custom" code="modifies">
            <Link
              to={`/customerAbility/customerLifecycle/customerModifiesCommit/add?subMemberId=${record.memberId}&subRoleId=${record.roleId}&subMemberName=${record.name}&lifeCycleStageName=${record.lifeCycleStageName}&lifeCycleStageId=${record.lifeCycleStageId}`}
            >
              <Button type="link">{translate('web.resource.member.shengmingzhouqijieduanbiangeng')}</Button>
            </Link>
          </AuthButton>
          <AuthButton type="custom" code="modifiesQuery">
            <Link to={`/customerAbility/customerLifecycle/customerModifiesQuery?name=${record.name}`}>
              <Button type="link">{translate('web.resource.member.biangengshenqingdanchaxun')}</Button>
            </Link>
          </AuthButton>
        </>
      ),
    },
  ]

  const fetchList = async (params: SearchFormValuesType) => {
    const { startDate = null, endDate = null } = params
    const payload = {
      ...params,
      lifeCycleStageId: lifeCycleIdRef.current,
    }
    if (startDate) {
      payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
    }
    if (endDate) {
      payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
    }
    // 生命周期id为 0 及为全部时，删除 lifeCycleStageId
    if (payload.lifeCycleStageId === 0) {
      delete payload.lifeCycleStageId
    }
    try {
      const res = await postMemberCustomerLifecycleArchivesManagementPage(payload, { ctlType: 'none' })
      if (res.code === 1000) {
        return res.data
      }
      return { data: [], totalCount: 0 }
    } catch (error) {
      return { data: [], totalCount: 0 }
    }
  }

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberCustomerLifecyclePageItems()

    if (res.code === 1000) {
      const { data } = res
      const { innerStatus, outerStatus, roles, currencyType } = data || {}

      // 客户能力，只会配置一个客户角色
      // 所以客户角色的列表，需要查看当前会员是不是只有一个角色，根据这个角色直接显示入库资料的筛选
      // 过滤掉 “所有” 选项
      const filteredRoles = roles?.filter((item) => item.roleId)
      if (filteredRoles && filteredRoles.length === 1) {
        const res = await getMemberCustomerAbilityMaintenanceRegisterDetailByAllowSelect({
          roleId: `${filteredRoles[0].roleId}`,
        })
        if (res.code === 1000) {
          setRegisterFields(res.data)
          // 设置会员角色id，不做展示，但是要提交
          formActions.setFieldValue('roleId', filteredRoles[0].roleId)
        }
      }

      return {
        roleId: roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
        innerStatus: innerStatus?.map((item) => ({ label: item.text, value: item.id })),
        outerStatus: outerStatus?.map((item) => ({ label: item.text, value: item.id })),
        currencyType: currencyType?.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  // 获取生命周期标签
  const fetchLifeCycleTabs = async () => {
    try {
      const { data, code } = await getMemberCustomerAbilityMaintenanceStatisticLifecycleCount({}, { ctlType: 'none' })
      if (code === 1000) {
        const tabs: TabPaneProps[] = data?.map((item) => ({
          tab: (
            <Badge offset={[12, 0]} count={item.count} className="tags-pane-badge">
              {item.lifecycleStagesName}
            </Badge>
          ),
          key: item.lifecycleStageId,
          count: item.count,
        }))
        tabs.unshift({
          tab: translate('web.common.all'),
          key: ALL_LIFE_CICLE_KEY,
          count: 0,
        } as unknown as TabPaneProps)
        setLifeCycle(tabs)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchLifeCycleTabs()
  }, [])

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  const handleTabsChange = (activeKey: string) => {
    // todo: 调用Table reload方法刷新数据
    lifeCycleIdRef.current = +activeKey
    ref.current.reload()
  }

  return (
    <PageHeaderWrapper
      tabList={lifeCycle}
      onTabChange={handleTabsChange}
      tabProps={{
        type: 'card',
        tabBarGutter: 0,
      }}
      className={styles['supplier-archives-management-header']}
    >
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
          }}
          columns={defaultColumns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchList(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{
                MemberRegisterAreaField,
                Cascader,
              }}
              onSubmit={handleReloadList}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(['roleId', 'innerStatus', 'outerStatus', 'currencyType'], fetchSelectOptions)

                // 初始化品类数据
                useCustomerCategoriesBusinessEffects($, actions, {
                  fieldName: 'categoryId',
                })
              }}
              schema={createQuerySchema(registerFields)}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CustomerArchivesManagementIndex
