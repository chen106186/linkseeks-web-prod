import React from 'react'
import { Tabs, Badge } from 'antd'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import StatusTag from '@/components/StatusTag'
import { MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'

export interface InnerHistoryItem {
  createTime?: string
  id?: number
  innerStatus?: number
  innerStatusName?: string
  operation?: string
  operatorJobTitle?: string
  operatorName?: string
  operatorOrgName?: string
  remark?: string
}

export interface OuterHistoryItem {
  createTime?: string
  id?: number
  operation?: string
  operatorRoleName?: string
  outerStatus?: number
  outerStatusName?: string
  remark?: string
}

interface FlowRecordsProps {
  outerHistory?: OuterHistoryItem[]
  innerHistory?: InnerHistoryItem[]
}

const FlowRecords: React.FC<FlowRecordsProps> = ({ outerHistory = [], innerHistory = [] }) => {
  const outerColumns: EditableColumns<OuterHistoryItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '操作角色',
      dataIndex: 'operatorRoleName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'outerStatusName',
      align: 'center',
      render: (text, record) => (
        <StatusTag type={MEMBER_OUTER_STATUS_TYPE[record.outerStatus as number]} title={text} />
      ),
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
    },
    {
      title: '审核意见',
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  const innerColumns: EditableColumns<InnerHistoryItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '操作人',
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
      dataIndex: 'innerStatusName',
      align: 'center',
      render: (text, record) => (
        <Badge color={MEMBER_INNER_STATUS_BADGE_COLOR[record.innerStatus as number] || '#606266'} text={text} />
      ),
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
    },
    {
      title: '审核意见',
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  return (
    <MellowCard>
      <Tabs onChange={() => {}}>
        <Tabs.TabPane tab="流转记录" key="1">
          <PolymericTable dataSource={outerHistory} columns={outerColumns} loading={false} pagination={null} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="内部单据流转记录" key="2">
          <PolymericTable dataSource={innerHistory} columns={innerColumns} loading={false} pagination={null} />
        </Tabs.TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default FlowRecords
