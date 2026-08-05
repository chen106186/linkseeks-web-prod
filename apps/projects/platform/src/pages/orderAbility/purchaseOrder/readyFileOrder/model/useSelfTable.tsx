import React, { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { PurchaseOrderInsideWorkState } from '@/constants/order'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'

// 业务hooks
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })

  const handleSubmit = async (record) => {
    if (record.interiorState === PurchaseOrderInsideWorkState.FILLING_ORDER) {
      history.push(`/orderAbility/purchaseOrder/readyFileOrder/edit?id=${record.id}`)
    }
  }
  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),

      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          {/* {
        record.interiorState === PurchaseOrderInsideWorkState.FILLING_ORDER && */}
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'purchaseOrder.guidang', defaultMessage: '归档' })}
          </Button>
          {/* } */}
        </>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ])

  return {
    columns: secondColumns,
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
