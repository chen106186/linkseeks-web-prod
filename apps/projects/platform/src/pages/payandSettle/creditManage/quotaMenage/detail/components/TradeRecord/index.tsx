import React, { useState, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Row, Col, Descriptions, Pagination, Empty, Spin, Button, Modal, Upload } from 'antd'
import { normalizeFiledata, FileData } from '@/utils'
import StatusTag from '@/components/StatusTag'
import {
  BILL_TRADE_STATUS_OUTSTANDIND,
  BILL_TRADE_STATUS_RECEIVED,
  BILL_TRADE_STATUS_UNCONFIRMED,
  BILL_TRADE_STATUS_TAB_MAP,
} from '../../../../../constant'
import TradeWrap from '../TradeWrap'
import CheckVoucherModal from '../CheckVoucherModal'
import styles from './index.less'
import { render } from '@/app'

const PAGE_SIZE = 4

export interface RecordParams {
  current: string
  pageSize: string
}

export interface RecordItem {
  id: number
  /**
   * 交易流水号
   */
  tradeCode: string
  /**
   * 交易时间
   */
  tradeTime: string
  /**
   * 交易金额
   */
  tradeMoney: number
  /**
   * 交易项目:1-订单支付,2-订单退款,3-还款
   */
  operation: number
  /**
   * 交易项目名称
   */
  operationName: string
  /**
   * 状态:1-待确认还款结果,2-确认未到账,3-确认到账
   */
  status: number
  /**
   * 交易状态名称
   */
  statusName: string
  /**
   * 备注
   */
  remark: string
  /**
   * 支付凭证 ,PayProveBO
   */
  payProveList: {
    /**
     * 证明名称
     */
    name?: string
    /**
     * 证明地址
     */
    proveUrl?: string
  }[]
}

export interface RecordRes {
  data: RecordItem[]
  totalCount: number
}

interface TradeRecordProps {
  // 获取账单账单记录详情
  fetchRecordList: (params: RecordParams) => Promise<RecordRes>
  // 确认还款结果
  onConfirm?: (any) => Promise<any>
  intl?: any
}

interface TradeRecordState {
  voucherVisible: boolean
  record: {
    data: RecordItem[]
    totalCount: number
  }
  page: number
  size: number
  currentVoucher: FileData[]
  loading: boolean
  recordId: string
  visibleResult: boolean
  receivedLoading: boolean
  notReceivedLoading: boolean
}

const intl = getIntl()

class TradeRecord extends React.Component<TradeRecordProps, TradeRecordState> {
  constructor(props) {
    super(props)
    this.state = {
      record: {
        data: [],
        totalCount: 0,
      },
      page: 1,
      size: PAGE_SIZE,
      currentVoucher: [],
      voucherVisible: false,
      loading: false,
      recordId: '',
      visibleResult: false,
      receivedLoading: false,
      notReceivedLoading: false,
    }
  }

  getRecordList = () => {
    const { fetchRecordList } = this.props
    const { page, size } = this.state
    if (fetchRecordList) {
      this.setState({ loading: true })
      fetchRecordList({
        current: `${page}`,
        pageSize: `${size}`,
      })
        .then((res) => {
          this.setState({ record: res })
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    }
  }

  componentDidMount() {
    this.getRecordList()
  }

  handleCheckVoucher = (record) => {
    if (!Array.isArray(record)) {
      this.setState({ currentVoucher: [] })
    } else {
      const voucher = record.map((item) => normalizeFiledata(item.proveUrl))
      this.setState({ currentVoucher: voucher })
    }
    this.setState({ voucherVisible: true })
  }

  handlePaginationChange = (page, size) => {
    this.setState(
      {
        page,
        size,
      },
      () => {
        this.getRecordList()
      },
    )
  }

  handleVisibleResult = (flag, recordId?, voucher?) => {
    this.setState({
      visibleResult: !!flag,
      recordId,
      currentVoucher: voucher ? voucher.map((item) => normalizeFiledata(item.proveUrl)) : [],
    })
  }

  handleConfirm = (flag) => {
    const { onConfirm } = this.props

    if (onConfirm) {
      const { recordId } = this.state

      if (!recordId) {
        return
      }

      if (flag === BILL_TRADE_STATUS_OUTSTANDIND) {
        this.setState({ notReceivedLoading: true })
      } else {
        this.setState({ receivedLoading: true })
      }

      onConfirm({
        recordId,
        status: flag,
      })
        .then((res) => {
          if (res.code === 1000) {
            this.handleVisibleResult(false)
            this.getRecordList()
          }
        })
        .finally(() => {
          if (flag === BILL_TRADE_STATUS_OUTSTANDIND) {
            this.setState({ notReceivedLoading: false })
          } else {
            this.setState({ receivedLoading: false })
          }
        })
    }
  }

  reloadRecordList() {
    this.setState(
      {
        page: 1,
        size: PAGE_SIZE,
      },
      () => {
        this.getRecordList()
      },
    )
  }

  render() {
    const {
      record,
      page,
      size,
      voucherVisible,
      currentVoucher,
      loading,
      visibleResult,
      notReceivedLoading,
      receivedLoading,
    } = this.state

    return (
      <div className={styles.record}>
        <Spin spinning={loading}>
          <div className={styles.list}>
            {!loading && record.data.length > 0 ? (
              <TradeWrap>
                {record.data.map((item) => (
                  <TradeWrap.TradeItem key={item.tradeCode}>
                    <Descriptions column={1}>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.1',
                        })}
                      >
                        <Row justify="space-between" style={{ width: '100%' }}>
                          <Col span={10}>
                            <a onClick={() => this.handleCheckVoucher(item.payProveList)}>{item.tradeCode}</a>
                          </Col>
                          <Col
                            span={14}
                            style={{
                              textAlign: 'right',
                            }}
                          >
                            <StatusTag type={BILL_TRADE_STATUS_TAB_MAP[item.status]} title={item.statusName} />
                          </Col>
                        </Row>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.2',
                        })}
                      >
                        <Row justify="space-between" style={{ width: '100%' }}>
                          <Col span={12}>{item.operationName}</Col>
                          <Col
                            span={10}
                            style={{
                              textAlign: 'right',
                            }}
                          >
                            <strong>
                              {item.tradeMoney}
                              {intl.formatMessage({
                                id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.2.strong',
                              })}
                            </strong>
                          </Col>
                        </Row>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.3',
                        })}
                      >
                        {item.tradeTime}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.4',
                        })}
                      >
                        <Row justify="space-between">
                          <Col
                            span={item.status === BILL_TRADE_STATUS_UNCONFIRMED ? 12 : 24}
                            style={{
                              height: 32,
                            }}
                          >
                            {item.remark}
                          </Col>
                          {/* 状态等于 待确认还款 */}
                          {item.status === BILL_TRADE_STATUS_UNCONFIRMED && (
                            <Col
                              span={10}
                              style={{
                                textAlign: 'right',
                              }}
                            >
                              <Button
                                type="primary"
                                onClick={() => this.handleVisibleResult(true, item.id, item.payProveList)}
                              >
                                {intl.formatMessage({
                                  id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.descriptions.4.button',
                                })}
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </Descriptions.Item>
                    </Descriptions>
                  </TradeWrap.TradeItem>
                ))}
              </TradeWrap>
            ) : (
              <div className={styles.noData}>
                <Empty />
              </div>
            )}
          </div>
        </Spin>

        {!loading && record.data.length > 0 && (
          <div className={styles.pagination}>
            <Pagination
              size="small"
              current={page}
              pageSize={size}
              total={record.totalCount}
              onChange={this.handlePaginationChange}
            />
          </div>
        )}

        <CheckVoucherModal
          visible={voucherVisible}
          fileList={currentVoucher}
          onCancel={() => this.setState({ voucherVisible: false })}
        />

        <Modal
          title={intl.formatMessage({
            id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.modal.title',
          })}
          width={576}
          visible={visibleResult}
          footer={[
            <Button key="1" onClick={() => this.handleVisibleResult(false)}>
              {intl.formatMessage({
                id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.modal.button.1',
              })}
            </Button>,
            <Button
              key="2"
              type="primary"
              loading={notReceivedLoading}
              onClick={() => this.handleConfirm(BILL_TRADE_STATUS_OUTSTANDIND)}
              danger
            >
              {intl.formatMessage({
                id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.modal.button.2',
              })}
            </Button>,
            <Button
              key="2"
              type="primary"
              loading={receivedLoading}
              onClick={() => this.handleConfirm(BILL_TRADE_STATUS_RECEIVED)}
            >
              {intl.formatMessage({
                id: 'payandSettle.creditManage.quotaMenage.detail.components.tradeRecord.modal.button.3',
              })}
            </Button>,
          ]}
          destroyOnClose
        >
          <Upload defaultFileList={currentVoucher} disabled />
        </Modal>
      </div>
    )
  }
}

export default TradeRecord
