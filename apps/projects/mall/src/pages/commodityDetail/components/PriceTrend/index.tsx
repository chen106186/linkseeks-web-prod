import React, { useEffect, useState, useRef } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
// import { Chart, Path } from 'bizcharts'
import { LineConfig } from '@ant-design/plots'
import IconFont from '@/utils/iconfont'
import cx from 'classnames'
import { getProductMobilePriceCurveSetGetIsShowPriceCurve, getProductPriceCommodityGetPriceRecord } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import LineChart from '@/components/LineChart'
import styles from './index.module.less'
import { dateFormat } from '@apps/design-ui/src/utils/date'

interface InterestedPropsType {
  selectCommodityId: number | string // 选中的sku id
  id: number // 商品id
  mallId: number // 商城id
  commodityPriceInfo: any
}

interface PriceRecordType {
  commodityId: number
  date: string
  id: number
  price: number
}

interface PriceRecordDataType {
  commodityPriceRecordList: Array<PriceRecordType>
  minPrice: number | string
}

interface ScalePriceType {
  min: number
  max?: number
}

const PriceTrend: React.FC<InterestedPropsType> = (props) => {
  const { selectCommodityId, id, mallId, commodityPriceInfo = [] } = props
  const translate = getWebIntl()
  const [screenValue, setscreenValue] = useState<number>(7)
  const [priceRecordData, setPriceRecordData] = useState<PriceRecordDataType>()
  const [scalePrice] = useState<ScalePriceType>({ min: 0 })
  const [isShowPriceCurve, setIsShowPriceCurve] = useState<boolean>(false)

  const daysRef = useRef<number>(7)

  const SCREEN_OPTIONS = [
    { label: translate('web.resource.mall.jinyizhou'), value: 7 },
    { label: translate('web.resource.mall.jinyiyue'), value: 30 },
    { label: translate('web.resource.mall.jinsanyue'), value: 90 },
  ]

  // 筛选近一周/近一月/近三月
  const changeScreenValue = ({ target: { value } }: RadioChangeEvent) => {
    daysRef.current = value
    setscreenValue(value)
  }

  // 查询是否显示价格曲线
  const getIsShowPriceCurve = () => {
    const params: any = {
      commodityId: id,
    }
    getProductMobilePriceCurveSetGetIsShowPriceCurve(params, { headers: { shopId: mallId } }).then((res: any) => {
      const { code, data } = res
      if (code === 1000) {
        setIsShowPriceCurve(data)
      }
    })
  }

  // 获取曲线数据
  const getPriceRecord = (commoditySkuId: number | string) => {
    const params: any = {
      commoditySkuId,
      days: daysRef.current,
    }
    getProductPriceCommodityGetPriceRecord(params).then((res: any) => {
      const { code, data } = res
      if (code === 1000) {
        setPriceRecordData(data)
      }
    })
  }

  useEffect(() => {
    if (isShowPriceCurve) {
      getPriceRecord(selectCommodityId)
    }
  }, [selectCommodityId, screenValue, isShowPriceCurve])

  useEffect(() => {
    getIsShowPriceCurve()
  }, [])

  const config: LineConfig = {
    data: priceRecordData?.commodityPriceRecordList || [],
    xField: 'date',
    yField: 'price',
    height: 270,
    axis: {
      y: {
        grid: true,
        labelFill: '#909399',
      },
      x: {
        labelLineWidth: 10,
        labelFill: '#909399',
        grid: false,
        labelFormatter: (datum) => {
          return dateFormat(new Date(datum), 'MM-DD')
        },
      },
    },
    point: {
      shapeField: 'circle',
      sizeField: 3,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  }

  return isShowPriceCurve ? (
    <div className={cx(styles.price_trend)}>
      <div className={styles.price_trend_btn}>
        <div className={styles.price_trend_btn_con}>
          <IconFont className={styles.price_trend_btn_con_icon} type="icon-price-trend" style={{ fontSize: 16 }} />
        </div>
        <div className={styles.price_trend_chart}>
          <div className={styles.price_trend_chart_header}>
            <div className={styles.price_trend_chart_header_extreme}>
              <span>
                {translate('web.resource.mall.dangqianjia')}：{translate('web.common.currencySymbol')}
                {commodityPriceInfo[0]?.price || '-'}
              </span>
              <span>
                {translate('web.resource.mall.zuidijia')}：{translate('web.common.currencySymbol')}
                {priceRecordData?.minPrice}
              </span>
            </div>
            <div className={styles.price_trend_chart_header_screen}>
              <Radio.Group
                onChange={changeScreenValue}
                options={SCREEN_OPTIONS}
                value={screenValue}
                optionType="button"
              />
            </div>
          </div>
          <LineChart config={config} />

          {/* <Chart
            height={270}
            autoFit
            data={priceRecordData?.commodityPriceRecordList || []}
            scale={{ price: scalePrice }}
          >
            <Path
              animate={{
                appear: { duration: 1000, easing: 'easeLinear' },
              }}
              color="#E8684A"
              shape="smooth"
              position="date*price"
            />
          </Chart> */}
        </div>
      </div>
    </div>
  ) : null
}

export default PriceTrend
