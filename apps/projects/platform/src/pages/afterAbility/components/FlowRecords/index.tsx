import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Badge } from 'antd'
import { EditableColumns } from '@/components/PolymericTable/interface'
import StatusTag from '@/components/StatusTag'
import FlowRecords, { IProps as FlowRecordsProps, FetchListParams, ListRes } from '@/components/FlowRecords'

export interface InnerHistoryItem {
  step: number
  operator: string
  department: string
  jobTitle: string
  status: string
  operate: string
  operateTime: string
  opinion: string
}

export interface OuterHistoryItem {
  roleName: string
  status: string
  operate: string
  operateTime: string
  opinion: string
}

export type OuterHistoryData = ListRes & {}

export type InnerHistoryData = ListRes & {}

export interface AsFlowRecordsProps extends FlowRecordsProps {
  /**
   * 外部流转记录，不能与 fetchOuterHistory 共存
   */
  outerHistory?: OuterHistoryItem[]
  /**
   * 内部流转记录，不能与 fetchInnerHistory 共存
   */
  innerHistory?: InnerHistoryItem[]
  /**
   * 获取外部流转记录
   */
  fetchOuterHistory?: (params: FetchListParams) => Promise<OuterHistoryData>
  /**
   * 获取内部流转记录
   */
  fetchInnerHistory?: (params: FetchListParams) => Promise<InnerHistoryData>
  /**
   * 外部状态map
   */
  outerStatusMap: { [key: string]: any }
  /**
   * 内部状态 color map
   */
  innerStatusColorMap?: { [key: string]: any }
}

const AsFlowRecords: React.FC<AsFlowRecordsProps> = ({
  outerHistory,
  innerHistory,
  fetchOuterHistory,
  fetchInnerHistory,
  outerStatusMap = {},
  innerStatusColorMap = {},
  ...rest
}) => {
  const intl = useIntl()

  const outerColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.index',
        defaultMessage: '序号',
      }),
      dataIndex: 'index',
      render: (_, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.roleName',
        defaultMessage: '操作角色',
      }),
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      render: (text, record) => <StatusTag type={outerStatusMap[record.statusCode] || 'default'} title={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.operate',
        defaultMessage: '操作',
      }),
      dataIndex: 'operate',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.operateTime',
        defaultMessage: '操作时间',
      }),
      dataIndex: 'operateTime',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.outerColumns.opinion',
        defaultMessage: '审核意见',
      }),
      dataIndex: 'opinion',
      ellipsis: true,
    },
  ]

  const innerColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.step',
        defaultMessage: '序号',
      }),
      dataIndex: 'step',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.operator',
        defaultMessage: '操作人',
      }),
      dataIndex: 'operator',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.department',
        defaultMessage: '部门',
      }),
      dataIndex: 'department',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.jobTitle',
        defaultMessage: '职位',
      }),
      dataIndex: 'jobTitle',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.status',
        defaultMessage: '状态',
      }),
      dataIndex: 'status',
      render: (text, record) => <Badge color={innerStatusColorMap[record.statusCode] || '#606266'} text={text} />,
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.operate',
        defaultMessage: '操作',
      }),
      dataIndex: 'operate',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.operateTime',
        defaultMessage: '操作时间',
      }),
      dataIndex: 'operateTime',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.FlowRecords.innerColumns.opinion',
        defaultMessage: '审核意见',
      }),
      dataIndex: 'opinion',
      ellipsis: true,
    },
  ]

  return (
    <FlowRecords
      outerColumns={outerColumns}
      innerColumns={innerColumns}
      outerRowkey="step"
      innerRowkey="step"
      outerDataSource={outerHistory}
      innerDataSource={innerHistory}
      fetchOuterList={fetchOuterHistory}
      fetchInnerList={fetchInnerHistory}
      {...rest}
    />
  )
}

export default AsFlowRecords
