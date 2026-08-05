import React, { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'

// 业务hooks
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'id' })
  const intl = useIntl()
  const handleSubmit = async (record) => {
    // if (record.purchaseOrderInteriorState === SaleOrderInsideWorkState.FILLING_ORDER) {
    history.push(`/orderAbility/saleOrder/readyReturnDocument/edit?id=${record.id}`)
    // }
  }
  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: intl.formatMessage({ id: 'purchaseOrder.operation' }),

      dataIndex: 'ctl',
      key: 'ctl',
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
      render: (text, record) => (
        // <>
        // {
        //   record.purchaseOrderInteriorState === SaleOrderInsideWorkState.FILLING_ORDER &&
        <Button type="link" onClick={() => handleSubmit(record)}>
          {intl.formatMessage({ id: 'saleOrder.guidang', defaultMessage: '归档' })}
        </Button>
      ),
      // }
      // </>
    },
  ])

  return {
    columns: secondColumns,
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
