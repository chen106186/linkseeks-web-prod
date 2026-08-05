/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 18:22:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-30 13:49:13
 * @Description: 内、外部流转记录
 */
import React from 'react'
import { Tabs } from 'antd'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import StatusTag from '@/components/StatusTag'
import { REPAIR_OUTER_STATUS_TAG_MAP } from '../../constants'

export interface OuterHistoryItem {
  roleName: string
  status: string
  operate: string
  operateTime: string
  opinion: string
}

interface FlowRecordsProps {
  outerHistory?: OuterHistoryItem[]
}

const FlowRecords: React.FC<FlowRecordsProps> = ({ outerHistory = [] }) => {
  const outerColumns: EditableColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: '操作角色',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[record.statusCode]} title={text} />,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '审核意见',
      dataIndex: 'opinion',
      align: 'center',
      ellipsis: true,
    },
  ]

  return (
    <MellowCard>
      <Tabs onChange={() => {}}>
        <Tabs.TabPane tab="外部流转记录" key="1">
          <PolymericTable
            rowKey="step"
            dataSource={outerHistory}
            columns={outerColumns}
            loading={false}
            pagination={null}
          />
        </Tabs.TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default FlowRecords
