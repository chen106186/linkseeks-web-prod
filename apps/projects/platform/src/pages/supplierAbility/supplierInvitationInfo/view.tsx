/**
 * @Description 我收到的邀请信息 - 列表
 */
import { Button, Card } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import PolymericTable, { FetchParamsType } from '@/components/PolymericTable'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import searchSchema from './searchSchema'
import { getMemberSupplierInvitationReceivePage } from '@apps/apis'

const searchFormAction = createFormActions()

type InvitationInfoListItem = FetchParamsType & {
  memberName: string
  invitationTime: string
  subMemberName: string
  registerAccount: string
  email: string
  registerTime: string
  invitationCode: string
  fillInDepositoryDetail: boolean
}

const InvitationInfo: React.FC<{}> = () => {
  const intl = useIntl()

  const tableColumns: ColumnsType = [
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.customerName', defaultMessage: '邀请方客户名称' }),
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.invitationTime', defaultMessage: '邀请时间' }),
      dataIndex: 'invitationTime',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.supplierName', defaultMessage: '被邀请方供应商名称' }),
      dataIndex: 'subMemberName',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.registeredAccount', defaultMessage: '注册账号' }),
      dataIndex: 'registerAccount',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.registeredMail', defaultMessage: '注册邮箱' }),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.registrationTime', defaultMessage: '注册时间' }),
      dataIndex: 'registerTime',
    },
    {
      title: intl.formatMessage({ id: 'supplier/invitationInfo.inviteCode', defaultMessage: '邀请码' }),
      dataIndex: 'invitationCode',
    },
    {
      title: intl.formatMessage({ id: 'common.table.action', defaultMessage: '操作' }),
      dataIndex: 'actions',
      align: 'center',
      render: (_, row: InvitationInfoListItem) => (
        <>
          {!row.fillInDepositoryDetail ? null : (
            <AuthButton type="custom" code="apply">
              <Link
                to={`/supplierAbility/supplierInvitationInfo/inventoryData/apply?upperMemberId=${row.upperMemberId}&upperRoleId=${row.upperRoleId}`}
              >
                <Button type="link">
                  {intl.formatMessage({
                    id: 'supplier/invitationInfo.incomingData',
                    defaultMessage: '填写申请入库资料',
                  })}
                </Button>
              </Link>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const getInvitationInfoList = async (params: InvitationInfoListItem) => {
    try {
      const res = await getMemberSupplierInvitationReceivePage({
        ...params,
        memberName: params.memberName,
        startDate: params.startDate ? formatTimeString(+params.startDate, 'YYYY-MM-DD') : null,
        endDate: params.endDate ? formatTimeString(+params.endDate, 'YYYY-MM-DD') : null,
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
      })
      if (res.code === 1000) {
        return res.data
      }
    } catch (err) {
      return { data: [], totalCount: 0 }
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <PolymericTable
          rowKey="id"
          columns={tableColumns}
          fetchDataSource={(params) => getInvitationInfoList(params as InvitationInfoListItem)}
          searchFormProps={{
            actions: searchFormAction,
            schema: searchSchema,
            effects: ($, actions) => {
              useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
            },
          }}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default InvitationInfo
