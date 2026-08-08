import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
export const useSelfTable = () => {
  const intl = useIntl()
  const handleConfirm = async (record) => {
    history.push(`/orderAbility/saleOrder/readyConfirmOrder/edit?id=${record.orderId}`)
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      // alreadyColumns.splice(7, 1)
      return alreadyColumns.concat([
        {
          title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => {
            return (
              <>
                <EditAuthButton>
                  <Button type="link" onClick={() => handleConfirm(record)}>
                    {intl.formatMessage({
                      id: 'saleOrder.querendingdan',
                      defaultMessage: '确认订单',
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
  }
}
