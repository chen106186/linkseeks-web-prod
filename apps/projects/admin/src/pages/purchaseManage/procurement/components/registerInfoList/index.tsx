import React, { useContext, useState } from 'react'
import { Row, Col } from 'antd'
import MellowCard from '@/components/MellowCard'
import { BidDetailContext } from '@/pages/purchaseManage/procurement/_public/bid/context'
import style from './index.less'

/**
 * 招标详情 报名信息列表/资格预审信息列表
 */

export interface RegisterInfoListProps {
  cardTitle?: string
  /** registerList 报名信息列表 preCheckList 资格预审列表 */
  type?: string
}

const RegisterInfoList: React.FC<RegisterInfoListProps> = ({ cardTitle, type = 'registerList' }) => {
  const bidDetailContext = useContext(BidDetailContext)
  const { data, ctl } = bidDetailContext

  console.log(data, 'data')

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} fullHeight>
      <div className={style.remarkBidReportWrapper}>
        {type === 'registerList' ? (
          <div className={style.bidMemberContainer}>
            <Row gutter={[16, 0]}>
              {data && data.memberList.length
                ? data.memberList.map(
                    (item, index) =>
                      item?.submitTenderRegister && (
                        <Col key={item.id} span={6}>
                          <div className={style['card-list']}>
                            <h4>
                              <span className={style['badge']}>{++index}</span>
                              {item.memberName}
                            </h4>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>联系人姓名:</p>
                              </Col>
                              <Col>
                                <p>{item.submitTenderRegister.name}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>联系人手机:</p>
                              </Col>
                              <Col>
                                <p>{item.submitTenderRegister.phone}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>联系人邮箱:</p>
                              </Col>
                              <Col>
                                <p>{item.submitTenderRegister.email}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>地址:</p>
                              </Col>
                              <Col>
                                <p>{`${item.submitTenderRegister.provinceName}${item.submitTenderRegister.cityName}${item.submitTenderRegister.regionName}${item.submitTenderRegister.address}`}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col span={8}>
                                <p className={style['card-list_title']}>报名文件:</p>
                              </Col>
                              <Col>
                                <p>
                                  {item?.registerFile?.length
                                    ? item.registerFile.map((_item) => (
                                        <a key={_item.id} href={_item.url}>
                                          {_item.name}
                                        </a>
                                      ))
                                    : null}
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      ),
                  )
                : null}
            </Row>
          </div>
        ) : (
          <div className={style.bidMemberContainer}>
            <Row gutter={[16, 0]}>
              {data && data.memberList.length
                ? data.memberList.map((item, index) => (
                    <Col span={6}>
                      <div className={style['card-list']}>
                        <h4>
                          <span className={style['badge']}>{++index}</span>
                          {item.memberName}
                        </h4>
                        <Row>
                          <Col span={8}>
                            <p className={style['card-list_title']}>资格预审文件:</p>
                          </Col>
                          <Col>
                            <p>
                              {item?.qualificationsFile?.length
                                ? item.qualificationsFile.map((_item) => (
                                    <a key={_item.id} href={_item.url}>
                                      {_item.name}
                                    </a>
                                  ))
                                : null}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))
                : null}
            </Row>
          </div>
        )}
      </div>
    </MellowCard>
  )
}

RegisterInfoList.defaultProps = {}

export default RegisterInfoList
