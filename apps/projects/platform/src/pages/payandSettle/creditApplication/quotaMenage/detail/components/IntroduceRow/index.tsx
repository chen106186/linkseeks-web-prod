import React, { useState, useEffect, useRef } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Row, Col, Badge, Checkbox, Select, Space, Button, Modal, Spin, message, Empty } from 'antd'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { isEqual } from 'lodash'
import { postPayCreditApplyCreditRepay, getPayCreditApplyGetCreditRepayResult } from '@apps/apis'
import { PAY_CHANNEL_WECHAT, PAY_CHANNEL_BALANCE } from '@/constants/payment'
import MellowCard from '@/components/MellowCard'
import { Pie } from '@/components/Charts'
import StatusTag from '@/components/StatusTag'
import BalancePayModal from '@/components/BalancePayModal'
import TradeRecord, { RecordParams, RecordRes } from '../TradeRecord'
import WxPayModal from '../WxPayModal'
import RefundModal from '../RefundModal'
import UploadVoucherModal from '../UploadVoucherModal'
import styles from './index.less'

const uploadVoucherFormActions = createFormActions()

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
  /**
   * 收款人Id
   */
  memberId: number
  /**
   * 收款人角色Id
   */
  memberRoleId: number
  /**
   * 最终确定还款的金额
   */
  repayQuota?: number
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
  visibleRepayment: boolean
  visibleUploadVoucher: boolean
  billInfoLoading: boolean
  repaymentValues: {
    tradeType: number
    tradeChannel: number
    repayQuota: number
  }
  repaymentSubmitLoading: boolean
  uploadVoucherSubmitLoading: boolean

  wxPayVisible: boolean
  wxPayUrl: string
  wxPayPrice: number

  balancePayVisible: boolean
}

const intl = getIntl()
class IntroduceRow extends React.Component<IntroduceRowProps, IntroduceRowState> {
  constructor(props) {
    super(props)
    this.state = {
      billId: '',
      billInfo: null,
      visibleRecord: false,
      visibleRepayment: false,
      visibleUploadVoucher: false,
      billInfoLoading: false,
      repaymentValues: {
        tradeType: 1,
        tradeChannel: 1,
        repayQuota: 0,
      },
      repaymentSubmitLoading: false,
      uploadVoucherSubmitLoading: false,
      wxPayVisible: false,
      wxPayUrl: '',
      wxPayPrice: 0,
      balancePayVisible: false,
    }
  }

  tradeRecordRef = null

  /**
   * 还款记录id
   */
  payRecordId = ''

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
        .catch((error) => {
          console.error('获取账单详情失败:', error)
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
          id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.warning.1',
        }),
      )
      return
    }
    this.setState({ visibleRecord: e.target.checked })
  }

  handleRepayment = (flag) => {
    this.setState({ visibleRepayment: !!flag })
  }

  handleRepaymentSubmit = (values) => {
    const { tradeType, tradeChannel } = values
    const { billId, billInfo } = this.state

    switch (tradeType) {
      // 线上支付
      case 1: {
        switch (tradeChannel) {
          // 微信支付
          case PAY_CHANNEL_WECHAT: {
            this.setState({ repaymentSubmitLoading: true })
            postPayCreditApplyCreditRepay({
              billId,
              ...values,
            })
              .then((res) => {
                if (res.code !== 1000) {
                  return
                }
                message.destroy()

                this.setState({ visibleRepayment: false })
                this.setState({
                  wxPayPrice: values.repayQuota,
                  wxPayUrl: res.data.payQRCode,
                })
                this.payRecordId = `${res.data.recordId}`
                this.handleWxPayVisible(true)
              })
              .finally(() => {
                this.setState({ repaymentSubmitLoading: false })
              })
            break
          }
          // 余额支付
          case PAY_CHANNEL_BALANCE: {
            this.setState({
              visibleRepayment: false,
              billInfo: {
                ...billInfo,
                repayQuota: values.repayQuota,
              },
              repaymentValues: values,
            })
            this.handleBalancePayVisible(true)
            break
          }

          default: {
            message.warning(
              intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.warning.2',
              }),
            )
          }
        }

        break
      }

      // 线下支付
      case 2: {
        this.setState({
          repaymentValues: values,
          visibleUploadVoucher: true,
        })

        break
      }

      // 通联支付 - 由 RefundModal 内部处理，这里不需要额外处理
      case 6: {
        // 检查是否是刷新请求
        if (values.refresh) {
          this.getBillDetail(this.state.billId)
        }
        break
      }

      default:
        // 如果是刷新请求，也要处理
        if (values.refresh) {
          this.getBillDetail(this.state.billId)
        }
        break
    }
  }

  // 余额支付确认
  handleBalancePaySubmit = (values) => {
    const { billId, repaymentValues } = this.state

    this.setState({ repaymentSubmitLoading: true })
    postPayCreditApplyCreditRepay({
      billId,
      ...repaymentValues,
      ...values,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setTimeout(() => {
          this.handleBalancePayVisible(false)
          this.getBillDetail(this.state.billId)
        }, 500)
      })
      .finally(() => {
        this.setState({ repaymentSubmitLoading: false })
      })
  }

  // 线下支付确认
  handleUploadVoucherSubmit = (values) => {
    const { payProveList = [] } = values
    const { repaymentValues, billId } = this.state

    this.setState({ uploadVoucherSubmitLoading: true })
    postPayCreditApplyCreditRepay({
      billId: +billId,
      ...repaymentValues,
      payProveList: payProveList
        .map(
          (item) =>
            item.status === 'done' && {
              name: item.name,
              proveUrl: item.url,
            },
        )
        .filter(Boolean),
    })
      .then((res) => {
        if (res.code === 1000) {
          this.setState({ visibleRepayment: false })
          this.setState({ visibleUploadVoucher: false })
          this.getBillDetail(this.state.billId)
        }
      })
      .finally(() => {
        this.setState({ uploadVoucherSubmitLoading: false })
      })
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

  handleWxPayVisible = (flag) => {
    this.setState({ wxPayVisible: !!flag })
  }

  handleBalancePayVisible = (flag) => {
    this.setState({ balancePayVisible: !!flag })
  }

  handleCheckResult = (): Promise<{ success: Boolean }> => {
    return new Promise((resolve, reject) => {
      getPayCreditApplyGetCreditRepayResult({
        recordId: `${this.payRecordId}`,
      })
        .then((res) => {
          if (res.code !== 1000) {
            resolve({ success: false })
          } else {
            // 3 - 确认到账
            if (res.data.status === 3) {
              resolve({ success: true })
            } else {
              resolve({ success: false })
            }
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  handleWxPaySuccess = () => {
    message.success(
      intl.formatMessage({
        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.success.1',
      }),
    )
    this.handleWxPayVisible(false)
    this.getBillDetail(this.state.billId)
  }

  handleWxPayFail = () => {
    message.success(
      intl.formatMessage({
        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.success.2',
      }),
    )
    this.handleWxPayVisible(false)
    this.handleRepayment(true)
  }

  render() {
    const { quotaData = [], options, extraData } = this.props
    const {
      billId,
      billInfoLoading,
      visibleRecord,
      billInfo,
      visibleRepayment,
      visibleUploadVoucher,
      repaymentSubmitLoading,
      uploadVoucherSubmitLoading,
      wxPayVisible,
      wxPayUrl,
      wxPayPrice,
      balancePayVisible,
    } = this.state

    const WxPayModalPros = {
      url: wxPayUrl,
      visible: wxPayVisible,
      price: wxPayPrice,
      onCancel: () => this.handleWxPayVisible(false),
      onCheckResult: this.handleCheckResult,
      onSuccess: this.handleWxPaySuccess,
    }

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
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.title.1',
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
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.badge',
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
                              id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.1',
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
                              id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.2',
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
              title="账单记录"
              extra={
                <div className={styles.recordExtra}>
                  <Space>
                    <Checkbox onChange={this.handleRecordCheckboxChange}>
                      {intl.formatMessage({
                        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.check',
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
                    {!billInfoLoading && billInfo && (
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
                                    {intl.formatMessage({
                                      id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.3',
                                    })}
                                  </div>
                                  <div className={styles['statistic-amount']}>{billInfo?.residueRepayQuota}</div>
                                </div>
                                <div className={styles['repayment-end']}>
                                  <span className={styles['repayment-time']}>
                                    {billInfo?.expireTime}{' '}
                                    {intl.formatMessage({
                                      id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.3.expireTime',
                                    })}
                                  </span>
                                  <StatusTag
                                    type="danger"
                                    title={
                                      billInfo && billInfo.expireDay !== undefined
                                        ? billInfo.expireDay > 0
                                          ? intl.formatMessage({
                                              id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.3.statusTag.1',
                                              data: billInfo.expireDay,
                                            })
                                          : intl.formatMessage({
                                              id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.3.statusTag.2',
                                              data: billInfo.expireDay,
                                            })
                                        : ''
                                    }
                                  />
                                </div>
                              </div>
                              <div className={styles['repayment-right']}>
                                {billInfo && billInfo.residueRepayQuota ? (
                                  <Button type="primary" onClick={() => this.handleRepayment(true)}>
                                    {intl.formatMessage({
                                      id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.3.button',
                                    })}
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </Col>
                          <Col span={10}>
                            <div className={styles.statistic}>
                              <div className={styles['statistic-title']}>
                                {intl.formatMessage({
                                  id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.4',
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
                                        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.5',
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
                                        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.6',
                                      })}
                                    </span>
                                  }
                                />
                                <span className={styles['badgeWrap-content']}>{billInfo?.repayPeriod}天</span>
                              </div>
                            </Col>
                            <Col span={8}>
                              <div className={styles.badgeWrap}>
                                <Badge
                                  color="#DFE1E6"
                                  text={
                                    <span className={styles['badgeWrap-title']}>
                                      {intl.formatMessage({
                                        id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.7',
                                      })}
                                    </span>
                                  }
                                />
                                <span className={styles['badgeWrap-content']}>
                                  {billInfo?.billDay}
                                  {intl.formatMessage({
                                    id: 'payandSettle.creditApplication.quotaMenage.detail.components.introduceRow.col.7.text',
                                  })}
                                </span>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </>
                    )}
                    {!billInfoLoading && !billInfo && <Empty style={{ marginTop: 80 }} />}
                  </>
                ) : (
                  <TradeRecord fetchRecordList={this.getRecordList} ref={(node) => (this.tradeRecordRef = node)} />
                )}
              </Spin>
            </MellowCard>
          </Col>
        </Row>

        <RefundModal
          visible={visibleRepayment}
          billInfo={billInfo}
          billId={this.state.billId}
          onCancel={() => this.setState({ visibleRepayment: false })}
          onSubmit={this.handleRepaymentSubmit}
          confirmLoading={repaymentSubmitLoading}
        />

        <UploadVoucherModal
          visible={visibleUploadVoucher}
          confirmLoading={uploadVoucherSubmitLoading}
          memberId={billInfo?.memberId}
          memberRoleId={billInfo?.memberRoleId}
          onCancel={() => this.setState({ visibleUploadVoucher: false })}
          onSubmit={this.handleUploadVoucherSubmit}
        />

        <BalancePayModal
          visible={balancePayVisible}
          parentMemberId={billInfo?.memberId}
          parentMemberRoleId={billInfo?.memberRoleId}
          onCancel={() => this.handleBalancePayVisible(false)}
          onSubmit={this.handleBalancePaySubmit}
          confirmLoading={repaymentSubmitLoading}
          payAmount={billInfo?.repayQuota}
        />

        <WxPayModal {...WxPayModalPros} />
      </>
    )
  }
}

export default IntroduceRow
