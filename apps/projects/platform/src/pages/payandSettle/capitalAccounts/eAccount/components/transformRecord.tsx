import { getPayEAccountAllInPayGetEAccountStatusRecord } from '@apps/apis'
import { StandardFormTable } from '@apps/components'
import { Card } from '@linkseeks/ui'
import { useEAccountInitContext } from '../context'
import { moveStatusMap } from '@/pages/payandSettle/constant'
import StatusTag from '@/components/StatusTag'
import { useWebIntl } from '@apps/locales'

const TransformRecord = () => {
  const translate = useWebIntl()

  const columns = StandardFormTable.createColumns([
    {
      key: 'memberRoleName',
      title: translate('web.common.controlRole'),
    },
    {
      key: 'status',
      title: translate('web.common.status'),
      render: (text: any, record: any) => (
        <StatusTag title={moveStatusMap[text]['title']} type={moveStatusMap[text]['type']} />
      ),
    },
    {
      key: 'operation',
      title: translate('web.common.caozuoleixing'),
      render: (text) => {
        return text === 1 ? translate('web.common.jiedongzijinzhanghu') : translate('web.common.dongjiezijinzhanghu')
      },
    },
    {
      key: 'createTime',
      title: translate('web.common.controlTime'),
      format: 'Date',
    },
    {
      key: 'remark',
      title: translate('web.common.yijian'),
    },
  ])
  const { accountDetail } = useEAccountInitContext()
  return (
    <Card isMarginBottom>
      {accountDetail && (
        <StandardFormTable
          columns={columns}
          request={(values) => getPayEAccountAllInPayGetEAccountStatusRecord({ ...values, id: accountDetail?.id })}
        />
      )}
    </Card>
  )
}

export default TransformRecord
