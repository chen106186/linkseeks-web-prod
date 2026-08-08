/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 15:04:46
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-15 18:20:12
 * @Description: 外部流转记录
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { CREDIT_OUTER_STATUS } from '@/constants/payment'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import StatusTag from '@/components/StatusTag'
import { CREDIT_OUTER_STATUS_TAG_MAP } from '../../../constant'

interface OuterCirculationRecordProps {
  dataSource: {
    roleName: string
    status: number
    operate: string
    operateTime: string
    opinion: string
  }[]
  onPaginationChange?: (page: number, size: number) => void
}

const OuterCirculationRecord: React.FC<OuterCirculationRecordProps> = ({ dataSource = [], onPaginationChange }) => {
  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.order',
      }),
      dataIndex: 'order',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.roleName',
      }),
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.status',
      }),
      dataIndex: 'status',
      align: 'center',
      render: (text) => <StatusTag type={CREDIT_OUTER_STATUS_TAG_MAP[text]} title={CREDIT_OUTER_STATUS[text]} />,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.operate',
      }),
      dataIndex: 'operate',
      align: 'center',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.operateTime',
      }),
      dataIndex: 'operateTime',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'payandSettle.creditApplication.components.outerCirculationRecord.columns.opinion',
      }),
      dataIndex: 'opinion',
      align: 'center',
      ellipsis: true,
    },
  ]

  const handlePaginationChange = (page, size) => {
    if (onPaginationChange) {
      onPaginationChange(page, size)
    }
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'payandSettle.creditApplication.components.outerCirculationRecord.title' })}
      style={{
        marginBottom: 24,
      }}
    >
      <PolymericTable
        rowKey="operateTime"
        dataSource={dataSource}
        columns={columns}
        loading={false}
        pagination={null}
      />
    </MellowCard>
  )
}

export default OuterCirculationRecord
