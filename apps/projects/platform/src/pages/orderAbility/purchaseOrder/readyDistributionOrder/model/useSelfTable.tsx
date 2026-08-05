import React, { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { postOrderBuyerTake } from '@apps/apis'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const intl = useIntl()

  const handleSubmit = async (id) => {
    const { code } = await postOrderBuyerTake({ orderId: id })
    if (code === 1000) {
      ref.current.reloadCurrent()
    }
  }

  // const secondColumns: any[] = baseOrderListColumns().concat([
  //   {
  //     title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),
  //
  //     dataIndex: 'ctl',
  //     key: 'ctl',
  //     render: (text, record) => <Button type='link' onClick={() => handleSubmit(record.orderId)}>{intl.formatMessage({ id: 'purchaseOrder.lingqu', defaultMessage: '领取' })}</Button>
  //   }
  // ])

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      alreadyColumns.splice(2, 1)
      alreadyColumns.splice(6, 0, {
        title: intl.formatMessage({ id: 'saleOrder.songhuodizhi', defaultMessage: '送货地址' }),
        dataIndex: 'deliverAddress',
        key: 'deliverAddress',
        width: 164,
        ellipsis: true,
      })
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => (
            <AuthButton type="custom" code="receive">
              <Button type="link" onClick={() => handleSubmit(record.orderId)}>
                {intl.formatMessage({ id: 'purchaseOrder.lingqu', defaultMessage: '领取' })}
              </Button>
            </AuthButton>
          ),
          fixed: 'right',
          width: COLUMNS_ACTION_WIDTH,
        },
      ])
    }
  }

  return {
    columns: secondColumns(),
    ref,
    rowSelection,
    rowSelectionCtl,
  }
}
