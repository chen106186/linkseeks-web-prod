import React from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Typography, Tag } from 'antd'
import { formatTimeString } from '@/utils'
import {
  OFFTER_EXTERNALSTATE,
  OFFTER_EXTERNALSTATE_COLOR,
  OFFTER_INTERNALSTATE,
  OFFTER_INTERNALSTATE_COLOR,
} from '../constants'
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
    render: (_text: any) => <Tag color={OFFTER_EXTERNALSTATE_COLOR[_text]}>{OFFTER_EXTERNALSTATE[_text]}</Tag>,
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
    render: (_text: any) => <Tag color={OFFTER_INTERNALSTATE_COLOR[_text]}>{OFFTER_INTERNALSTATE[_text]}</Tag>,
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
