import { getIntl } from '@linkseeks/i18n'
import React from 'react'
import { Axis, Chart, LineAdvance } from 'bizcharts'
// import LineAdvance from 'bizcharts/lib/geometry/LineAdvance'

type DataType = {
  month: string
  value: number
}

const intl = getIntl()

const data: DataType[] = [
  {
    month: `${intl.formatMessage({
      id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.january',
    })}`,
    value: 95,
  },
  {
    month: `${intl.formatMessage({
      id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.february',
    })}`,
    value: 80,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.march' })}`,
    value: 85,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.april' })}`,
    value: 97.5,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.may' })}`,
    value: 66,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.june' })}`,
    value: 60,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.july' })}`,
    value: 95,
  },
  {
    month: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.TimelyDeliveryRate.chart.august' })}`,
    value: 0,
  },
]

const TimelyDeliveryRate = () => {
  return (
    <Chart padding={[10, 20, 50, 40]} autoFit height={300} data={data}>
      <LineAdvance
        shape="smooth"
        point
        area
        position="month*value"
        // color="city"
      />
      <Axis
        name="value"
        label={{
          formatter: (val) => `${val}亿`,
        }}
      />
    </Chart>
  )
}

export default TimelyDeliveryRate
