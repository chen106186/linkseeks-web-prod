import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

const intl = getIntl()

export const userColumns: ColumnsType<any> = [
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
    dataIndex: 'userId',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.name' })}`,
    dataIndex: 'name',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.phone' })}`,
    dataIndex: 'phone',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.agency' })}`,
    dataIndex: 'orgName',
  },
  {
    title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
    dataIndex: 'jobTitle',
  },
]
