/*
 * @Author: LeeJiancong
 * @Date: 2020-08-27 16:27:53
 * @LastEditors: LeeJiancong
 * @Copyright: 1549414730@qq.com
 * @LastEditTime: 2020-09-10 10:22:41
 */
import { getWebIntl } from '@apps/locales'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
const translate = getWebIntl()

export const dockingColumn = (children, optionChild) => {
  let columns: ColumnType<any>[] = []
  columns = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      align: 'left',
    },

    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      align: 'center',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '会员等级',
      dataIndex: 'levelTag',
      key: 'levelTag',
      align: 'center',
    },
    {
      title: '是否归属会员',
      dataIndex: 'membershipOrNot',
      key: 'membershipOrNot',
      align: 'center',
      render: (text: any) => (text == 0 ? translate('web.common.fou') : translate('web.common.shi')),
    },

    {
      title: '需求发送状态',
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      render: (text: any, records, index) => (children ? children(text, records, index) : ''),
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      align: 'center',
      render: (text: any, records, index) => (optionChild ? optionChild(text, records, index) : ''),
    },
  ]
  return columns
}

export const memberColumn = (children?) => {
  let columns: ColumnType<any>[] = []
  columns = [
    {
      title: '序号',
      dataIndex: 'memberId',
      align: 'center',
      key: 'memberId',
    },
    {
      title: '会员名称',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },

    {
      title: '会员类型',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName',
      align: 'center',
    },
    {
      title: '会员角色',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '会员等级',
      dataIndex: 'levelTag',
      key: 'levelTag',
      align: 'center',
    },
    {
      title: '是否归属会员',
      dataIndex: 'membershipOrNot',
      key: 'membershipOrNot',
      align: 'center',
      render: (text: any) => (text == 0 ? translate('web.common.fou') : translate('web.common.shi')),
    },

    {
      title: '需求发送状态',
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      render: (text: any, records, index) => (children ? children(text, records, index) : ''),
    },
  ]
  return columns
}

/**
 * @description: 内部流转interiorRequisitionForms
 * 外部流转 externalRequisitionForms
 * @param {type}
 * @return {type}
 */

export const externalColumn = (childeren, stateList?) => {
  let culumn: ColumnType<any>[] = []

  return (culumn = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: '操作角色',
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render: (text: any, record: any) => stateList(text),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      align: 'center',
      key: 'operationTime',
      render: (text: any, record: any) => childeren(text),
    },
    {
      title: '审核意见',
      dataIndex: 'auditOpinion',
      align: 'left',
      key: 'auditOpinion',
    },
  ])
}

export const interiorColumn = (childeren, stateList?) => {
  let culumn: ColumnType<any>[] = []
  return (culumn = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: '操作人',
      dataIndex: 'roleName',
      align: 'center',
      key: 'roleName',
    },
    {
      title: '部门',
      dataIndex: 'department',
      align: 'center',
      key: 'department',
    },
    {
      title: '职位',
      dataIndex: 'position',
      align: 'center',
      key: 'position',
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      key: 'state',
      render: (text: any, record: any) => stateList(text),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
    },
    {
      title: '操作时间',
      dataIndex: 'operationTime',
      align: 'center',
      key: 'operationTime',
      render: (text: any, record: any) => childeren(text),
    },
    {
      title: '审核意见',
      dataIndex: 'auditOpinion',
      align: 'left',
      key: 'auditOpinion',
    },
  ])
}
