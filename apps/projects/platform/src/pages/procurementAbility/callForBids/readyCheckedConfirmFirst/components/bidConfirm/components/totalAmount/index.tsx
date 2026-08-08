import React from 'react'
import { Divider, Row, Col } from 'antd'
import style from '../../index.less'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/**
 * 招标定标表格底部的 合计模块  待审核专用
 */

export interface TotalAmountProps {
  /** 所有需要的数据 */
  datas: any
  columns: any
}

export const TotalAmount: React.FC<TotalAmountProps> = ({ datas, columns }) => {
  return (
    <div className={style.totalWrapper}>
      <Row>
        <Col span={4} lg={6}></Col>
        <Col span={4} lg={6}></Col>
        {columns.map((item, index) =>
          index > 1 ? (
            <Col span={4} lg={6}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>{intl.formatMessage({ id: 'detail.purchase.label34' })}:</p>
                  </Col>
                  <Col>
                    <p>
                      ¥{datas.reduce((a, b) => a + b[item.dataIndex]['price'] * b.count, 0).toFixed(2)}(
                      {intl.formatMessage({ id: 'detail.purchase.isTax' })})
                    </p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.offerRank' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{index - 1}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          ) : null,
        )}
      </Row>
      <Divider dashed={true} style={{ margin: 0, marginBottom: 8 }} />
      <Row>
        <Col span={4} lg={6}></Col>
        <Col span={4} lg={6}></Col>
        {columns.map((item, index) =>
          index > 1 ? (
            <Col span={4} lg={6}>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.shoubiaoshuliang' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{datas.reduce((a, b) => a + (b[item.dataIndex]['isAwardTender'] ? 1 : 0), 0)}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'table.purchase.shoubiaozonge' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>
                      ¥
                      {datas
                        .reduce(
                          (a, b) =>
                            a +
                            (b[item.dataIndex]['isAwardTender']
                              ? (b[item.dataIndex]['price'] * b.count * b[item.dataIndex]['awardRate']) / 100
                              : 0),
                          0,
                        )
                        .toFixed(2)}
                      ({intl.formatMessage({ id: 'detail.purchase.isTax' })})
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
          ) : null,
        )}
      </Row>
    </div>
  )
}

TotalAmount.defaultProps = {}

export default TotalAmount
