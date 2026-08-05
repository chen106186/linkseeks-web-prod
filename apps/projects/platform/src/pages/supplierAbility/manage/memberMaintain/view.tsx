import React, { useRef } from 'react'
import { Link, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Button, Badge, Cascader } from 'antd'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useCustomerCategoriesBusinessEffects } from '@/formSchema/effects/useCustomerCategoriesBusinessEffects'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  postMemberSupplierAbilityMaintenancePage,
  getMemberSupplierAbilityMaintenancePageitems,
  PostMemberSupplierAbilityMaintenancePageResponseDetail,
  getMemberSupplierAbilityMaintenanceRegisterDetailByAllowSelect,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import useRegisterFields from '@/hooks/useRegisterFields'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import MemberRegisterAreaField from '@/components/MemberRegisterAreaField'
import { createQuerySchema } from './schema'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import styles from './index.less'

const formActions = createFormActions()

type SearchFormValuesType = {
  name: string
  memberType: string
  roleId: number
  level: number
  source: number
  innerStatus: number
  outerStatus: number
  status: number
  startDate: string
  endDate: string
  memberConfigs: { [key: string]: any }
  code: string
  currencyType: number
  categoryId: [string]
}

const fetchData = async (params: any) => {
  const { startDate = null, endDate = null } = params
  const payload = { ...params }

  if (startDate) {
    payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
  }
  if (endDate) {
    payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
  }
  const res = await postMemberSupplierAbilityMaintenancePage(payload, { ctlType: 'none' })

  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberMaintain: React.FC<[]> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { pathname } = useLocation()
  const { registerFields, setRegisterFields } = useRegisterFields()

  const defaultColumns: ColumnType<PostMemberSupplierAbilityMaintenancePageResponseDetail>[] = [
    {
      title: `${intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierId',
      })}/${intl.formatMessage({
        id: 'supplier.management.maintain.query.supplierName',
      })}`,
      dataIndex: 'memberId',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <EyeAuthButton
            type={authUrl(pathname, 'detail') ? 'link' : 'button'}
            url={`/supplierAbility/manage/memberMaintain/detail?id=${record.memberId}&validateId=${record.validateId}`}
          >
            {record.name}
          </EyeAuthButton>
        </>
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'member.management.maintain.query.memberTypeName' }),
    //   dataIndex: 'memberTypeName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.management.maintain.query.roleName' }),
    //   dataIndex: 'roleName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.management.maintain.query.level' }),
    //   dataIndex: 'level',
    //   render: (_, record) => record.levelTag,
    // },
    {
      title: `${intl.formatMessage({
        id: 'member.management.maintain.query.sourceName',
      })}/${intl.formatMessage({
        id: 'member.management.maintain.query.registerTime',
      })}`,
      dataIndex: 'sourceName',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div className={styles.description}>{record.registerTime}</div>
        </>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.maintain.query.statusName',
      }),
      dataIndex: 'statusName',
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.outerStatusName',
      }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'member.management.maintain.query.innerStatusName',
      }),
      dataIndex: 'innerStatusName',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus] || '#606266'} text={text} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      render: (_, record) => (
        <>
          {record.showFreeze && (
            <AuthButton type="custom" code="freeze">
              <Link to={`/supplierAbility/manage/memberMaintain/freeze?validateId=${record.validateId}`}>
                <Button type="link">
                  {intl.formatMessage({
                    id: 'member.management.maintain.query.freeze',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
          {record.showUnfreeze && (
            <AuthButton type="custom" code="unfreeze">
              <Link to={`/supplierAbility/manage/memberMaintain/unfreeze?validateId=${record.validateId}`}>
                <Button type="link">
                  {intl.formatMessage({
                    id: 'member.management.maintain.query.unfreeze',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
          {record.showCorrect && (
            <AuthButton type="custom" code="correct">
              <Link
                to={`/supplierAbility/memberRectification/rectificationAdd/add?memberName=${record.name}&memberId=${record.memberId}&roleId=${record.roleId}`}
              >
                <Button type="link">
                  {intl.formatMessage({
                    id: 'member.management.maintain.query.correct',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
          {record.showEliminate && (
            <AuthButton type="custom" code="eliminate">
              <Link to={`/supplierAbility/manage/memberMaintain/eliminate?validateId=${record.validateId}`}>
                <Button type="link">
                  {intl.formatMessage({
                    id: 'member.management.maintain.query.eliminate',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
          {record.showBlacklist && (
            <AuthButton type="custom" code="black">
              <Link to={`/supplierAbility/manage/memberMaintain/black?validateId=${record.validateId}`}>
                <Button type="link">
                  {intl.formatMessage({
                    id: 'member.management.maintain.query.black',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns] = useSpliceArray<ColumnType<any>>(defaultColumns)

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberSupplierAbilityMaintenancePageitems()

    if (res.code === 1000) {
      const { data } = res
      const { innerStatus, outerStatus, status, memberTypes, roles, levels, sources, currencyType } = data || {}

      // 供应商能力，只会配置一个供应商角色
      // 所以供应商角色的列表，需要查看当前会员是不是只有一个角色，根据这个角色直接显示入库资料的筛选
      // 过滤掉 “所有” 选项
      const filteredRoles = roles?.filter((item) => item.roleId)
      if (filteredRoles && filteredRoles.length === 1) {
        const res = await getMemberSupplierAbilityMaintenanceRegisterDetailByAllowSelect({
          roleId: `${filteredRoles[0].roleId}`,
        })
        if (res.code === 1000) {
          setRegisterFields(res.data)
          // 设置会员角色id，不做展示，但是要提交
          formActions.setFieldValue('roleId', filteredRoles[0].roleId)
        }
      }

      return {
        memberType: memberTypes?.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
        roleId: roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
        level: levels?.map((item) => ({ label: item.levelTag, value: item.level })),
        source: sources?.map((item) => ({ label: item.text, value: item.id })),
        innerStatus: innerStatus?.map((item) => ({ label: item.text, value: item.id })),
        outerStatus: outerStatus?.map((item) => ({ label: item.text, value: item.id })),
        status: status?.map((item) => ({ label: item.text, value: item.id })),
        currencyType: currencyType?.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  const handleReloadList = (values: SearchFormValuesType) => {
    ref.current.reload(values)
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: 'validateId',
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchData(params)}
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
                useAsyncInitSelect(
                  ['memberType', 'roleId', 'level', 'source', 'innerStatus', 'outerStatus', 'status', 'currencyType'],
                  fetchSelectOptions,
                )

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

export default MemberMaintain
