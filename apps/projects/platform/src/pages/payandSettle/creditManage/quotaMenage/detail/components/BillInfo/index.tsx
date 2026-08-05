import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Tabs, Descriptions, Row, Col, Empty } from 'antd'
import { GetPayCreditApplyPageCreditOverdueResponseDetail } from '@apps/apis'
import { BILL_TRADE_OPERATION } from '@/constants/payment'
import { normalizeFiledata, FileData } from '@/utils'
import MellowCard from '@/components/MellowCard'
import StatusTag from '@/components/StatusTag'
import TradeWrap from '../TradeWrap'
import CheckVoucherModal from '../CheckVoucherModal'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const { TabPane } = Tabs

const translate = getWebIntl()
export interface BillInfoProps {
  overdueList: GetPayCreditApplyPageCreditOverdueResponseDetail[]
  loading?: boolean
}

const BillInfo: React.FC<BillInfoProps> = ({ overdueList = [], loading = false }) => {
  const intl = useIntl()
  const [currentVoucher, setCurrentVoucher] = useState<FileData[]>([])
  const [voucherVisible, setVoucherVisible] = useState(false)

  const handleCheckVoucher = (record) => {
    if (!Array.isArray(record)) {
      setCurrentVoucher([])
    } else {
      const voucher = record.map((item) => normalizeFiledata(item.proveUrl))
      setCurrentVoucher(voucher)
    }
    setVoucherVisible(true)
  }

  return (
    <MellowCard
      style={{
        marginBottom: 24,
      }}
      bodyStyle={{
        padding: '0 24px 24px',
      }}
    >
      <div className={styles.billInfo}>
        {!loading && overdueList && overdueList.length > 0 ? (
          <Tabs onChange={() => {}}>
            {overdueList.map((item, index) => (
              <TabPane
                tab={
                  <div className={styles.dateWrap}>
                    <StatusTag
                      type="danger"
                      title={intl.formatMessage({
                        id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.statusTag',
                        data: item.overdueDay,
                      })}
                    />
                    <div className={styles.time}>{item.billName}</div>
                  </div>
                }
                key={index}
              >
                <div className={styles.content}>
                  <div className={styles['content-left']}>
                    <Descriptions column={1}>
                      <Descriptions.Item
                        label={translate.formatCurrencyWith(translate('web.resource.payment.zhangdanjine'))}
                      >
                        {item.billQuota}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.2',
                        })}
                      >
                        {item.lastRepayDate}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.3',
                        })}
                      >
                        {item.lastRepayQuota}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.4',
                        })}
                      >
                        {item.payOffDate}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                  <div className={styles['content-right']}>
                    <TradeWrap>
                      {item.tradeList &&
                        item.tradeList.map((trade) => (
                          <TradeWrap.TradeItem width="33.33%" key={trade.tradeCode}>
                            <Descriptions column={1}>
                              <Descriptions.Item
                                label={intl.formatMessage({
                                  id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.5',
                                })}
                              >
                                <Row justify="space-between" style={{ width: '100%' }}>
                                  <Col span={12}>
                                    <a onClick={() => handleCheckVoucher(trade.payProveList)}>{trade.tradeCode}</a>
                                  </Col>
                                  <Col
                                    span={10}
                                    style={{
                                      textAlign: 'right',
                                    }}
                                  >
                                    <StatusTag
                                      type="danger"
                                      title={intl.formatMessage({
                                        id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.statusTag',
                                        data: item.overdueDay,
                                      })}
                                    />
                                  </Col>
                                </Row>
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={intl.formatMessage({
                                  id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.6',
                                })}
                              >
                                <Row justify="space-between" style={{ width: '100%' }}>
                                  <Col span={12}>{BILL_TRADE_OPERATION[trade.operation]}</Col>
                                  <Col
                                    span={10}
                                    style={{
                                      textAlign: 'right',
                                    }}
                                  >
                                    <strong>{trade.tradeMoney}</strong>
                                  </Col>
                                </Row>
                              </Descriptions.Item>
                              <Descriptions.Item
                                label={intl.formatMessage({
                                  id: 'payandSettle.creditManage.quotaMenage.detail.components.billInfo.descriptions.7',
                                })}
                              >
                                {trade.tradeTime}
                              </Descriptions.Item>
                            </Descriptions>
                          </TradeWrap.TradeItem>
                        ))}
                    </TradeWrap>
                  </div>
                </div>
              </TabPane>
            ))}
          </Tabs>
        ) : (
          <div className={styles.noData}>
            <Empty />
          </div>
        )}
      </div>

      <CheckVoucherModal visible={voucherVisible} fileList={currentVoucher} onCancel={() => setVoucherVisible(false)} />
    </MellowCard>
  )
}

export default BillInfo
