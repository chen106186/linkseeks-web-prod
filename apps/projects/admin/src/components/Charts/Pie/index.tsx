import { Chart, Axis, Interval, Interaction, Coordinate, Legend, Tooltip, registerShape } from 'bizcharts'
import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { RowProps, ColProps } from 'antd/lib/grid'

import DataSet from '@antv/data-set'
import G2 from '@antv/g2/lib/chart/chart'
import { debounce } from 'lodash'
import { Divider } from 'antd'
import classNames from 'classnames'
import autoHeight from '../autoHeight'
import styles from './index.less'
export interface PieProps {
  animate?: boolean
  color?: string
  colors?: string[]
  height?: number
  margin?: [number, number, number, number]
  hasLegend?: boolean
  padding?: [number, number, number, number]
  percent?: number
  data?: {
    x: string | string
    y: number
  }[]
  inner?: number
  lineWidth?: number
  autoFit?: boolean
  style?: React.CSSProperties
  className?: string
  total?: React.ReactNode | number | (() => React.ReactNode | number)
  title?: React.ReactNode
  tooltip?: boolean
  valueFormat?: (value: string) => string | React.ReactNode
  subTitle?: React.ReactNode
  rowProps?: RowProps
  colProps?: ColProps
}
interface PieState {
  legendData: { checked: boolean; x: string; color: string; percent: number; y: string }[]
  legendBlock: boolean
}
class Pie extends Component<PieProps, PieState> {
  state: PieState = {
    legendData: [],
    legendBlock: true, // 这里默认为 true，为 false 的话会触发相应的 css 设置宽度，从而导致画布容器的宽度过去，图表画不出来报错
  }

  requestRef: number | undefined = undefined

  root: HTMLDivElement | undefined = undefined

  chart: G2 | undefined = undefined

  // for window resize auto responsive legend
  resize = debounce(() => {
    const { hasLegend } = this.props
    const { legendBlock } = this.state
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize)
      return
    }
    if (this.root && this.root.parentNode && (this.root.parentNode as HTMLElement).clientWidth <= 400) {
      if (!legendBlock) {
        this.setState({
          legendBlock: true,
        })
      }
    } else if (legendBlock) {
      this.setState({
        legendBlock: false,
      })
    }
  }, 400)

  componentDidMount() {
    window.addEventListener(
      'resize',
      () => {
        this.requestRef = requestAnimationFrame(() => this.resize())
      },
      { passive: true },
    )
  }

  componentDidUpdate(preProps: PieProps) {
    const { data } = this.props
    if (data !== preProps.data) {
      // because of charts data create when rendered
      // so there is a trick for get rendered time
      this.getLegendData()
    }
  }

  componentWillUnmount() {
    if (this.requestRef) {
      window.cancelAnimationFrame(this.requestRef)
    }
    window.removeEventListener('resize', this.resize)
    if (this.resize) {
      ;(this.resize as any).cancel()
    }
  }

  getG2Instance = (chart: G2) => {
    this.chart = chart
    requestAnimationFrame(() => {
      this.getLegendData()
      this.resize()
    })
  }

  // for custom lengend view
  getLegendData = () => {
    if (!this.chart) return
    const geom = this.chart.geometries[0] // 获取所有的图形
    if (!geom) return
    const items = (geom as any).dataArray || [] // 获取图形对应的

    const legendData = items.map((item: { color: any; _origin: any }[]) => {
      /* eslint no-underscore-dangle:0 */
      const origin = { ...item[0]._origin }
      origin.color = item[0].color
      origin.checked = true
      return origin
    })

    this.setState({
      legendData,
    })
  }

  handleRoot = (n: HTMLDivElement) => {
    this.root = n
  }

  handleLegendClick = (item: any, i: string | number) => {
    const newItem = item
    newItem.checked = !newItem.checked

    const { legendData } = this.state
    legendData[i] = newItem

    const filteredLegendData = legendData.filter((l) => l.checked).map((l) => l.x)

    if (this.chart) {
      this.chart.filter('x', (val) => filteredLegendData.indexOf(`${val}`) > -1)
    }

    this.setState({
      legendData,
    })
  }

  render() {
    const {
      valueFormat,
      subTitle,
      total,
      hasLegend = false,
      className,
      style,
      height = 0,
      autoFit = true,
      percent,
      color,
      inner = 0.75,
      animate = true,
      colors,
      lineWidth = 1,
    } = this.props

    const { legendData, legendBlock } = this.state
    const pieClassName = classNames(styles.pie, className, {
      [styles.hasLegend]: !!hasLegend,
      [styles.legendBlock]: legendBlock,
    })

    const { data: propsData, tooltip: propsTooltip = true, rowProps = {}, colProps = {} } = this.props

    let data = propsData || []
    let tooltip = propsTooltip

    const { gutter: propsGutter, ...rowRest } = rowProps
    const { span: propsSpan, ...colRest } = colProps
    const gutter = propsGutter || [12, 12]
    const span = propsSpan || 12

    const defaultColors = colors
    data = data || []
    tooltip = tooltip || true
    let formatColor

    const scale = {
      x: {
        type: 'cat',
        range: [0, 1],
      },
      y: {
        min: 0,
      },
    }

    if (percent || percent === 0) {
      tooltip = false
      formatColor = (value: string) => {
        if (value === '占比') {
          return color || 'rgba(24, 144, 255, 0.85)'
        }
        return '#F0F2F5'
      }

      data = [
        {
          x: '占比',
          y: parseFloat(`${percent}`),
        },
        {
          x: '反比',
          y: 100 - parseFloat(`${percent}`),
        },
      ]
    }

    const tooltipFormat: [string, (...args: any[]) => { name?: string; value: string }] = [
      'x*y*percent',
      (x: string, y: number, p: number) => ({
        name: x,
        value: `${y}`,
      }),
    ]

    const padding = [12, 0, 12, 0] as [number, number, number, number]

    const { DataView } = DataSet
    const dv = new DataView()
    dv.source(data).transform({
      type: 'percent',
      field: 'y',
      dimension: 'x',
      as: 'percent',
    })

    return (
      <div ref={this.handleRoot} className={pieClassName} style={style}>
        <div className={styles.chart}>
          <Chart
            scale={scale}
            height={height}
            autoFit={autoFit}
            data={dv}
            padding={padding}
            animate={animate}
            onGetG2Instance={this.getG2Instance}
          >
            <Coordinate type="theta" innerRadius={inner} />
            <Axis visible={false} />
            {!!tooltip && <Tooltip showTitle={false} />}
            <Interval
              adjust="stack"
              position="y"
              color={['x', percent || percent === 0 ? formatColor : defaultColors] as any}
              shape="sliceShape"
              tooltip={tooltip ? tooltipFormat : undefined}
            />
            <Legend visible={false} />
            <Interaction type="element-single-selected" />
          </Chart>

          {(subTitle || total) && (
            <div className={styles.total}>
              {subTitle && <h4 className="pie-sub-title">{subTitle}</h4>}
              {/* eslint-disable-next-line */}
              {total && <p className="pie-stat">{typeof total === 'function' ? total() : total}</p>}
            </div>
          )}
        </div>

        {hasLegend && (
          <Row className={styles.legend} gutter={gutter} {...rowRest}>
            {legendData.map((item, i) => (
              <Col
                key={item.x}
                className={styles['legend-item']}
                onClick={() => this.handleLegendClick(item, i)}
                span={span}
                {...colProps}
              >
                <span
                  className={styles.dot}
                  style={{
                    backgroundColor: !item.checked ? '#aaa' : item.color,
                  }}
                />
                <span className={styles.legendTitle}>{item.x}</span>
                {/* <Divider type="vertical" />
                <span className={styles.percent}>
                  {`${(Number.isNaN(item.percent) ? 0 : item.percent * 100).toFixed(2)}%`}
                </span>
                <span className={styles.value}>{valueFormat ? valueFormat(item.y) : item.y}</span> */}
              </Col>
            ))}
          </Row>
        )}
      </div>
    )
  }
}

export default autoHeight()(Pie)
