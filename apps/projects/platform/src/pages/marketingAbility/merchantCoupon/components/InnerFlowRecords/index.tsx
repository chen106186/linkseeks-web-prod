/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 18:04:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-22 15:35:37
 * @Description: 内部流转记录
 */
import React from 'react'
import { Badge } from 'antd'
import moment from 'moment'
import FlowRecords from '@/components/FlowRecords'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { useIntl } from '@linkseeks/i18n'

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
  const intl = useIntl()
  const { dataSource = [], ...restProps } = props

  const columns: EditableColumns<FlowItem>[] = [
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.order' })}`,
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operaRole' })}`,
      dataIndex: 'operatorName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.part' })}`,
      dataIndex: 'operatorOrgName',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.zhiwei' })}`,
      dataIndex: 'operatorJobTitle',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.status' })}`,
      dataIndex: 'statusName',
      align: 'center',
      render: (text, record) => <Badge color="red" text={text} />,
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operation' })}`,
      dataIndex: 'operation',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.operationTime' })}`,
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
      render: (text) => (text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    {
      title: `${intl.formatMessage({ id: 'merchantCoupon.Reviewcomments' })}`,
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  return <FlowRecords innerColumns={columns} innerRowkey="id" innerDataSource={dataSource} {...restProps} />
}

export default InnerFlowRecords
