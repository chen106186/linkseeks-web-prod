import React, { useContext, useState } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { ReadyConfirmBidContext } from '@/pages/procurement/_public/bid/context'
import style from './index.less'
import CustomTag from '@/pages/procurement/components/customTag'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/**
 * 会员参标信息 待审核专用
 */

export interface ParticipateInfoProps {
  cardTitle?: string
}

const ParticipateInfo: React.FC<ParticipateInfoProps> = ({ cardTitle }) => {
  const { data, ctl } = useContext(ReadyConfirmBidContext)

  const [participateList, setParticipateList] = useState<any>(() => {
    return data.memberList.map((item) => ({
      company: item.memberName,
      amount: item.submitTender
        ? item.submitTender.submitTenderMateriel.reduce((a, b) => a + b.price * b.inviteTenderMateriel.count, 0)
        : 0,
      // @todo 多物料下有问题，一个含税一个不含税，如何显示？ 先写死
      isTax: true,
      status: item.submitTenderOutStatusValue,
      createTime: formatTimeString(item.submitTenderTime),
      no: item.code,
    }))
  })

  return (
    <div id="participateInfo">
      <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
        <div className={style.participateWrapper}>
          <Row gutter={[16, 0]}>
            {participateList.map((item, index) => (
              <Col span={4} lg={6} key={index}>
                <div className={style.participateContent}>
                  <div className={style.topWrapper}>
                    <div>{item.company}</div>
                    <p className={style.amount}>
                      {translate('web.common.currencySymbol')}
                      {item.amount.toFixed(2)}
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
                        {/* <CustomTag type="tenderOut" status={item.status} /> */}
                        {item.status}
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
    </div>
  )
}

ParticipateInfo.defaultProps = {}

export default ParticipateInfo
