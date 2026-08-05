import React from 'react'
import { Axis, Chart, Geom, Tooltip } from 'bizcharts'
import { IAxis } from 'bizcharts/lib/components/Axis'
import autoHeight from '../autoHeight'
import styles from './index.less'
import { ShapeString, ShapeAttrCallback, IChartProps } from 'bizcharts/lib/interface'

export interface MiniAreaProps {
  color?: string
  height?: number
  borderColor?: string
  line?: boolean
  animate?: boolean
  xAxis?: IAxis
  autoFit?: boolean
  scale?: {
    x?: {
      tickCount?: number
      alias?: string
    }
    y?: {
      tickCount?: number
      alias?: string
    }
  }
  yAxis?: Partial<IAxis>
  borderWidth?: number
  data: {
    x: number | string
    y: number
  }[]
  padding?: number | number[] | 'auto'
  borderShape?: ShapeString | ShapeString | [ShapeString, ShapeString[] | ShapeAttrCallback]
}

const MiniArea: React.FC<MiniAreaProps> = (props) => {
  const {
    height = 1,
    data = [],
    autoFit = true,
    color = 'rgba(24, 144, 255, 0.2)',
    borderColor = '#1089ff',
    scale = { x: {}, y: {} },
    borderWidth = 2,
    line,
    xAxis,
    yAxis,
    animate = true,
    padding,
    borderShape = 'line',
  } = props

  const newPadding = padding || [36, 5, 30, 5]

  const scaleProps = {
    x: {
      type: 'cat',
      range: [0, 1],
      ...scale.x,
    },
    y: {
      min: 0,
      ...scale.y,
    },
  }

  const tooltip: [string, (...args: any[]) => { name?: string; value: string }] = [
    'x*y',
    (x: string, y: string) => ({
      name: x,
      value: y,
    }),
  ]

  const chartHeight = height + 54

  return (
    <div className={styles.miniChart} style={{ height }}>
      <div className={styles.chartContent}>
        {height > 0 && (
          <Chart
            animate={animate}
            scale={scaleProps}
            height={chartHeight}
            autoFit={autoFit}
            data={data}
            padding={newPadding}
          >
            <Axis key="axis-x" name="x" label={null} line={null} tickLine={null} grid={null} {...xAxis} />
            <Axis key="axis-y" name="y" label={null} line={null} tickLine={null} grid={null} {...yAxis} />
            <Tooltip showTitle={false} />
            <Geom
              type="area"
              position="x*y"
              color={color}
              tooltip={tooltip}
              // shape="smooth"
              style={{
                fillOpacity: 0.3,
              }}
            />
            {line ? (
              <Geom
                type="line"
                position="x*y"
                shape={borderShape}
                color={borderColor}
                size={borderWidth}
                tooltip={false}
              />
            ) : (
              <span style={{ display: 'none' }} />
            )}
          </Chart>
        )}
      </div>
    </div>
  )
}

export default autoHeight()(MiniArea)
