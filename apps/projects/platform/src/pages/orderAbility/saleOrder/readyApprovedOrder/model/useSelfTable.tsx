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
  const handleSubmit = async (id) => {
    history.push(`/orderAbility/saleOrder/readyApprovedOrder/edit?id=${id}`)
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      // alreadyColumns.splice(6, 1)
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => {
            return (
              <>
                <EditAuthButton>
                  <Button type="link" onClick={() => handleSubmit(record.orderId)}>
                    {intl.formatMessage({
                      id: 'saleOrder.tijiaoshenhe',
                      defaultMessage: '提交审核',
                    })}
                  </Button>
                </EditAuthButton>
              </>
            )
          },
          fixed: 'right',
          width: COLUMNS_ACTION_WIDTH,
        },
      ])
    }
  }

  return {
    columns: secondColumns(),
    ref,
  }
}
