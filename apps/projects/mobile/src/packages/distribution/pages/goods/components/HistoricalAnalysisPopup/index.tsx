import React, { useState, useEffect, useRef, useMemo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { priceFormat } from '@/utils/numberFormat'
import { getProductMobileCommodityPriceRecordGetPriceRecord } from '@apps/apis'
import Popup from '@/components/Popup'
import MellowCard from '@/components/MellowCard'
import echarts from '@/assets/js/echarts'
import Echarts, { EChartOption, EchartsHandle } from '@/components/Echarts'
import './index.scss'
import { dateFormat } from '@/utils/date'

export interface HistoricalAnalysisPopupProps {
  /**
   * 商品skuId
   */
  skuId: number
  /**
   * 当前价格
   */
  currentPrice: number
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 单位
   */
  unit: string | undefined
}

const interval = [
  {
    key: 7,
    name: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.last7days',
  },
  {
    key: 30,
    name: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.last30days',
  },
  {
    key: 60,
    name: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.last60days',
  },
]

export type HistoryDataType = {
  date: string[]
  price: number[]
}

const HistoricalAnalysisPopup: React.FC<HistoricalAnalysisPopupProps> = (props: HistoricalAnalysisPopupProps) => {
  const { skuId, currentPrice = 0, visible, onClose } = props

  const [current, setCurrent] = useState(7)
  const [min, setMin] = useState(0)
  const [historyData, setHistoryData] = useState<HistoryDataType>()

  const { windowHeight } = getSystemInfoSync()
  const intl = useIntl()
  const echartsRef = useRef<EchartsHandle>(null)

  const getHistoryData = (days: number) => {
    if (!skuId || !visible) {
      return
    }
    getProductMobileCommodityPriceRecordGetPriceRecord({
      commoditySkuId: `${skuId}`,
      days: `${days}`,
    }).then((res) => {
      if (res.code === 1000) {
        const { minPrice, commodityPriceRecordList = [] } = res.data
        setMin(minPrice)
        if (commodityPriceRecordList?.length) {
          const newHistoryData: HistoryDataType = { date: [], price: [] }
          commodityPriceRecordList.map((item) => {
            newHistoryData.date.push(dateFormat(new Date(item.dateTimeStamp), 'MM-DD'))
            newHistoryData.price.push(item.price)
          })

          setHistoryData(newHistoryData)
        }
      }
    })
  }

  useEffect(() => {
    getHistoryData(current)
  }, [skuId, visible])

  const handleTagChange = (key: number) => {
    setCurrent(key)
    getHistoryData(key)
  }

  const handleClose = () => {
    onClose?.()
  }

  const option: EChartOption = useMemo(() => {
    return {
      legend: {
        show: false,
      },
      xAxis: {
        type: 'category',
        data: historyData?.date || [],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: historyData?.price || [],
          type: 'line',
        },
      ],
    }
  }, [historyData])

  return (
    <Popup position="bottom" visible={visible} onClose={handleClose} customClassName="historical-analysis">
      <View className="historical-analysis-container">
        <Text className="historical-analysis-title">
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.title',
            defaultMessage: '历史价格走势',
          })}
        </Text>
        <View
          className="historical-analysis-content"
          style={{ height: pxTransform(parseInt(`${windowHeight * (2 / 3)}`, 10)) }}
        >
          <MellowCard bodyStyle={{ paddingLeft: pxTransform(16), paddingRight: pxTransform(16) }}>
            <View className="statistic-wrap">
              <View className="statistic">
                <Text className="statistic-name">
                  {intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.current',
                    defaultMessage: '当前价格',
                  })}
                </Text>
                <Text className="statistic-value statistic-value__danger">
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  {priceFormat(currentPrice)}
                </Text>
              </View>
              <View className="statistic-line" />
              <View className="statistic">
                <Text className="statistic-name">
                  {intl.formatMessage({
                    id: 'commodityMerge.stocksSourcing.components.historicalAnalysisPopup.min',
                    defaultMessage: '历史最低',
                  })}
                </Text>
                <Text className="statistic-value">
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                  {priceFormat(min)}
                </Text>
              </View>
            </View>
          </MellowCard>
          <View style={{ marginTop: pxTransform(8) }}>
            <MellowCard>
              <View className="tags">
                {interval.map((item) => (
                  <View
                    key={item.key}
                    className={`tags-item ${item.key === current ? 'tags-item__active' : ''}`}
                    onClick={() => handleTagChange(item.key)}
                  >
                    <Text className={`tags-item-name ${item.key === current ? 'tags-item-name__active' : ''}`}>
                      {intl.formatMessage({ id: item.name as any })}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ height: pxTransform(255), marginTop: -50 }}>
                {historyData && (
                  <Echarts
                    echarts={echarts}
                    option={option}
                    ref={echartsRef}
                    isPage={false}
                    canvasId="price_chart"
                    style={{
                      height: '300px',
                    }}
                  />
                )}
              </View>
            </MellowCard>
          </View>
        </View>
      </View>
    </Popup>
  )
}

export default HistoricalAnalysisPopup
