import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import LineChart from './chart'
import CustomizeCard from '../CustomizeCard'

const AfterServiceRate = () => {
  const intl = useIntl()
  return (
    <CustomizeCard
      title={intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterServiceRate.index.supplyAfterRate',
      })}
      bodyStyle={{ padding: '0 16px', height: '312px' }}
    >
      <LineChart />
    </CustomizeCard>
  )
}

export default AfterServiceRate
