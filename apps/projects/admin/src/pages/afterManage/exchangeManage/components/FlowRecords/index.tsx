import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import StatusTag from '@/components/StatusTag'

export interface OuterHistoryItem {
  roleName: string
  status: string
  operate: string
  operateTime: string
  opinion: string
}

export interface OuterHistoryData {
  data: OuterHistoryItem[]
  totalCount: number
}

interface FlowRecordsProps {
  /**
   * 获取外部流转记录
   */
  fetchOuterHistory?: (params: { [key: string]: any }) => Promise<OuterHistoryData>

  /**
   * 外部状态map
   */
  outerStatusMap: { [key: string]: any }
}

const PAGE_SIZE = 10

const FlowRecords: React.FC<FlowRecordsProps> = ({ fetchOuterHistory, outerStatusMap = {} }) => {
  const [outerPage, setOuterPage] = useState(1)
  const [outerSize, setOuterSize] = useState(PAGE_SIZE)
  const [outerLoading, setOuterLoading] = useState(false)
  const [outerData, setOuterData] = useState<OuterHistoryData>({ data: [], totalCount: 0 })

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
      render: (text, record) => <StatusTag type={outerStatusMap[record.statusCode] || 'default'} title={text} />,
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

  const getOuterHistory = (params) => {
    if (fetchOuterHistory) {
      setOuterLoading(true)
      fetchOuterHistory(params)
        .then((res) => {
          if (res) {
            setOuterData(res)
          }
        })
        .finally(() => {
          setOuterLoading(false)
        })
    }
  }

  useEffect(() => {
    getOuterHistory({
      current: outerPage,
      pageSize: outerSize,
    })
  }, [])

  const handleOuterPaginationChange = (current, pageSize) => {
    setOuterPage(current)
    setOuterSize(pageSize)
    getOuterHistory({
      current,
      pageSize,
    })
  }

  return (
    <MellowCard>
      <Tabs onChange={() => {}}>
        <Tabs.TabPane tab="外部流转记录" key="1">
          <PolymericTable
            rowKey="step"
            dataSource={outerData.data}
            columns={outerColumns}
            loading={outerLoading}
            pagination={{
              current: outerPage,
              pageSize: outerSize,
              total: outerData.totalCount,
            }}
            onPaginationChange={handleOuterPaginationChange}
          />
        </Tabs.TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default FlowRecords
