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
  getMemberCustomerAbilityInfoPage,
  getMemberCustomerAbilityInfoPageitems,
  GetMemberCustomerAbilityInfoPageResponseDetail,
} from '@apps/apis'
import useSpliceArray from '@/hooks/useSpliceArray'
import { querySchema } from './schema'
import { MEMBER_OUTER_STATUS_TYPE } from '../constant'
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
  const res = await getMemberCustomerAbilityInfoPage(payload)
  if (res.code === 1000) {
    return res.data
  }
  return { data: [], totalCount: 0 }
}

const MemberQuery: React.FC<{}> = () => {
  const { pathname } = useLocation()
  const [modalVisible, setModalVisible] = useState(false)
  const ref = useRef<any>({})

  const intl = useIntl()

  // 变更会员入库信息
  const handleJumpChangeDeposit = (record) => {
    history.push(`/customerAbility/customerEnterpriseBasicInfo/inventoryData/change?validateId=${record.validateId}`)
  }

  // 修改注册信息页面
  const handleJumpUpdate = (record) => {
    history.push(`/customerAbility/customerEnterpriseBasicInfo/updateRegistrationInfo?validateId=${record.validateId}`)
  }

  // 修改会员入库信息
  // const handleJumpModifyDeposit = record => {
  //   history.push(`/customerAbility/profile/query/modifyDeposit?validateId=${record.validateId}`);
  // };

  const defaultColumns: ColumnType<GetMemberCustomerAbilityInfoPageResponseDetail>[] = [
    {
      title: intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.ID', defaultMessage: '客户ID' }),
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.belonging.customer',
        defaultMessage: '归属供应商名称',
      }),
      dataIndex: 'name',
      render: (text, record) => (
        <EyeAuthButton
          type={authUrl(pathname, 'detail') ? 'link' : 'button'}
          url={`/customerAbility/customerEnterpriseBasicInfo/detail?validateId=${record.validateId}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.memberRole', defaultMessage: '会员角色' }),
      dataIndex: 'subRoleName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.applicationTime',
        defaultMessage: '注册时间',
      }),
      dataIndex: 'registerTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.warehousingTime',
        defaultMessage: '申请时间',
      }),
      dataIndex: 'depositTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.customerAbilityCode',
        defaultMessage: '客户编码',
      }),
      dataIndex: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.lifeCycleStage',
        defaultMessage: '生命周期阶段',
      }),
      dataIndex: 'lifecycleStagesName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.enterpriseBasicInfo.approvalStatus',
        defaultMessage: '审核状态',
      }),
      dataIndex: 'outerStatusName',
      filterMultiple: false,
      render: (text, record) => <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus]} title={text} />,
    },
    {
      title: intl.formatMessage({ id: 'common.table.action', defaultMessage: '操作' }),
      dataIndex: 'option',
      render: (_, record) => (
        <>
          {/* 渠道会员， 且外部审核状态为不通过才可以 变更信息 */}
          {record.showModify && (
            <AuthButton type="custom" code="inventoryData/change">
              <Button type="link" onClick={() => handleJumpChangeDeposit(record)}>
                {intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.change', defaultMessage: '变更' })}
              </Button>
            </AuthButton>
          )}

          {/* 上级是平台会员，且外部审核状态为不通过才可以 修改注册资料 */}
          {record.levelTypeEnum === MEMBER_LEVEL_TYPE_PLATFORM && record.showUpdate && (
            <AuthButton type="custom" code="updateRegistrationInfo">
              <Button type="link" onClick={() => handleJumpUpdate(record)}>
                {intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.edit', defaultMessage: '修改' })}
              </Button>
            </AuthButton>
          )}
          {/* 上级是非平台会员，且外部审核状态为不通过才可以 修改入库资料 */}
          {record.levelTypeEnum !== MEMBER_LEVEL_TYPE_PLATFORM && record.showUpdate && (
            <AuthButton type="custom" code="inventoryData/change">
              <Button type="link" onClick={() => handleJumpChangeDeposit(record)}>
                {intl.formatMessage({ id: 'customerAbility.enterpriseBasicInfo.edit' })}
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
    const res = await getMemberCustomerAbilityInfoPageitems()

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
    history.push(`/customerAbility/customerEnterpriseBasicInfo/add`, {
      query: {
        ...values,
      },
    })
  }

  const ControllerBtns = () => (
    <Space>
      <AddAuthButton>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          <PlusOutlined />
          {intl.formatMessage({
            id: 'customerAbility.enterpriseBasicInfo.addMemberRole',
            defaultMessage: '增加会员角色',
          })}
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
