import React, { useContext } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '../../_public/bid/context'
import style from './index.less'
import CustomTag from '../customTag'

/**
 * 会员参标信息
 */

export interface ParticipateInfoProps {
  cardTitle?: string
}

const ParticipateInfo: React.FC<ParticipateInfoProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data, ctl } = bidDetailContext

  const mockData = [
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: true,
      status: 1,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: false,
      status: 1,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: false,
      status: 2,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: true,
      status: 1,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },

    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: true,
      status: 0,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: true,
      status: 1,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
    {
      company: '广州第三个官方工地公司',
      amount: 13516,
      isTax: true,
      status: 2,
      createTime: '2012-12-14 23:35:43',
      no: 'HEGF05495',
    },
  ]

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <div className={style.participateWrapper}>
        <Row gutter={[16, 0]}>
          {mockData.map((item, index) => (
            <Col span={4} key={index}>
              <div className={style.participateContent}>
                <div className={style.topWrapper}>
                  <div>{item.company}</div>
                  <p className={style.amount}>
                    ￥{item.amount}
                    <span>{item.isTax ? ' (含税)' : ' (不含税)'}</span>
                  </p>
                </div>
                <div className={style.contentWrapper}>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      环节状态:
                    </Col>
                    <Col>
                      <CustomTag type="out" status={item.status} />
                    </Col>
                  </Row>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      投标时间:
                    </Col>
                    <Col>{item.createTime}</Col>
                  </Row>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      投标单号:
                    </Col>
                    <Col>{item.no}</Col>
                  </Row>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </MellowCard>
  )
}

ParticipateInfo.defaultProps = {}

export default ParticipateInfo
