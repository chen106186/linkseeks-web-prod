import React, { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const handleSubmit = async (record) => {
    history.push(`/orderAbility/purchaseOrder/secondApprovedOrder/edit?id=${record.orderId}`)
  }
  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: '操作',

      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <>
          <EditAuthButton>
            <Button type="link" onClick={() => handleSubmit(record)}>
              {intl.formatMessage({ id: 'purchaseOrder.tijiaoshenhe', defaultMessage: '提交审核' })}
            </Button>
          </EditAuthButton>
        </>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ])

  return {
    columns: secondColumns,
    ref,
  }
}
