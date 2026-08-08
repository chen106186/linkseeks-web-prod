import React from 'react'
import { ColumnsType } from 'antd/es/table'
import moment from 'moment'
import { Badge } from 'antd'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const innerFlowColumns = [
  {
    title: intl.formatMessage({ id: 'handling.liuzhuanjilu' }),
    dataIndex: 'id',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuoren' }),
    dataIndex: 'operator',
  },
  {
    title: intl.formatMessage({ id: 'handling.bumen' }),
    dataIndex: 'department',
  },
  {
    title: intl.formatMessage({ id: 'handling.zhiwei' }),
    dataIndex: 'jobTitle',
  },
  {
    title: intl.formatMessage({ id: 'handling.zhuangtai' }),
    dataIndex: 'status',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuo' }),
    dataIndex: 'operate',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuoshijian' }),
    dataIndex: 'operateTime',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.shenheyijian' }),
    dataIndex: 'opinion',
  },
]

/**
 * 内部流转
 */

export const outerWorkflowRecordsColumn = [
  {
    title: intl.formatMessage({ id: 'handling.xuhao' }),
    dataIndex: 'id',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuojuese' }),
    dataIndex: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'handling.zhuangtai' }),
    dataIndex: 'status',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuo' }),
    dataIndex: 'operate',
  },
  {
    title: intl.formatMessage({ id: 'handling.caozuoshijian' }),
    dataIndex: 'operateTime',
    render: (text, record) => {
      return moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    title: intl.formatMessage({ id: 'handling.shenheyijian' }),
    dataIndex: 'opinion',
  },
]
