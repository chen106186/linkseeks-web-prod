import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import TimelyDeliveryRate from './chart'
import CustomizeCard from '../CustomizeCard'

const TimelyDeliveryRateContainer = () => {
  const intl = useIntl()
  return (
    <CustomizeCard
      title={intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.index.timeDeliveryRate',
      })}
      bodyStyle={{ padding: 0, height: '312px' }}
    >
      <TimelyDeliveryRate />
    </CustomizeCard>
  )
}

export default TimelyDeliveryRateContainer
