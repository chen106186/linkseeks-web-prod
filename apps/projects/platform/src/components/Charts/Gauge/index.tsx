import { Axis, Chart, Coordinate, Point, Annotation, registerShape } from 'bizcharts'
import React from 'react'
import autoHeight from '../autoHeight'
import { getIntl } from '@linkseeks/i18n'

export interface GaugeProps {
  title: React.ReactText
  color?: string
  height: number
  bgColor?: number
  percent: number
  autoFit?: boolean
  style?: React.CSSProperties
  formatter?: (value: string) => string
  // 格式化内容
  formatContent?: (value: number) => string
  /**
   * 线条宽度
   */
  strokeWidth?: number
}

const defaultFormatter = (val: string): string => {
  const intl = getIntl()
  switch (val) {
    case '2':
      return intl.formatMessage({ id: 'components.cha' })
    case '4':
      return intl.formatMessage({ id: 'components.zhong' })
    case '6':
      return intl.formatMessage({ id: 'components.liang' })
    case '8':
      return intl.formatMessage({ id: 'components.you' })
    default:
      return ''
  }
}

const defaultFormatContent = (val: number) => {
  return `${(val * 10).toFixed(2)} %`
}

registerShape('point', 'pointer', {
  draw(cfg: any, group: any) {
    let point = cfg.points[0]
    point = (this as any).parsePoint(point)
    // 获取极坐标系下画布中心点
    const center = (this as any).parsePoint({
      x: 0,
      y: 0,
    })
    // 绘制指针
    group.addShape('line', {
      attrs: {
        x1: center.x,
        y1: center.y,
        x2: point.x,
        y2: point.y,
        stroke: cfg.color,
        lineWidth: 2,
        lineCap: 'round',
      },
    })
    return group.addShape('circle', {
      attrs: {
        x: center.x,
        y: center.y,
        r: 4,
        stroke: cfg.color,
        lineWidth: 3,
        fill: '#fff',
      },
    })
  },
})

const Gauge: React.FC<GaugeProps> = (props) => {
  const {
    title,
    height = 1,
    percent,
    autoFit = true,
    formatter = defaultFormatter,
    formatContent = defaultFormatContent,
    color = '#2F9CFF',
    bgColor = '#F0F2F5',
    strokeWidth = 10,
  } = props
  const cols = {
    value: {
      type: 'linear',
      min: 0,
      max: 10,
      tickCount: 6,
      nice: true,
    },
  }

  const data = [{ value: percent / 10 }]

  const textStyle: {
    fontSize: number
    fill: string
    textAlign: 'center'
  } = {
    fontSize: 12,
    fill: 'rgba(0, 0, 0, 0.65)',
    textAlign: 'center',
  }

  return (
    <Chart height={height} data={data} scale={cols} padding={[-16, 0, 16, 0]} autoFit={autoFit}>
      <Coordinate type="polar" startAngle={-1.23 * Math.PI} endAngle={0.23 * Math.PI} radius={0.8} />
      <Axis name="1" line={undefined} />
      <Axis
        name="value"
        line={null}
        label={{
          offset: -24,
          formatter,
          style: textStyle,
        }}
        subTickLine={null}
        tickLine={null}
        grid={null}
      />
      <Point position="value*1" color={color} shape="pointer" animate={false} />
      <Annotation.Arc
        top={false}
        start={[0, 0.965]}
        end={[10, 0.965]}
        style={{
          stroke: bgColor,
          lineWidth: strokeWidth,
          lineDash: null,
        }}
      />
      <Annotation.Arc
        start={[0, 0.965]}
        end={[data[0].value, 0.965]}
        style={{
          stroke: color,
          lineWidth: strokeWidth,
          lineDash: null,
        }}
      />
      <Annotation.Text
        position={['50%', '87%']}
        content={title}
        style={{
          fontSize: 24,
          fill: '#303133',
          textAlign: 'center',
          fontWeight: 500,
        }}
      />
      <Annotation.Text
        position={['50%', '92%']}
        content={formatContent(data[0].value)}
        style={{
          fontSize: 12,
          fill: '#909399',
          textAlign: 'center',
        }}
        offsetY={15}
      />
    </Chart>
  )
}

export default autoHeight()(Gauge)
