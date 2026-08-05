import { ColumnType } from 'antd/lib/table/interface'
import { getIntl } from '@linkseeks/i18n'

/** 流程规则ID */
export const id: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.processId', defaultMessage: '流程规则ID' }),
  key: 'processId',
  dataIndex: 'processId',
}

/** 流程规则名称 */
export const name: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.processIdruleName', defaultMessage: '流程规则名称' }),
  key: 'name',
  dataIndex: 'name',
  width: 160,
  ellipsis: true,
}

/** 流程名称 */
export const processName: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.processName', defaultMessage: '流程名称' }),
  key: 'processName',
  dataIndex: 'processName',
}

/** 操作时间 */
export const createTime: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.createTime', defaultMessage: '操作时间' }),
  key: 'createTime',
  dataIndex: 'createTime',
}

/** 状态 */
export const status: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.status', defaultMessage: '状态' }),
  key: 'status',
  dataIndex: 'status',
}

/** 操作 */
export const operation: ColumnType<any> = {
  title: getIntl().formatMessage({ id: 'process.operation', defaultMessage: '操作' }),
  key: 'operation',
  dataIndex: 'operation',
}
