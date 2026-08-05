import React from 'react'
import { Switch } from 'antd'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'
import { Link } from '@linkseeks/router-core'
import { formatTimeString } from '@/utils'

/** 流程规则ID */
export const _id: RecordColumns<any> = {
  title: 'ID',
  key: 'processId',
  dataIndex: 'processId',
  fixed: 'left',
}

/** 流程规则名称 */
export const _name = (link: string): RecordColumns<any> => {
  return {
    title: '流程规则名称',
    key: 'name',
    dataIndex: 'name',
    fixed: 'left',
    searchField: 'Input',
    render: (_text, record) => <Link to={`${link}${record.processId}`}>{_text}</Link>,
  }
}

/** 流程名称 */
export const _processName: RecordColumns<any> = {
  title: '流程名称',
  key: 'processName',
  dataIndex: 'processName',
}

/** 操作时间 */
export const _createTime = (): RecordColumns<any> => {
  return {
    title: '操作时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text) => formatTimeString(_text),
  }
}

/** 流程名称 */
export const _isDefault: RecordColumns<any> = {
  title: '是否默认',
  key: 'isDefault',
  dataIndex: 'isDefault',
  render: (_text) => (!!_text ? '是' : '否'),
}

/** 状态 */
export const _status = (handleStatus: (record: any, status: 0 | 1) => void): RecordColumns<any> => {
  return {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    fixed: 'right',
    render: (_text, record) => (
      <Switch
        disabled={record.isDefault === 1}
        checked={!!_text}
        onChange={() => handleStatus(record, !!_text ? 0 : 1)}
      />
    ),
  }
}

/** 操作 */
export const _operation: RecordColumns<any> = {
  title: '操作',
  key: 'operation',
  dataIndex: 'operation',
  fixed: 'right',
}
