/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 18:04:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-26 14:54:19
 * @Description: 内部流转记录
 */
import React from 'react'
import { Badge } from 'antd'
import { formatTimeString } from '@/utils'
import FlowRecords from '@/components/FlowRecords'
import type { EditableColumns } from '@/components/PolymericTable/interface'

export type FlowItem = {
  /**
   * 记录Id
   */
  id: number
  /**
   * 操作时间
   */
  createTime: number
  /**
   * 操作人员姓名
   */
  operatorName: string
  /**
   * 操作人员组织机构名称
   */
  operatorOrgName: string
  /**
   * 操作人员职位
   */
  operatorJobTitle: string
  /**
   * 操作方法
   */
  operation: string
  /**
   * 内部状态枚举
   */
  status: number
  /**
   * 会员内部状态名称
   */
  statusName: string
  /**
   * 操作说明（审核意见）
   */
  remark: string
}

export interface IProps {
  /**
   * 数据源
   */
  dataSource: FlowItem[]
}

const InnerFlowRecords: React.FC<IProps> = (props) => {
  const { dataSource = [], ...restProps } = props

  const columns: EditableColumns<FlowItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '操作角色',
      dataIndex: 'operatorName',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'operatorOrgName',
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'operatorJobTitle',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      align: 'center',
      render: (text) => <Badge color="red" text={text} />,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
      render: (text) => (text ? formatTimeString(text) : ''),
    },
    {
      title: '审核意见',
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  return <FlowRecords innerColumns={columns} innerRowkey="id" innerDataSource={dataSource} {...restProps} />
}

export default InnerFlowRecords
