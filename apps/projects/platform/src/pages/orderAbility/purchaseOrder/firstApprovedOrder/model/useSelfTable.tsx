import { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'
import { useWebIntl } from '@apps/locales'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'

export const useSelfTable = () => {
  const ref = useRef<any>({})
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable({ customKey: 'orderId' })
  const intl = useIntl()
  const translate = useWebIntl()
  const handleSubmit = async (record) => {
    history.push(`/orderAbility/purchaseOrder/firstApprovedOrder/edit?id=${record.orderId}`)
  }
  const secondColumns: any[] = baseOrderListColumns().concat([
    {
      title: translate('web.common.control'),
      dataIndex: 'ctl',
      key: 'ctl',
      render: (text, record) => (
        <EditAuthButton>
          <Button type="link" onClick={() => handleSubmit(record)}>
            {intl.formatMessage({ id: 'purchaseOrder.tijiaoshenhe', defaultMessage: '提交审核' })}
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
