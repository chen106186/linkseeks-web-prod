import React from 'react'
import type { RecordColumns } from '@apps/components/src/web/StandardFormTable/types'

import StatusTag from '@/components/StatusTag'

import {
  status_3,
  operation_3,
  state_external_5,
  state_interior_5,
  state_external_6_1,
  state_interior_6_1,
} from './constants'

import { formatTimeString } from '@/utils/index'

// 订单外部
export const columns_outer_1: RecordColumns<any>[] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]
// 售后外部
export const columns_outer_2: RecordColumns<any>[] = [
  {
    title: '申请单号',
    dataIndex: 'applyNo',
    key: 'applyNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]
// 商品外部
export const columns_outer_3: RecordColumns<any>[] = [
  {
    title: '商品ID',
    dataIndex: 'commodityId',
    key: 'commodityId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'memberRoleName',
    key: 'memberRoleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => <StatusTag title={record.statusName} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (text) => operation_3[text],
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'checkRemark',
    key: 'checkRemark',
  },
]
// 会员外部
export const columns_outer_4: RecordColumns<any>[] = [
  {
    title: '会员ID',
    dataIndex: 'memberId',
    key: 'memberId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]
// 商品询价外部
export const columns_outer_5: RecordColumns<any>[] = [
  {
    title: '询价单号',
    dataIndex: 'inquiryListId',
    key: 'inquiryListId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record) => <StatusTag title={record.stateName || state_external_5[text].text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'auditOpinion',
    key: 'auditOpinion',
  },
]
// 采购-采购询价外部
export const columns_outer_6_1: RecordColumns<any>[] = [
  {
    title: '单号',
    dataIndex: 'purchaseInquiryId',
    key: 'purchaseInquiryId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record) => <StatusTag title={record.stateName || state_external_6_1[text].text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'auditOpinion',
    key: 'auditOpinion',
  },
]

// 采购-招投标外部
export const columns_outer_6_2: RecordColumns<any>[] = [
  {
    title: '单号',
    dataIndex: 'inviteTenderId',
    key: 'inviteTenderId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'memberRoleName',
    key: 'memberRoleName',
  },
  {
    title: '状态',
    dataIndex: 'statusValue',
    key: 'statusValue',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operationValue',
    key: 'operationValue',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'checkRemark',
    key: 'checkRemark',
  },
]
// 合同外部
export const columns_outer_7: RecordColumns<any>[] = [
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    key: 'contractNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]
// 营销外部
export const columns_outer_8: RecordColumns<any>[] = [
  {
    title: '活动/券ID',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]

// 订单内部
export const columns_inner_1: RecordColumns<any>[] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'organizationName',
    key: 'organizationName',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]
// 售后内部
export const columns_inner_2: RecordColumns<any>[] = [
  {
    title: '申请单号',
    dataIndex: 'applyNo',
    key: 'applyNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]
// 商品内部
export const columns_inner_3: RecordColumns<any>[] = [
  {
    title: '商品ID',
    dataIndex: 'commodityId',
    key: 'commodityId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'memberRoleName',
    key: 'memberRoleName',
  },
  {
    title: '部门',
    dataIndex: 'operatorOrgName',
    key: 'operatorOrgName',
  },
  {
    title: '职位',
    dataIndex: 'operatorJobTitle',
    key: 'operatorJobTitle',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    key: 'remarks',
  },
]
// 会员内部
export const columns_inner_4: RecordColumns<any>[] = [
  {
    title: '会员ID',
    dataIndex: 'memberId',
    key: 'memberId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
  },
  {
    title: '操作角色',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'organizationName',
    key: 'organizationName',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startDate', 'endDate'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
]
// 商品询价内部
export const columns_inner_5: RecordColumns<any>[] = [
  {
    title: '询价单号',
    dataIndex: 'inquiryListId',
    key: 'inquiryListId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record) => <StatusTag title={record.stateName || state_interior_5[text].text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'auditOpinion',
    key: 'auditOpinion',
  },
]
// 采购-采购询价内部
export const columns_inner_6_1: RecordColumns<any>[] = [
  {
    title: '单号',
    dataIndex: 'purchaseInquiryId',
    key: 'purchaseInquiryId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    render: (text, record) => <StatusTag title={record.stateName || state_interior_6_1[text].text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'auditOpinion',
    key: 'auditOpinion',
  },
]
// 采购-采购询价内部
export const columns_inner_6_2: RecordColumns<any>[] = [
  {
    title: '单号',
    dataIndex: 'inviteTenderId',
    key: 'inviteTenderId',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '部门',
    dataIndex: 'userOrgName',
    key: 'userOrgName',
  },
  {
    title: '职位',
    dataIndex: 'userJobTitle',
    key: 'userJobTitle',
  },
  {
    title: '状态',
    dataIndex: 'statusValue',
    key: 'statusValue',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operationValue',
    key: 'operationValue',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'checkRemark',
    key: 'checkRemark',
  },
]
// 合同内部
export const columns_inner_7: RecordColumns<any>[] = [
  {
    title: '合同编号',
    dataIndex: 'contractNo',
    key: 'contractNo',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]
// 营销内部
export const columns_inner_8: RecordColumns<any>[] = [
  {
    title: '活动/券ID',
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    searchField: {
      main: true,
    },
  },
  {
    title: '操作角色',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    key: 'statusName',
    render: (text, record) => <StatusTag title={text} type={'default'} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    searchField: {
      type: 'DateRange',
      name: ['startTime', 'endTime'],
      placeholder: ['开始时间', '结束时间'],
    },
    render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
  },
  {
    title: '备注',
    dataIndex: 'opinion',
    key: 'opinion',
  },
]
