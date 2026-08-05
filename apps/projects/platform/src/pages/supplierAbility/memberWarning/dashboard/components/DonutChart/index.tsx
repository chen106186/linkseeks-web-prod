import { useIntl, getIntl } from '@linkseeks/i18n'
import React from 'react'
import ReactDOM from 'react-dom'
import { DonutChart } from 'bizcharts'

// import * as BizCharts from 'bizcharts'
// import DonutChart from 'bizcharts/lib/plots/DonutChart';

const intl = getIntl()

// 数据源
const data = [
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.classOne' })}`,
    value: 27,
  },
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.classTwo' })}`,
    value: 25,
  },
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.classThree' })}`,
    value: 18,
  },
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.classFour' })}`,
    value: 15,
  },
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.classFive' })}`,
    value: 10,
  },
  {
    type: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.DonutChart.index.other' })}`,
    value: 5,
  },
]

function CommonDonutChart() {
  const nintl = useIntl()
  return (
    <DonutChart
      data={data || []}
      title={null}
      autoFit
      description={null}
      height={312}
      radius={0.8}
      padding="auto"
      angleField="value"
      colorField="type"
      pieStyle={{ stroke: 'white', lineWidth: 5 }}
      label={null}
      statistic={{
        title: {
          formatter: (text) => {
            return `${nintl.formatMessage({
              id: 'member.memberWarning.dashboard.components.DonutChart.index.contractSum',
            })}`
          },
          style: {
            fontSize: '12px',
            color: '#91959B',
          },
        },
        content: {
          formatter: (text) => {
            return '568'
          },
          style: {
            fontSize: '28px',
            color: '#303133',
            marginTop: '12px',
          },
        },
      }}
      legend={{
        visible: false,
      }}
    />
  )
}

export default CommonDonutChart
