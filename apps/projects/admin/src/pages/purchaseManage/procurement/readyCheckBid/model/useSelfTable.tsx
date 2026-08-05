import React, { useRef } from 'react'
import { Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { BidOuterWorkState } from '@/constants'
import { baseBidListColumns } from '@/pages/purchaseManage/procurement/constants'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'

// 待审核招标 hook
export const useSelfTable = () => {
  const ref = useRef({} as ActionType)
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    // if (record.inviteTenderOutStatus === BidOuterWorkState.Platform_Not_Check_Invite_Tender) {
    history.push(`/purchaseManage/procurement/readyCheckBid/detail?id=${record.id}&action=1`)
    // }
  }
  const secondColumns: any[] = baseBidListColumns.concat([
    {
      title: '操作',
      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      render: (text, record) => (
        <Button type="link" onClick={() => handleSubmit(record)}>
          审核
        </Button>
      ),
    },
  ])

  return {
    columns: secondColumns,
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
