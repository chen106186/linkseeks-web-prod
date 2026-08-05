import React, { useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSchema } from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { accountStatusMap, memberStatusMap, memberLevelTypeMap, accountMemberType } from '../../constant'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import { getPayAssetAccountGetAssetAccountList } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { getEnableMultiTenancy } from '@/utils/auth'

const formActions = createFormActions()

const AccountLists: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.parentMemberName' }),
      dataIndex: 'parentMemberName',
      key: 'parentMemberName',
      className: 'commonPickColor',
      render: (text, record) => (
        <DetailAuthButton>
          <EyeAuthButton url={`/payandSettle/capitalAccounts/accountLists/detail?id=${record.id}`}>
            {text}
          </EyeAuthButton>
        </DetailAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.memberType' }),
      dataIndex: 'memberType',
      key: 'memberType',
      render: (t, r) => accountMemberType[t],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    // {
    //   title: '所属会员等级',
    //   dataIndex: 'memberLevel',
    //   key: 'memberLevel',
    //   render: (t, r) => <LevelBrand level={r.memberLevel} />
    // },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.memberLevelType' }),
      dataIndex: 'memberLevelType',
      key: 'memberLevelType',
      render: (t, r) => memberLevelTypeMap[t],
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.memberStatus' }),
      dataIndex: 'memberStatus',
      key: 'memberStatus',
      render: (t, r) => <StatusTag title={memberStatusMap[t]['title']} type={memberStatusMap[t]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.accountStatus' }),
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      render: (t, r) => (
        <>
          <span className={accountStatusMap[t]['className']}></span>
          {accountStatusMap[t]['title']}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.accountBalance' }),
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      render: (text) =>
        `${intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.currency' })}${text.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.lockBalance' }),
      dataIndex: 'lockBalance',
      key: 'lockBalance',
      render: (text) =>
        `${intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.currency' })}${text.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.usableBalance' }),
      dataIndex: 'usableBalance',
      key: 'usableBalance',
      render: (t, r) =>
        `${intl.formatMessage({ id: 'payandSettle.capitalAccounts.accountLists.columns.currency' })}${(
          (r.accountBalance * 100 - r.lockBalance * 100) /
          100
        ).toFixed(2)}`,
    },
  ]

  const fetchData = (params: any) => {
    console.log(params)
    return new Promise((resolve, reject) => {
      const enableMultiTenancy = getEnableMultiTenancy()
      let obj = { ...params, enableMultiTenancy }
      getPayAssetAccountGetAssetAccountList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
          controlRender={
            <NiceForm
              components={{
                DateRangePickerUnix,
              }}
              actions={formActions}
              onSubmit={(values) => ref.current.reload(values)}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'parentMemberName', FORM_FILTER_PATH)
              }}
              schema={searchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default AccountLists
