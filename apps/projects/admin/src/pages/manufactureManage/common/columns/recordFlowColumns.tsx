import React from 'react'
import { formatTimeString } from '@/utils'

export const innerFlowColumns = [
  {
    title: '流转记录',
    dataIndex: 'id',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'department',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    render: (text) => {
      return formatTimeString(text)
    },
  },
  {
    title: '审核意见',
    dataIndex: 'opinion',
  },
]

/**
 * 内部流转
 */

export const outerWorkflowRecordsColumn = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    render: (text) => {
      return formatTimeString(text)
    },
  },
  {
    title: '审核意见',
    dataIndex: 'opinion',
  },
]
