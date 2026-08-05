import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

export const memberColumns: ColumnsType<any> = [
  {
    title: translate('web.resource.member.kehuid'),
    dataIndex: 'memberId',
  },
  {
    title: translate('web.resource.member.memberName'),
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({
      id: 'supplier.supplierInspection.common.columns.index.supplierLifecycle',
      defaultMessage: '生命周期阶段',
    })}`,
    dataIndex: 'lifeCycleStageName',
  },
  {
    title: `${intl.formatMessage({
      id: 'supplier.supplierInspection.common.columns.index.supplierEntryTime',
      defaultMessage: '入库时间',
    })}`,
    dataIndex: 'registerTime',
  },
]
