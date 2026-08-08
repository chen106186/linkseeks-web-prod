import React, { useState, useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Row, Col, Descriptions, Pagination, Empty, Spin } from 'antd'
import { normalizeFiledata, FileData } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { BILL_TRADE_STATUS_TAB_MAP } from '../../../../../constant'
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
    if (!Array.isArray(record) || !record.length) {
      return
    }
    const voucher = record.map((item) => normalizeFiledata(item.proveUrl))
    this.setState({ currentVoucher: voucher })

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
    const { record, page, size, voucherVisible, currentVoucher, loading } = this.state

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
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.tradeRecord.descriptions.1',
                        })}
                      >
                        <Row justify="space-between" style={{ width: '100%' }}>
                          <Col span={12}>
                            <a onClick={() => this.handleCheckVoucher(item.payProveList)}>{item.tradeCode}</a>
                          </Col>
                          <Col
                            span={10}
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
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.tradeRecord.descriptions.2',
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
                              {intl.formatMessage({
                                id: 'payandSettle.creditApplication.quotaMenage.detail.components.tradeRecord.descriptions.2.text',
                                data: item.tradeMoney,
                              })}
                            </strong>
                          </Col>
                        </Row>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.tradeRecord.descriptions.3',
                        })}
                      >
                        {item.tradeTime}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'payandSettle.creditApplication.quotaMenage.detail.components.tradeRecord.descriptions.4',
                        })}
                      >
                        {item.remark}
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
      </div>
    )
  }
}

export default TradeRecord
