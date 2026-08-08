import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Tabs, Badge } from 'antd'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import StatusTag from '@/components/StatusTag'
import { CREDIT_OUTER_STATUS } from '@/constants/payment'
import { CREDIT_INNER_STATUS_BADGE_MAP, CREDIT_OUTER_STATUS_TAG_MAP } from '../../../constant'
import styles from './index.less'

export interface InnerHistoryItem {
  step: number
  operator: string
  department: string
  jobTitle: string
  status: number
  operate: string
  operateTime: string
  opinion: string
}

export interface OuterHistoryItem {
  roleName: string
  status: number
  operate: string
  operateTime: string
  opinion: string
}

interface FlowRecordsProps {
  outerHistory?: OuterHistoryItem[]
  innerHistory: InnerHistoryItem[]
}

const FlowRecords: React.FC<FlowRecordsProps> = ({ outerHistory = [], innerHistory }) => {
  const intl = useIntl()

  const outerColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.index' }),
      dataIndex: 'index',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.roleName' }),
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.status' }),
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <StatusTag type={CREDIT_OUTER_STATUS_TAG_MAP[text]} title={CREDIT_OUTER_STATUS[text]} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.operate' }),
      dataIndex: 'operate',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.operateTime' }),
      dataIndex: 'operateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.outerColumns.opinion' }),
      dataIndex: 'opinion',
      align: 'center',
      ellipsis: true,
    },
  ]

  const innerColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.step' }),
      dataIndex: 'step',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.operator' }),
      dataIndex: 'operator',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.department' }),
      dataIndex: 'department',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.jobTitle' }),
      dataIndex: 'jobTitle',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.status' }),
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <Badge color={CREDIT_INNER_STATUS_BADGE_MAP[text] || '#606266'} text={record.statusName} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.operate' }),
      dataIndex: 'operate',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.operateTime' }),
      dataIndex: 'operateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.innerColumns.opinion' }),
      dataIndex: 'opinion',
      align: 'center',
      ellipsis: true,
    },
  ]

  return (
    <MellowCard>
      <Tabs onChange={() => {}}>
        {outerHistory ? (
          <Tabs.TabPane
            tab={intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.tab.1' })}
            key="1"
          >
            <PolymericTable
              rowKey="step"
              dataSource={outerHistory}
              columns={outerColumns}
              loading={false}
              pagination={null}
            />
          </Tabs.TabPane>
        ) : null}
        <Tabs.TabPane
          tab={intl.formatMessage({ id: 'payandSettle.creditManage.components.flowRecords.tab.2' })}
          key="2"
        >
          <PolymericTable
            rowKey="step"
            dataSource={innerHistory}
            columns={innerColumns}
            loading={false}
            pagination={null}
          />
        </Tabs.TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default FlowRecords
