import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction,
  Legend,
  // getTheme
} from 'bizcharts'

function Labelline() {
  const intl = useIntl()
  const data = [
    {
      item: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.MemberEvaluateScore.scoreChart.caseOne',
      })}`,
      count: 40,
      percent: 0.4,
    },
    {
      item: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.MemberEvaluateScore.scoreChart.caseTwo',
      })}`,
      count: 21,
      percent: 0.21,
    },
    {
      item: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.MemberEvaluateScore.scoreChart.caseThree',
      })}`,
      count: 17,
      percent: 0.17,
    },
    {
      item: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.MemberEvaluateScore.scoreChart.caseFour',
      })}`,
      count: 13,
      percent: 0.13,
    },
    {
      item: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.MemberEvaluateScore.scoreChart.caseFive',
      })}`,
      count: 9,
      percent: 0.09,
    },
  ]

  const cols = {
    percent: {
      formatter: (val) => {
        val = val * 100 + '%'
        return val
      },
    },
  }

  return (
    <Chart height={300} padding={[16, 16]} data={data} scale={cols} autoFit>
      <Legend visible={false} />
      <Coordinate type="theta" radius={0.75} />
      <Tooltip showTitle={false} />
      <Axis visible={false} />
      <Interval
        position="percent"
        adjust="stack"
        color="item"
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
        label={[
          'count',
          {
            content: (data) => {
              return `${data.item}: ${data.percent * 100}%`
            },
          },
        ]}
        state={{
          selected: {
            style: (t) => {
              // const res = getTheme().geometries.interval.rect.selected.style(t);
              return { fill: 'red' }
            },
          },
        }}
      />
      <Interaction type="element-single-selected" />
    </Chart>
  )
}

export default Labelline
