import { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { EyeAuthButton, AuthButton } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { statusMap } from '../../constant'
import { Button } from 'antd'

export const useSelfTable = () => {
  const ref = useRef({} as ActionType)

  const clickUp = (r: any) => {
    const params = {
      tradeCode: r.tradeCode,
      id: r.memberAssetAccount.id,
      tradeId: r.id,
      amount: r.tradeMoney,
      preview: r.preview,
      status: r.status,
    }
    history.push(`/settlementManage/capitalAccount/checkWithdraw/detail?detailinfo=${btoa(JSON.stringify(params))}`)
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
          url="/settlementManage/capitalAccount/checkWithdraw/detail"
          type="button"
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
      render: (t) => t.toFixed(2),
    },
    {
      title: '提现申请时间',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (t) => formatTimeString(t),
      searchField: {
        type: 'DateRange',
        title: '申请时间',
        name: ['startTime', 'endTime'],
        placeholder: ['开始时间', '结束时间'],
      },
      // sorter: (a, b) =>  b.tradeTime - a.tradeTime,
      // defaultSortOrder: "ascend"
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          {
            label: '申请提现',
            value: 1,
          },
          {
            label: '审核通过',
            value: 2,
          },
          {
            label: '审核不通过',
            value: 3,
          },
          // {
          //   label: '提现成功',
          //   value: 4,
          // },
          // {
          //   label: '提现失败',
          //   value: 5,
          // }
        ],
      },
      render: (t) => <StatusTag title={statusMap[t]['title']} type={statusMap[t]['type']} />,
    },
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (t, r) => (
        <>
          {r.status === 1 && (
            <AuthButton type="custom" code="examine">
              <Button type="link" onClick={() => clickUp(r)}>
                审核
              </Button>
            </AuthButton>
          )}
        </>
      ),
    },
  ]

  return {
    columns,
    ref,
  }
}
