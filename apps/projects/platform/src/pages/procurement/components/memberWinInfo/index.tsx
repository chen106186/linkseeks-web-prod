import React, { useContext, useState } from 'react'
import { Table, Button, Radio, Divider, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import style from './index.less'
import winBid from '@/assets/imgs/winBid.png'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 会员中标信息
 */

export interface MemberWinInfoProps {
  cardTitle?: string
}

const MemberWinInfo: React.FC<MemberWinInfoProps> = ({ cardTitle }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data, ctl } = bidDetailContext

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 16 }} bordered={false} fullHeight>
      <div className={style.remarkBidReportWrapper}>
        <div className={style.bidMemberContainer}>
          <div className="common-panel-title">{intl.formatMessage({ id: 'table.purchase.zhongbiaohuiyuan' })}</div>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <div className={style['card-list']}>
                <h4>{intl.formatMessage({ id: 'table.purchase.guangzhoushijiange' })}</h4>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.zhongbiaozongjine1' })}:
                    </p>
                  </Col>
                  <Col>
                    <p className={style.amount}>¥160,000.00</p>
                  </Col>
                </Row>
                <img src={winBid} alt={intl.formatMessage({ id: 'table.purchase.yizhongbiao' })} />
              </div>
            </Col>
            <Col span={6}>
              <div className={style['card-list']}>
                <h4>{intl.formatMessage({ id: 'table.purchase.guangzhoushijiange' })}</h4>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.zhongbiaozongjine1' })}:
                    </p>
                  </Col>
                  <Col>
                    <p className={style.amount}>¥160,000.00</p>
                  </Col>
                </Row>
                <img src={winBid} alt={intl.formatMessage({ id: 'table.purchase.yizhongbiao' })} />
              </div>
            </Col>
          </Row>
        </div>
        <Divider dashed />
        <div className={style.remarkCommitteeContainer}>
          <div className="common-panel-title">{intl.formatMessage({ id: 'detail.purchase.label1' })}</div>
          <Row gutter={[16, 0]}>
            <Col span={4}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.label1' })}</p>
                  </Col>
                  <Col>
                    <p>{intl.formatMessage({ id: 'table.purchase.qitianwuliyou' })}</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.zhongbiaofujian' })}
                    </p>
                  </Col>
                  <Col>
                    <p>666.pdf</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </MellowCard>
  )
}

MemberWinInfo.defaultProps = {}

export default MemberWinInfo
