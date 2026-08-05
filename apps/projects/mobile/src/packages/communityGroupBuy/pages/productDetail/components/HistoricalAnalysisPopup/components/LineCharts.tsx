import React, { Component } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import { EChart } from '@/components/EchartsTaro3React'
import './index.scss'

export type HistoryDataType = {
  date: string[]
  price: number[]
}

interface LineChartsProps {
  /**
   * 数据
   */
  historyData: HistoryDataType
  /**
   * 单位
   */
  unit: string | undefined
}

export default class LineCharts extends Component<LineChartsProps> {
  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.historyData !== this.props.historyData) {
      this.refresh()
    }
  }

  /**
   * 刷新折线图
   * @returns
   */
  refresh = () => {
    const { historyData, unit } = this.props
    if (!historyData) {
      return
    }
    const { date, price } = historyData || {}
    if (!date?.length && !price?.length) {
      return
    }
    const option = {
      xAxis: {
        type: 'category',
        data: date,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: (value: number) => {
            const time = new Date(+value)
            return `${time.getMonth() + 1}-${time.getDate()}`
          },
        },
        axisTick: {
          show: false,
        },
        boundaryGap: true,
      },
      yAxis: {
        type: 'value',
        name: unit
          ? `${getIntl().formatMessage({
              id: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.unitPrice',
              defaultMessage: '单价',
            })}(${unit})`
          : '',
        nameTextStyle: {
          align: 'right',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          type: 'line',
          name: getIntl().formatMessage({
            id: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.price',
            defaultMessage: '价格',
          }),
          showSymbol: false,
          data: price,
          lineStyle: {
            color: '#EF3346',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12,
        },
        formatter: (params: any[]) => {
          const time = new Date(+params[0].name)
          return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}\n${
            params[0].seriesName
          }：${getIntl().formatMessage({ id: 'currency', defaultMessage: '¥' })} ${params[0].value}`
        },
        axisPointer: {
          animation: false,
        },
      },
      grid: {
        top: '12%',
        left: '13.5%',
        right: '6%',
        bottom: '10%',
      },
    }
    this.lineChart.refresh(option)
  }

  lineChart: any

  refLineChart = (node) => (this.lineChart = node)

  render() {
    return (
      <View className="line-chart">
        <EChart ref={this.refLineChart} canvasId="bar-canvas" />
      </View>
    )
  }
}
