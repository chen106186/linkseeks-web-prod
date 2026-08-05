import React from 'react'
// import { Chart, Interval } from 'bizcharts';
import { Chart, Tooltip, Point, Line, Interval } from 'bizcharts'

interface IProps {
  data: {
    dateTime: string | {}
    count: number
    amount: number
  }[]
  height: number
}

const colors = ['#6394f9', '#62daaa']
const ColumnChart: React.FC<IProps> = (props) => {
  const { data, height } = props
  return (
    <Chart height={height} autoFit data={data}>
      <Tooltip shared />
      <Interval
        tooltip={[
          'dateTime*count',
          (text, num) => {
            return {
              name: '订单数',
              value: num,
            }
          },
        ]}
        position="dateTime*count"
        color={colors[0]}
      />
      <Line
        tooltip={[
          'dateTime*amount',
          (text, num) => {
            return {
              name: '营业额',
              value: num,
            }
          },
        ]}
        position="dateTime*amount"
        color={colors[1]}
        size={3}
        shape="smooth"
      />
      <Point
        position="dateTime*amount"
        tooltip={[
          'dateTime*amount',
          (text, num) => {
            return {
              name: '营业额',
              value: num,
            }
          },
        ]}
        color={colors[1]}
        size={3}
        shape="circle"
      />
    </Chart>
  )
}

ColumnChart.defaultProps = {
  height: 302,
}

export default ColumnChart
