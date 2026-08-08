import React, { useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Card, Space, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import StandardTable from '@/components/StandardTable'
import { formatTimeString } from '@/utils'
import { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { MEMBER_LEVEL_TYPE_PLATFORM } from '@/constants/member'
import { EyeAuthButton } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import StatusTag from '@/components/StatusTag'
import {
  getMemberSupplierAbilityInfoPage,
  getMemberSupplierAbilityInfoPageitems,
  GetMemberSupplierAbilityInfoPageResponseDetail,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { querySchema } from './schema'
import { MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import AddRoleDrawer from './components/AddRoleDrawer'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'

const formActions = createFormActions()

const fetchData = async (params: any) => {
  const { startDate = null, endDate = null } = params
  const payload = { ...params }

  if (startDate) {
    payload.startDate = formatTimeString(+startDate, 'YYYY-MM-DD')
  }
  if (endDate) {
    payload.endDate = formatTimeString(+endDate, 'YYYY-MM-DD')
  }
  let res = await getMemberSupplierAbilityInfoPage(payload)
  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberQuery: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const [modalVisible, setModalVisible] = useState(false)
  const { pathname } = useLocation()
  const intl = useIntl()

  // 跳转变更会员入库信息
  const handleJumpChangeDeposit = (record) => {
    history.push(`/supplierAbility/profile/memberQuery/change?validateId=${record.validateId}`)
  }

  // 跳转修改会员入库信息
  const handleJumpModifyDeposit = (record) => {
    history.push(`/supplierAbility/profile/memberQuery/deposit?validateId=${record.validateId}`)
  }

  // 跳转修改注册信息页面
  const handleJumpUpdate = (record) => {
    history.push(`/supplierAbility/profile/memberQuery/updateMember?validateId=${record.validateId}`)
  }

  const defaultColumns: ColumnType<GetMemberSupplierAbilityInfoPageResponseDetail>[] = [
    {
      title: intl.formatMessage({
        id: 'supplier.supplierQuery.query.defaultColumns.name',
      }),
      dataIndex: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/supplierAbility/profile/memberQuery/detail?validateId=${record.validateId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    // {
    //   title: intl.formatMessage({ id: 'member.memberQuery.query.defaultColumns.memberTypeName' }),
    //   dataIndex: 'memberTypeName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.memberQuery.query.defaultColumns.roleName' }),
    //   dataIndex: 'roleName',
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.memberQuery.query.defaultColumns.level' }),
    //   dataIndex: 'level',
    //   render: (_, record) => record.levelTag,
    // },
    // {
    //   title: intl.formatMessage({ id: 'member.memberQuery.query.defaultColumns.levelTypeName' }),
    //   dataIndex: 'levelTypeName',
    // },
    {
      title: intl.formatMessage({
        id: 'member.memberQuery.query.defaultColumns.registerTime',
      }),
      dataIndex: 'registerTime',
    },
    {
      title: intl.formatMessage({
        id: 'member.memberQuery.query.defaultColumns.depositTime',
      }),
      dataIndex: 'depositTime',
    },
    {
      title: intl.formatMessage({
        id: 'supplier.management.common.columns.statusName',
      }),
      dataIndex: 'statusName',
    },
    {
      title: intl.formatMessage({
        id: 'member.memberQuery.query.defaultColumns.outerStatusName',
      }),
      dataIndex: 'outerStatusName',
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      render: (_, record) => (
        <>
          {/* 渠道会员， 且外部审核状态为不通过才可以 变更信息 */}
          {record.showModify && (
            <AuthButton type="custom" code="change">
              <Button type="link" onClick={() => handleJumpChangeDeposit(record)}>
                {intl.formatMessage({ id: 'member.memberQuery.query.change' })}
              </Button>
            </AuthButton>
          )}

          {/* 上级是平台会员，且外部审核状态为不通过才可以 修改注册资料 */}
          {record.levelTypeEnum === MEMBER_LEVEL_TYPE_PLATFORM && record.showUpdate && (
            <AuthButton type="custom" code="updateMember">
              <Button type="link" onClick={() => handleJumpUpdate(record)}>
                {intl.formatMessage({ id: 'member.memberQuery.query.edit' })}
              </Button>
            </AuthButton>
          )}

          {/* 上级是非平台会员，且外部审核状态为不通过才可以 修改入库资料 */}
          {record.levelTypeEnum !== MEMBER_LEVEL_TYPE_PLATFORM && record.showUpdate && (
            <AuthButton type="custom" code="deposit">
              <Button type="link" onClick={() => handleJumpModifyDeposit(record)}>
                {intl.formatMessage({ id: 'member.memberQuery.query.edit' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const [columns] = useSpliceArray<ColumnType<any>>(defaultColumns)

  // 初始化高级筛选选项
  const fetchSelectOptions = async () => {
    const res = await getMemberSupplierAbilityInfoPageitems()

    if (res.code === 1000) {
      const { data = {} }: any = res
      const { outerStatus = [] } = data

      return {
        outerStatus: outerStatus.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  const handleSubmit = (values) => {
    history.push(`/supplierAbility/profile/memberQuery/add`, {
      query: {
        ...values,
      },
    })
  }

  const ControllerBtns = () => (
    // <></>
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          <PlusOutlined />
          {intl.formatMessage({ id: 'member.memberQuery.query.add' })}
        </Button>
      </AddAuthButton>
    </Space>
  )

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
                ControllerBtns,
              }}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
                useAsyncInitSelect(['outerStatus'], fetchSelectOptions)
              }}
              schema={querySchema}
            />
          }
        />

        <AddRoleDrawer visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleSubmit} />
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberQuery
