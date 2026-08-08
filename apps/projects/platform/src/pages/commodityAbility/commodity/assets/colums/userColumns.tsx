import { getIntl } from '@linkseeks/i18n'
import { ColumnsType } from 'antd/es/table'

export const userColumns: ColumnsType<any> = [
  {
    title: `${getIntl().formatMessage({ id: 'member.memberInspection.common.columns.userColumns.memberSerial' })}`,
    dataIndex: 'userId',
  },
  {
    title: `${getIntl().formatMessage({ id: 'member.memberInspection.common.columns.userColumns.name' })}`,
    dataIndex: 'name',
  },
  {
    title: `${getIntl().formatMessage({ id: 'member.memberInspection.common.columns.userColumns.phone' })}`,
    dataIndex: 'phone',
  },
  {
    title: `${getIntl().formatMessage({ id: 'member.memberInspection.common.columns.userColumns.agency' })}`,
    dataIndex: 'orgName',
  },
  {
    title: `${getIntl().formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
    dataIndex: 'jobTitle',
  },
]
