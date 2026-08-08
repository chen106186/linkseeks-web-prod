import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'

interface HistoryListHistoryListProps {
  dataSource: {
    applyNo: string
    originalQuota: number
    applyQuota: number
    auditQuota: number
    applyTime: string
  }[]
  // 目标路径
  target?: string
}

const HistoryList: React.FC<HistoryListHistoryListProps> = ({ dataSource = [], target }) => {
  const intl = useIntl()
  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.columns.applyNo' }),
      dataIndex: 'applyNo',
      render: (text, record) => (
        <EyeAuthButton
          url={`${target ? target : '/payandSettle/creditApplication/quotaPrSubmit/detail'}?id=${record.id}&creditId=${
            record.creditId
          }`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.columns.originalQuota' }),
      dataIndex: 'originalQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.columns.applyQuota' }),
      dataIndex: 'applyQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.columns.auditQuota' }),
      dataIndex: 'auditQuota',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.columns.applyTime' }),
      dataIndex: 'applyTime',
      align: 'center',
    },
  ]

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'payandSettle.creditApplication.components.historyList.title' })}
      style={{
        marginBottom: 24,
      }}
    >
      <PolymericTable rowKey="applyNo" dataSource={dataSource} columns={columns} loading={false} pagination={null} />
    </MellowCard>
  )
}

export default HistoryList
