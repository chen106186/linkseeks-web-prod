import React, { useContext, useState } from 'react'
import { Table, Button, Radio, Divider, Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons'
import style from './index.less'
import winBid from '../../../../../assets/winBid.png'
import { BidDetailContext } from '../../_public/bid/context'

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
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <div className={style.remarkBidReportWrapper}>
        <div className={style.bidMemberContainer}>
          <div className="common-panel-title">中标会员</div>
          <Row gutter={[16, 0]}>
            <Col span={6}>
              <div className={style['card-list']}>
                <h4>广州室间隔度过后工地</h4>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>中标总金额(含税):</p>
                  </Col>
                  <Col>
                    <p className={style.amount}>¥160,000.00</p>
                  </Col>
                </Row>
                <img src={winBid} alt="已中标" />
              </div>
            </Col>
            <Col span={6}>
              <div className={style['card-list']}>
                <h4>广州室间隔度过后工地</h4>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>中标总金额(含税):</p>
                  </Col>
                  <Col>
                    <p className={style.amount}>¥160,000.00</p>
                  </Col>
                </Row>
                <img src={winBid} alt="已中标" />
              </div>
            </Col>
          </Row>
        </div>
        <Divider dashed />
        <div className={style.remarkCommitteeContainer}>
          <div className="common-panel-title">中标理由</div>
          <Row gutter={[16, 0]}>
            <Col span={4}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>中标理由</p>
                  </Col>
                  <Col>
                    <p>七天无理由中标</p>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>中标附件</p>
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
