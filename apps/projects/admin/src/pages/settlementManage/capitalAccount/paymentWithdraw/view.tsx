import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button } from 'antd'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { EyeAuthButton, AuthButton } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import { statusMap } from '../constant'
import { formatTimeString } from '@/utils'
import { getPayPlatFormAssetAccountGetPayCashOutList } from '@apps/apis'

const PaymentWithdraw: React.FC = () => {
  const ref = useRef({} as ActionType)

  const clickUp = (r: any) => {
    const params = {
      tradeCode: r.tradeCode,
      id: r.memberAssetAccount.id,
      payId: r.id,
      amount: r.tradeMoney,
      preview: r.preview,
      status: r.status,
    }
    history.push(`/settlementManage/capitalAccount/paymentWithdraw/detail?detailinfo=${btoa(JSON.stringify(params))}`)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '会员名称',
      dataIndex: ['memberAssetAccount', 'memberName'],
      key: 'memberAssetAccount',
      className: 'commonPickColor',
      searchField: {
        name: 'memberName',
        main: true,
      },
      fixed: 'left',
      render: (text, record) => (
        <EyeAuthButton
          type="button"
          url="/settlementManage/capitalAccount/paymentWithdraw/detail"
          handleClick={() => clickUp({ ...record, preview: true })}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '提现银行账户名称',
      dataIndex: 'bankAccountName',
      key: 'bankAccountName',
    },
    {
      title: '银行账号',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
    },
    {
      title: '提现金额（元）',
      dataIndex: 'tradeMoney',
      key: 'tradeMoney',
      render: (t) => `￥${t.toFixed(2)}`,
    },
    {
      title: '提现申请时间',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      searchField: {
        type: 'DateRange',
        title: '申请时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      render: (t) => formatTimeString(t),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '审核通过',
            value: 2,
          },
          {
            label: '提现成功',
            value: 4,
          },
          {
            label: '提现失败',
            value: 5,
          },
        ],
      },
      render: (t) => <StatusTag title={statusMap[t]['title']} type={statusMap[t]['type']} />,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (t, r) =>
        r.status !== 4 && (
          <AuthButton type="custom" code="pay">
            <Button type="link" onClick={() => clickUp(r)}>
              支付
            </Button>
          </AuthButton>
        ),
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      const payload = { ...params }
      getPayPlatFormAssetAccountGetPayCashOutList(payload).then((res) => {
        resolve(res.data)
      })
    })
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default PaymentWithdraw
