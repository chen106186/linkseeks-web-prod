import React from 'react'
import type { ColumnType } from 'antd/lib/table/interface'
import { Typography, Tag } from 'antd'
import { formatTimeString } from '@/utils'

export const EXTERNALSTATE_COLOR = (text) => {
  switch (Number(text)) {
    case -1:
    case 7:
    case 8:
      return 'error'
    case 2:
    case 3:
    case 4:
      return 'warning'
    case 6:
      return 'processing'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}

export const INTERNALSTATE_COLOR = (text) => {
  switch (Number(text)) {
    case -1:
    case 8:
    case 9:
    case 11:
      return 'error'
    case 2:
    case 3:
    case 13:
    case 14:
    case 15:
      return 'warning'
    case 4:
    case 12:
      return 'processing'
    case 99:
      return 'success'
    default:
      return 'default'
  }
}

const { Text } = Typography

/** 外部流转记录 */
export const EXTERNALLOGS: ColumnType<any>[] = [
  {
    title: '流转顺序号',
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: '操作角色',
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={EXTERNALSTATE_COLOR(_text) || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: '操作时间',
    key: 'operationTime',
    dataIndex: 'operationTime',
    render: (_text: any, record) => {
      if (_text) {
        return <Text>{formatTimeString(_text, 'YYYY-MM-DD HH:mm')}</Text>
      }
      return <Text>{formatTimeString(record.createTime, 'YYYY-MM-DD HH:mm')}</Text>
    },
  },
  {
    title: '审核意见',
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
/** 内部流转记录 */
export const INTERNALLOGS: ColumnType<any>[] = [
  {
    title: '流转顺序号',
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: '操作人',
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: '部门',
    key: 'department',
    dataIndex: 'department',
  },
  {
    title: '职位',
    key: 'position',
    dataIndex: 'position',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={INTERNALSTATE_COLOR(_text) || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: '操作时间',
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text: any) => <Text>{formatTimeString(_text, 'YYYY-MM-DD HH:mm')}</Text>,
  },
  {
    title: '审核意见',
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
