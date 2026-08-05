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
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const { Text } = Typography

/** 外部流转记录 */
export const EXTERNALLOGS: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'purchase.liuzhuanshunxuhao' }),
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'purchase.caozuojuese' }),
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'purchase.zhuangtai' }),
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={OFFTER_EXTERNALSTATE_COLOR[_text] || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.operate' }),
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'purchase.caozuoshijian' }),
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'purchase.shenheyijian' }),
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
/** 内部流转记录 */
export const INTERNALLOGS: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'purchase.liuzhuanshunxuhao' }),
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'purchase.caozuoren' }),
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'purchase.bumen' }),
    key: 'department',
    dataIndex: 'department',
  },
  {
    title: intl.formatMessage({ id: 'purchase.zhiwei' }),
    key: 'position',
    dataIndex: 'position',
  },
  {
    title: intl.formatMessage({ id: 'purchase.zhuangtai' }),
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={OFFTER_INTERNALSTATE_COLOR[_text] || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: intl.formatMessage({ id: 'table.purchase.operate' }),
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'purchase.caozuoshijian' }),
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text: any, _record: any) => <Text>{formatTimeString(_text)}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'purchase.shenheyijian' }),
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
