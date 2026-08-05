import React, { useState, useEffect } from 'react'
import { Card, Radio, Row, Col } from 'antd'
import styles from './index.less'
import ColumnChart from './columnChart'

// 折线图描述
import todayIcon from '@/assets/home-icon-24.png'
import weekIcon from '@/assets/home-icon-25.png'
import monthIcon from '@/assets/home-icon-26.png'
import totalIcon from '@/assets/home-icon-27.png'
import { TimeEnum, IorderData, Ilist } from '../../common/interface'
import { GetReportPlatformHomeGetOrderListResponse } from '@apps/apis'

interface Iprops {
  orderData: GetReportPlatformHomeGetOrderListResponse | null
  loading: boolean
  height?: number
  title?: string
}

const OrderStatistics: React.FC<Iprops> = (props) => {
  const { orderData, loading, height, title } = props
  const [timeRadio, setTimeRadio] = useState<TimeEnum>(TimeEnum.WEEK)
  const [currentChartData, setCurrentChartData] = useState<{ dateTime: {}; count: number; amount: number }[]>([])
  const handleChangeTime = (e) => {
    setTimeRadio(e.target.value)
    const dataMap = {
      [TimeEnum.WEEK]: orderData!.weekList,
      [TimeEnum.MONTH]: orderData!.monthList,
      [TimeEnum.YEAR]: orderData!.yearList,
    }
    setCurrentChartData(dataMap[e.target.value])
  }

  useEffect(() => {
    if (!orderData) {
      return
    }
    setCurrentChartData(orderData?.weekList)
  }, [orderData])
  const data = [
    // {
    //   icon: todayIcon,
    //   value: orderData?.todayAmount || 0,
    //   tips: `今日营业额（${orderData?.todayCount || 0}单）`,
    // },
    {
      icon: weekIcon,
      value: orderData?.weekAmount,
      tips: `最近7日营业额（${orderData?.weekCount || 0}单）`,
    },
    {
      icon: monthIcon,
      value: orderData?.monthAmount,
      tips: `最近30日营业额（${orderData?.monthCount || 0}单）`,
    },
    {
      icon: totalIcon,
      value: orderData?.totalAmount,
      tips: `累计营业额（${orderData?.totalCount || 0}单）`,
    },
  ]
  return (
    <Card
      headStyle={{ borderBottom: 'none' }}
      title={`${title}(截止昨日)`}
      bordered={false}
      loading={loading}
      extra={
        <Radio.Group value={timeRadio} buttonStyle="solid" size="small" onChange={handleChangeTime}>
          <Radio.Button value={TimeEnum.WEEK}>周</Radio.Button>
          <Radio.Button value={TimeEnum.MONTH}>月</Radio.Button>
          <Radio.Button value={TimeEnum.YEAR}>年</Radio.Button>
        </Radio.Group>
      }
    >
      <Row style={{ margin: '36px 0 0 0' }}>
        <Col span={24}>
          {/* 折线图 */}
          <ColumnChart data={currentChartData} height={height!} />
        </Col>
        <Col span={24}>
          <Row>
            {data.map((item, key) => {
              return (
                <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24} key={key}>
                  <div className={styles.lineDesc}>
                    <img src={item.icon} className={styles.icon} />
                    <div className={styles.lineDescText}>
                      <p className={styles.lineDescTitle}>{item.value}</p>
                      <p className={styles.lineDescTip}>{item.tips}</p>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

OrderStatistics.defaultProps = {
  height: 302,
  title: '采购统计',
}

export default OrderStatistics
