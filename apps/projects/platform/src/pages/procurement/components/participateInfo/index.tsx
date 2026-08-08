import React, { useContext, useState } from 'react'
import { Table, Button, Radio, Tooltip, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import style from './index.less'
import CustomTag from '../customTag'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
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
    <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
      <div className={style.participateWrapper}>
        <Row gutter={[16, 0]}>
          {mockData.map((item, index) => (
            <Col span={4} key={index}>
              <div className={style.participateContent}>
                <div className={style.topWrapper}>
                  <div>{item.company}</div>
                  <p className={style.amount}>
                    {translate('web.common.currencySymbol')}
                    {item.amount}
                    <span>
                      {item.isTax
                        ? intl.formatMessage({ id: 'detail.purchase.isTax' })
                        : intl.formatMessage({ id: 'table.purchase.buhanshui' })}
                    </span>
                  </p>
                </div>
                <div className={style.contentWrapper}>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.huanjiezhuangtai' })}:
                    </Col>
                    <Col>
                      <CustomTag type="tenderOut" status={item.status} />
                    </Col>
                  </Row>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.tenderStartTime' })}:
                    </Col>
                    <Col>{item.createTime}</Col>
                  </Row>
                  <Row className={style['card-list']}>
                    <Col span={8} className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.toubiaodanhao' })}:
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
