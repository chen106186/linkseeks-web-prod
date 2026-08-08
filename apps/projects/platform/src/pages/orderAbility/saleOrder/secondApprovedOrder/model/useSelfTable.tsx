import { useRef } from 'react'
import { Button } from 'antd'
import { baseOrderListColumns } from '../../constant'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'
// 业务hooks, 待新增订单
export const useSelfTable = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const translate = useWebIntl()
  const handleSubmit = async (record) => {
    history.push(`/orderAbility/saleOrder/secondApprovedOrder/edit?id=${record.orderId}`)
  }

  const secondColumns = () => {
    const alreadyColumns = baseOrderListColumns()
    if (alreadyColumns) {
      // alreadyColumns.splice(6, 1)
      return alreadyColumns.concat([
        {
          title: translate('web.common.control'),

          dataIndex: 'ctl',
          key: 'ctl',
          render: (text, record) => {
            return (
              <>
                <EditAuthButton>
                  <Button type="link" onClick={() => handleSubmit(record)}>
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
