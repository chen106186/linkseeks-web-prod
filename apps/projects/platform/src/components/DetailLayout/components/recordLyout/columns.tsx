import React from 'react'
import { ColumnType } from 'antd/lib/table/interface'
import { Typography, Tag } from 'antd'
import { formatTimeString } from '@/utils'
import { EXTERNALSTATE_COLOR, INTERNALSTATE_COLOR } from '@/constants/stateColor'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const { Text } = Typography

/** 外部流转记录 */
export const EXTERNALLOGS: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'transaction_components.liuzhuanshunxuhao' }),
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuojuese' }),
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={EXTERNALSTATE_COLOR[_text] || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text: any, _record: any) => (
      <Text>{formatTimeString(_record.createTime || _record.operationTime, 'YYYY-MM-DD HH:mm')}</Text>
    ),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
/** 内部流转记录 */
export const INTERNALLOGS: ColumnType<any>[] = [
  {
    title: intl.formatMessage({ id: 'transaction_components.liuzhuanshunxuhao' }),
    key: 'index',
    dataIndex: 'index',
    render: (_text: any, _record: any, index: number) => <Text>{index + 1}</Text>,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoren' }),
    key: 'roleName',
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.bumen' }),
    key: 'department',
    dataIndex: 'department',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhiwei' }),
    key: 'position',
    dataIndex: 'position',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
    key: 'state',
    dataIndex: 'state',
    render: (_text: any, _record: any) => (
      <Tag color={INTERNALSTATE_COLOR[_text] || 'default'}>{_record.stateName}</Tag>
    ),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
    key: 'operation',
    dataIndex: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
    key: 'createTime',
    dataIndex: 'createTime',
    render: (_text: any, _record: any) => (
      <Text>{formatTimeString(_record.createTime || _record.operationTime, 'YYYY-MM-DD HH:mm')}</Text>
    ),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
    key: 'auditOpinion',
    dataIndex: 'auditOpinion',
  },
]
