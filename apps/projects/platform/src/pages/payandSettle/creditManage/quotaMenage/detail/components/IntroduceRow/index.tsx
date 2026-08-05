import React, { useState, useEffect, useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Row, Col, Badge, Checkbox, Select, Space, Button, Modal, Spin, Upload, message } from 'antd'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { isEqual } from 'lodash'
import { postPayCreditHandleCreditConfirmRepay } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import { Pie } from '@/components/Charts'
import StatusTag from '@/components/StatusTag'
import TradeRecord, { RecordParams, RecordRes } from '../TradeRecord'
import { BILL_TRADE_STATUS_OUTSTANDIND, BILL_TRADE_STATUS_RECEIVED } from '../../../../../constant'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

const repaymentFormActions = createFormActions()
const uploadVoucherFormActions = createFormActions()

const { onFormInit$ } = FormEffectHooks

const translate = getWebIntl()
const { Option } = Select

export interface BillDetailParams {
  id: string
}

export interface BillDetailData {
  /**
   * 账单名称（格式：yyyyMMdd~yyyyMMdd）
   */
  billName: string
  /**
   * 账单额度
   */
  billQuota: number
  /**
   * 剩余应还额度
   */
  residueRepayQuota: number
  /**
   * 账单日期
   */
  billDay: number
  /**
   * 还款周期
   */
  repayPeriod: number
  /**
   * 到期时间
   */
  expireTime: string
  /**
   * 到期天数（复数已到期正数未到期）
   */
  expireDay: number
  /**
   * 最后还款日期
   */
  lastRepayDate: string
}

export interface BillRecordParams extends RecordParams {
  creditId: string
  billId: string
}

interface IntroduceRowProps {
  quotaData: {
    x: string
    y: number
  }[]

  // 时间段下拉框选项
  options: {
    title: string
    value: number
  }[]

  // 剩余的数据
  extraData: {
    canUseQuota: number // 可用额度
    useQuota: number // 已用额度
    quota: number // 现有额度
  }

  // 获取账单账单记录详情
  fetchBillDetail: (params: BillDetailParams) => Promise<BillDetailData>

  // 获取账单记录列表
  fetchBillRecordList: (params: BillRecordParams) => Promise<RecordRes>
  intl?: any
}

interface IntroduceRowState {
  billId: number | string
  billInfo: BillDetailData | null
  visibleRecord: boolean
  visibleResult: boolean
  billInfoLoading: boolean
}

const intl = getIntl()

class IntroduceRow extends React.Component<IntroduceRowProps, IntroduceRowState> {
  constructor(props) {
    super(props)
    this.state = {
      billId: '',
      billInfo: null,
      visibleRecord: false,
      visibleResult: false,
      billInfoLoading: false,
    }
  }

  tradeRecordRef = null

  // 获取账单详情
  getBillDetail = (id) => {
    const { fetchBillDetail } = this.props

    if (fetchBillDetail && id) {
      this.setState({ billInfoLoading: true })
      fetchBillDetail({
        id: `${id}`,
      })
        .then((res) => {
          this.setState({ billInfo: res })
        })
        .finally(() => {
          this.setState({ billInfoLoading: false })
        })
    }
  }

  // 根据下拉框数据改变设置默认选中第一项，并获取相应的账单详情
  initialize = (options) => {
    if (options && options.length) {
      const first = options[0]
      this.setState({ billId: first.value })
      this.getBillDetail(first.value)
    }
  }

  componentDidMount() {
    this.initialize(this.props.options)
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props

    if (!isEqual(prevProps.options, options)) {
      this.initialize(options)
    }
  }

  handleRecordCheckboxChange = (e) => {
    if (!this.state.billId) {
      message.warning(
        intl.formatMessage({
          id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.warning',
        }),
      )
      return
    }
    this.setState({ visibleRecord: e.target.checked })
  }

  getRecordList = (params) => {
    const { billId } = this.state
    const { fetchBillRecordList } = this.props

    if (fetchBillRecordList) {
      return fetchBillRecordList({
        billId,
        ...params,
      })
    }
  }

  handleBillChange = (val) => {
    const { visibleRecord } = this.state
    this.setState(
      {
        billId: val,
      },
      () => {
        // 如果当前不是显示账单记录就获取账单详情，否则就获取账单记录数据
        if (!visibleRecord) {
          this.getBillDetail(val)
        } else {
          this.tradeRecordRef.reloadRecordList()
        }
      },
    )
  }

  // 确认还款结果
  handleConfirm = (params) => {
    return postPayCreditHandleCreditConfirmRepay(params)
  }

  render() {
    const { quotaData = [], options, extraData } = this.props
    const { billId, billInfoLoading, visibleRecord, billInfo } = this.state

    return (
      <>
        <Row
          gutter={23}
          style={{
            marginBottom: 24,
          }}
        >
          <Col span={10}>
            <MellowCard
              title={intl.formatMessage({
                id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.title.1',
              })}
              fullHeight
            >
              <Row gutter={20} align="middle">
                <Col span={14}>
                  <Pie
                    inner={0.7}
                    hasLegend={false}
                    subTitle=""
                    total={null}
                    data={quotaData}
                    height={276}
                    padding={[34, 0, 34, 0]}
                    colors={['#41CC9E', '#EF6260']}
                  />
                </Col>
                <Col span={10}>
                  <div className={styles.statistic}>
                    <div className={styles['statistic-title']}>
                      <Badge
                        color="#41CC9E"
                        text={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.badge.1',
                        })}
                      />
                    </div>
                    <div className={styles['statistic-amount']}>{extraData?.canUseQuota}</div>
                  </div>
                </Col>
              </Row>

              <div className={styles.foot}>
                <Row>
                  <Col span={12}>
                    <div className={styles.badgeWrap}>
                      <Badge
                        color="#EF6260"
                        text={
                          <span className={styles['badgeWrap-title']}>
                            {intl.formatMessage({
                              id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.badge.2',
                            })}
                          </span>
                        }
                      />
                      <span className={styles['badgeWrap-content']}>{extraData?.useQuota}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.badgeWrap}>
                      <Badge
                        color="#DFE1E6"
                        text={
                          <span className={styles['badgeWrap-title']}>
                            {intl.formatMessage({
                              id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.badge.3',
                            })}
                          </span>
                        }
                      />
                      <span className={styles['badgeWrap-content']}>{extraData?.quota}</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </MellowCard>
          </Col>

          <Col span={14}>
            <MellowCard
              title={intl.formatMessage({
                id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.title.2',
              })}
              extra={
                <div className={styles.recordExtra}>
                  <Space>
                    <Checkbox onChange={this.handleRecordCheckboxChange}>
                      {intl.formatMessage({
                        id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.check',
                      })}
                    </Checkbox>
                    <Select value={billId} style={{ width: 256 }} onChange={this.handleBillChange}>
                      {options.map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  </Space>
                </div>
              }
              fullHeight
            >
              <Spin spinning={billInfoLoading}>
                {!visibleRecord ? (
                  <>
                    <Row
                      gutter={100}
                      align="middle"
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <Col span={14}>
                        <div className={styles.repayment}>
                          <div className={styles['repayment-left']}>
                            <div className={styles.statistic}>
                              <div className={styles['statistic-title']}>
                                {translate.formatCurrencyWith(translate('web.resource.payment.shenyuyinghuang'))}
                              </div>
                              <div className={styles['statistic-amount']}>{billInfo?.residueRepayQuota}</div>
                            </div>
                            <div className={styles['repayment-end']}>
                              <span className={styles['repayment-time']}>
                                {billInfo?.expireTime}{' '}
                                {intl.formatMessage({
                                  id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.1.expireTime',
                                })}
                              </span>
                              <StatusTag
                                type="danger"
                                title={
                                  billInfo && billInfo.expireDay !== undefined
                                    ? billInfo.expireDay > 0
                                      ? intl.formatMessage({
                                          id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.1.statusTag.1',
                                          data: billInfo.expireDay,
                                        })
                                      : intl.formatMessage({
                                          id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.1.statusTag.2',
                                          data: billInfo.expireDay,
                                        })
                                    : ''
                                }
                              />
                            </div>
                          </div>
                          <div className={styles['repayment-right']}></div>
                        </div>
                      </Col>
                      <Col span={10}>
                        <div className={styles.statistic}>
                          <div className={styles['statistic-title']}>
                            {intl.formatMessage({
                              id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.2',
                            })}
                          </div>
                          <div className={styles['statistic-amount']}>{billInfo?.billQuota}</div>
                        </div>
                      </Col>
                    </Row>
                    <div className={styles.foot}>
                      <Row>
                        <Col span={8}>
                          <div className={styles.badgeWrap}>
                            <Badge
                              color="#EF6260"
                              text={
                                <span className={styles['badgeWrap-title']}>
                                  {intl.formatMessage({
                                    id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.3',
                                  })}
                                </span>
                              }
                            />
                            <span className={styles['badgeWrap-content']}>{billInfo?.lastRepayDate}</span>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.badgeWrap}>
                            <Badge
                              color="#DFE1E6"
                              text={
                                <span className={styles['badgeWrap-title']}>
                                  {intl.formatMessage({
                                    id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.4',
                                  })}
                                </span>
                              }
                            />
                            <span className={styles['badgeWrap-content']}>
                              {billInfo?.repayPeriod}
                              {intl.formatMessage({
                                id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.4.text',
                              })}
                            </span>
                          </div>
                        </Col>
                        <Col span={8}>
                          <div className={styles.badgeWrap}>
                            <Badge
                              color="#DFE1E6"
                              text={
                                <span className={styles['badgeWrap-title']}>
                                  {intl.formatMessage({
                                    id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.5',
                                  })}
                                </span>
                              }
                            />
                            <span className={styles['badgeWrap-content']}>
                              {billInfo?.billDay}
                              {intl.formatMessage({
                                id: 'payandSettle.creditManage.quotaMenage.detail.components.introduceRow.col.5.text',
                              })}
                            </span>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  <TradeRecord
                    fetchRecordList={this.getRecordList}
                    ref={(node) => (this.tradeRecordRef = node)}
                    onConfirm={this.handleConfirm}
                  />
                )}
              </Spin>
            </MellowCard>
          </Col>
        </Row>
      </>
    )
  }
}

export default IntroduceRow
