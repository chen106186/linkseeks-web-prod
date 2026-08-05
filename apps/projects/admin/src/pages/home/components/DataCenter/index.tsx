import React from 'react'
import styles from './index.less'
import { Row, Col, Card } from 'antd'

// 数据风控图标
import dataRiskIcon3 from '@/assets/home-icon-3.png'
import dataRiskIcon4 from '@/assets/home-icon-4.png'
import dataRiskIcon5 from '@/assets/home-icon-5.png'
import dataRiskIcon6 from '@/assets/home-icon-6.png'
import dataRiskIcon7 from '@/assets/home-icon-7.png'
import dataRiskIcon8 from '@/assets/home-icon-8.png'

const DataCenter: React.FC = () => {
  const data = [
    {
      title: '网站运营数据',
      icon: dataRiskIcon3,
    },
    {
      title: 'APP运营数据',
      icon: dataRiskIcon4,
    },
    {
      title: '用户分析',
      icon: dataRiskIcon5,
    },
    {
      title: '商品分析',
      icon: dataRiskIcon6,
    },
    {
      title: '交易分析',
      icon: dataRiskIcon7,
    },
    {
      title: '售后分析',
      icon: dataRiskIcon8,
    },
  ]
  return (
    <Card
      headStyle={{ borderBottom: 'none' }}
      title={
        <>
          <p>数据中心</p>
          <p className={styles.dataRiskTip}>实时展示会员数据、交易数据等综合指标的动态趋势，满足数据化运营的需要</p>
        </>
      }
      bordered={false}
      extra={<a href="#">进入数据中心</a>}
    >
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          return (
            <Col xxl={4} xl={6} lg={6} md={8} sm={12} xs={24} key={item.title}>
              <div className={styles.item}>
                <img src={item.icon} className={styles.icon} alt="" />
                <span>{item.title}</span>
              </div>
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}
export default DataCenter
