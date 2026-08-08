import React, { useState, useEffect } from 'react'
import { Card, Radio, Row, Col } from 'antd'
import LineChart from './lineChart'
import styles from './index.less'
// 折线图描述
import todayIcon from '@/assets/home-icon-24.png'
import weekIcon from '@/assets/home-icon-25.png'
import monthIcon from '@/assets/home-icon-26.png'
import totalIcon from '@/assets/home-icon-27.png'
import { ImemberData, Ilist } from '../../common/interface'
import { GetReportPlatformHomeGetMemberRegisterListResponse } from '@apps/apis'

export enum TimeEnum {
  WEEK = 1,
  MONTH = 2,
  YEAR = 3,
}

interface Iprops {
  memberData: GetReportPlatformHomeGetMemberRegisterListResponse | null
  loading: boolean
}

const MemberStatistics: React.FC<Iprops> = (props) => {
  const { memberData } = props
  const [timeRadio, setTimeRadio] = useState<TimeEnum>(TimeEnum.WEEK)
  // 设置折线图的data
  const [currentLineChartData, setCurrentLineChartData] = useState<Ilist[]>([])
  const handleChangeTime = (e) => {
    setTimeRadio(e.target.value)
    const dataMap = {
      [TimeEnum.WEEK]: memberData?.weekList,
      [TimeEnum.MONTH]: memberData?.monthList,
      [TimeEnum.YEAR]: memberData?.yearList,
    }
    setCurrentLineChartData(dataMap[e.target.value])
  }

  useEffect(() => {
    if (!memberData) {
      return
    }
    setCurrentLineChartData(memberData.weekList)
  }, [memberData])

  const data = [
    // {
    //   icon: todayIcon,
    //   value: memberData?.todayCount,
    //   tips: '今日注册',
    // },
    {
      icon: weekIcon,
      value: memberData?.weekCount,
      tips: '最近7日注册',
    },
    {
      icon: monthIcon,
      value: memberData?.monthCount,
      tips: '最近30日注册',
    },
    {
      icon: totalIcon,
      value: memberData?.totalCount,
      tips: '累计注册',
    },
  ]
  return (
    <Card
      headStyle={{ borderBottom: 'none' }}
      title="会员统计(截止昨日)"
      bordered={false}
      extra={
        <Radio.Group value={timeRadio} buttonStyle="solid" size="small" onChange={handleChangeTime}>
          <Radio.Button value={TimeEnum.WEEK}>周</Radio.Button>
          <Radio.Button value={TimeEnum.MONTH}>月</Radio.Button>
          <Radio.Button value={TimeEnum.YEAR}>年</Radio.Button>
        </Radio.Group>
      }
    >
      <Row>
        <Col span={24}>
          {/* 折线图 */}
          <LineChart data={currentLineChartData} />
        </Col>
        <Col span={24}>
          <Row>
            {data.map((item) => {
              return (
                <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24} key={item.tips}>
                  <div className={styles.lineDesc}>
                    <img src={item.icon} className={styles.icon} alt="" />
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

export default MemberStatistics
