import React, { useRef } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Card, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import NiceForm from '@/components/NiceForm'
import { createFormActions } from '@apps/formily'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { searchSchema } from './schema'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { EyeAuthButton } from '@apps/components'
import { encodeURLBase64 } from '@linkseeks/crypto'
import { DetailAuthButton } from '@apps/components'
import DateRangePickerUnix from '@/components/NiceForm/components/DateRangePickerUnix'
import StatusTag from '@/components/StatusTag'
import { statusMap } from '../../constant'
import moment from 'moment'
import { getPayMemberAssetAccountGetPayCashOutList } from '@apps/apis'
import { customAuthUrl as AuthUrl } from '@apps/domains'
import { AuthButton } from '@apps/components'

const formActions = createFormActions()

const PaymentWithdraw: React.FC<{}> = () => {
  const intl = useIntl()
  const ref = useRef<any>({})

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.memberName' }),
      dataIndex: ['memberAssetAccount', 'memberName'],
      key: 'memberAssetAccount',
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton
          type="button"
          handleClick={() => clickUp({ ...record, preview: true })}
          url={`/payandSettle/amountAccountManage/paymentWithdraw/detail?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.bankAccountName' }),
      dataIndex: 'bankAccountName',
      key: 'bankAccountName',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.bankAccount' }),
      dataIndex: 'bankAccount',
      key: 'bankAccount',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.tradeMoney' }),
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t, r) =>
        `${intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.currency' })}${t.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.tradeTime' }),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (t, r) => moment(t).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (t, r) => <StatusTag title={statusMap[t]['title']} type={statusMap[t]['type']} />,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.option' }),
      dataIndex: 'option',
      render: (t, r) => (
        <>
          {r.status !== 4 && (
            <AuthButton type="custom" code="examine">
              <Button type="link" onClick={() => clickUp(r)}>
                {intl.formatMessage({ id: 'payandSettle.amountAccountManage.paymentWithdraw.columns.option.1' })}
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve, reject) => {
      let obj = { ...params }
      getPayMemberAssetAccountGetPayCashOutList(obj).then((res) => {
        resolve(res.data)
      })
    })
  }

  const clickUp = (r: any) => {
    let params = {
      tradeCode: r.tradeCode,
      id: r.memberAssetAccount.id,
      payId: r.id,
      amount: r.tradeMoney,
      preview: r.preview,
      status: r.status,
    }
    if (AuthUrl('detail')) {
      history.push(
        `/payandSettle/amountAccountManage/paymentWithdraw/detail?detailinfo=${encodeURLBase64(
          JSON.stringify(params),
        )}`,
      )
    }
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
                useStateFilterSearchLinkageEffect($, actions, 'memberName', FORM_FILTER_PATH)
              }}
              schema={searchSchema}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default PaymentWithdraw
