import React from 'react'
import { Row, Col, Card, Badge } from 'antd'
import styles from './index.less'

// 数据风控图标
import dataRiskIcon1 from '@/assets/home-icon-1.png'
import dataRiskIcon2 from '@/assets/home-icon-2.png'

interface Iprops {}

const RiskCenter: React.FC<Iprops> = () => {
  const data = [
    {
      title: '预警规则',
      icon: dataRiskIcon1,
    },
    {
      title: '预警控制台',
      icon: dataRiskIcon2,
    },
    {
      title: '预警处理',
      icon: dataRiskIcon1,
    },
  ]
  return (
    <Card
      headStyle={{ borderBottom: 'none' }}
      title={
        <>
          <p>风控中心</p>
          <p className={styles.dataRiskTip}>全面的风控体系，监控交易异常、资金异常、行为异常，并实时预警</p>
        </>
      }
      bordered={false}
      extra={<a href="#">进入风控中心</a>}
    >
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          return (
            <Col xxl={4} xl={6} lg={6} md={8} sm={12} xs={24} key={item.title}>
              <div className={styles.item}>
                <img src={item.icon} className={styles.icon} alt="" />
                <span>
                  {item.title} <Badge count={4} size="small" />
                </span>
              </div>
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}

export default RiskCenter
