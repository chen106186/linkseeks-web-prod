import React, { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const intl = useIntl()

  const handleSubmit = async (id) => {
    history.push(`/orderAbility/purchaseOrder/readySubmitOrder/edit?id=${id}&preview=0`)
  }

  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),

      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleSubmit(record.orderId)}>
            {intl.formatMessage({ id: 'purchaseOrder.tijiaodingdan', defaultMessage: '提交订单' })}
          </Button>
        </EditAuthButton>
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
