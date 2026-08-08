import React from 'react'
import {
  Chart,
  // Interval,
  Axis,
  Tooltip,
  Coordinate,
  Legend,
  View,
} from 'bizcharts'
import Interval from 'bizcharts/lib/geometry/Interval'
import { Text } from 'bizcharts/lib/components/Annotation'

import DataSet from '@antv/data-set'

const PieItem = () => {
  const { DataView } = DataSet
  const userData = [
    { type: '睡觉', value: 70 },
    { type: '晨练', value: 30 },
  ]
  const userDv = new DataView()
  userDv.source(userData).transform({
    type: 'percent',
    field: 'value',
    dimension: 'type',
    as: 'percent',
  })

  return (
    <Chart placeholder={false} height={60} width={60} padding={0} autoFit>
      <Legend visible={false} />
      {/* 绘制图形 */}
      <View
        data={userDv.rows}
        scale={{
          percent: {
            formatter: (val) => {
              return (val * 100).toFixed(2) + '%'
            },
          },
        }}
      >
        <Tooltip shared showTitle={false} />
        <Coordinate type="theta" innerRadius={0.75} />
        <Interval
          position="percent"
          adjust="stack"
          color={['type', ['#FFC400', '#6C9CEB']]}
          // color="type"
          // label={['type', {offset: 40}]}
        />
        <Text
          position={['50%', '50%']}
          content="75%"
          style={{
            lineHeight: 64,
            fontSize: 10,
            fill: '#262626',
            textAlign: 'center',
          }}
        />
      </View>
    </Chart>
  )
}

export default PieItem
