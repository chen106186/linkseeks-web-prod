import React from 'react'
import { Chart, Legend, LineAdvance } from 'bizcharts'
import { Ilist } from '../../common/interface'

interface IProps {
  data: Ilist[]
}

const LineChart: React.FC<IProps> = (props) => {
  return (
    <Chart
      height={360}
      autoFit
      data={props.data}
      scale={{
        count: {
          tickInterval: 1,
        },
      }}
    >
      <Legend position="top-left" />
      {/* <Axis name="dateTime" />
      <Axis name="count"/> */}
      <LineAdvance position="dateTime*count" color={'roleName'} point area shape="smooth"></LineAdvance>
    </Chart>
  )
}

export default LineChart
