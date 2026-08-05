/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 18:02:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-07 15:24:26
 * @Description: 退款明细
 */
import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Modal, Button, Upload, Descriptions } from 'antd'
import { CaretRightOutlined, CaretDownOutlined, RightOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { EditableColumns } from '@/components/PolymericTable/interface'
import PolymericTable from '@/components/PolymericTable'
import StatusTag from '@/components/StatusTag'
import DescProgress from '@/components/DescProgress'
import { FileData, normalizeFiledata } from '@/utils'
import {
  PAY_CHANNEL_OFFLINE,
  PAY_CHANNEL_BALANCE,
  PAY_CHANNEL_CREDIT,
  PAY_CHANNEL_COD,
  PAY_CHANNEL_MONTHLY_STATEMENT,
  PAY_CHANNEL_PAYMENT_DAYS,
} from '@/constants/payment'
import {
  RETURN_OUTER_STATUS_TO_BE_REFUNDED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED,
  RETURN_OUTER_STATUS_NOT_RECEIVED,
} from '@/constants/afterService'
import Stamp from '../Stamp'
import CheckVoucherModal from '../CheckVoucherModal'
import RefundModal from '../RefundModal'
import UploadPaymentVoucherModal from '../RefundModal/UploadPaymentVoucher'
import {
  REFUND_INNER_STATUS_NO_REFUND,
  REFUND_INNER_STATUS_REFUND_FAILED,
  REFUND_OUTER_STATUS_UNCONFIRMED_REFUND,
  REFUND_OUTER_STATUS_NOT_RECEIVED,
  REFUND_OUTER_STATUS_RECEIVED,
  REFUND_OUTER_STATUS_TAG_MAP,
} from '../../constants'
import styles from './index.less'

import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()

const { confirm } = Modal

type RefundModalValueType = {
  /**
   * 数据id
   */
  id: number
  /**
   * 退款金额
   */
  refundAmount?: number
  /**
   * 采购会员id
   */
  purchaserId?: number
  /**
   * 采购会员角色id
   */
  purchaserRoleId?: number
  /**
   * 供应会员id
   */
  supplierId?: number
  /**
   * 供应会员角色id
   */
  supplierRoleId?: number
  /**
   * 支付方式
   */
  payWay?: string
  /**
   * 支付渠道
   */
  payChannel?: string
}

interface ReturnDetailInfoProps extends MellowCardProps {
  /**
   * 数据
   */
  dataSource: {
    [key: string]: any
  }[]
  /**
   * 退款事件
   */
  onRefund?: (value: { [key: string]: any }) => Promise<any>
  /**
   * 确认事件
   */
  onConfirm?: (id: number, flag: 0 | 1) => Promise<any>
  /**
   * 是否是采购商
   */
  isPurchaser?: boolean
  /**
   * 退货申请单外部状态
   */
  outerStatus: number
  /**
   * 采购商id
   */
  purchaserId: number
  /**
   * 采购商角色id
   */
  purchaserRoleId: number
  /**
   * 供应商id
   */
  supplierId: number
  /**
   * 供应商角色id
   */
  supplierRoleId: number
  /**
   * 是否可操作的
   */
  isEdit?: boolean
}

const ReturnDetailInfo: React.FC<ReturnDetailInfoProps> = ({
  dataSource = [],
  onRefund,
  onConfirm,
  isPurchaser = false,
  outerStatus,
  purchaserId,
  purchaserRoleId,
  supplierId,
  supplierRoleId,
  isEdit = false,
  ...rest
}) => {
  const [visibleResult, setVisibleResult] = useState(false)
  const [notReceivedLoading, setNotReceivedLoading] = useState(false)
  const [receivedLoading, setReceivedLoading] = useState(false)
  const [currentDetailItem, setCurrentDetailItem] = useState<{ id?: number; fileList: FileData[] }>({
    id: 0,
    fileList: [],
  })
  const [voucherVisible, setVoucherVisible] = useState(false)
  const [refundModalVisible, setRefundModalVisible] = useState(false)
  const [modalName, setModalName] = useState('uploadVoucher')
  const [refundModalValue, setRefundModalValue] = useState<RefundModalValueType>({
    id: 0,
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [paymentVoucherVisible, setPaymentVoucherVisible] = useState(false)

  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.orderNo', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.productId', defaultMessage: '商品ID' }),
      dataIndex: 'productId',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.productName', defaultMessage: '商品名称' }),
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.unit', defaultMessage: '单位' }),
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchaseCount', defaultMessage: '采购数量' }),
      dataIndex: 'purchaseCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchasePrice', defaultMessage: '采购单价' }),
      dataIndex: 'purchasePrice',
      align: 'center',
    },
    {
      title: `${intl.formatMessage({
        id: 'afterService.common.productColumns.payAmount',
        defaultMessage: '已支付',
      })}/${intl.formatMessage({
        id: 'afterService.common.productColumns.purchaseAmount',
        defaultMessage: '采购金额',
      })}`,
      dataIndex: 'payAmount',
      render: (text, record) => (
        <DescProgress
          descriptions={[
            {
              title: `${intl.formatMessage({
                id: 'afterService.common.productColumns.payAmount2',
                defaultMessage: '已支付金额',
              })}:`,
              value: `${translate('web.common.currencySymbol')}${text}`,
            },
            {
              title: `${intl.formatMessage({
                id: 'afterService.common.productColumns.purchaseAmount',
                defaultMessage: '采购金额',
              })}:`,
              value: `${translate('web.common.currencySymbol')}${record.purchaseAmount}`,
            },
          ]}
          percent={(text / record.purchaseAmount) * 100}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.returnCount', defaultMessage: '退货数量' }),
      dataIndex: 'returnCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.refundAmount', defaultMessage: '退货金额' }),
      dataIndex: 'refundAmount',
      align: 'center',
    },
  ]

  /**
   * 打开确认退款弹窗
   * @param id 退款id
   * @param channel 支付渠道
   * @param amount 退款金额
   * @param payWayName 支付方式名称
   * @param channelName 支付渠道名称
   */
  const handleRefund = (id, channel, amount, payWayName, channelName) => {
    switch (channel) {
      // 余额支付
      case PAY_CHANNEL_BALANCE: {
        setModalName('balance')
        setRefundModalVisible(true)
        setRefundModalValue({
          id,
          refundAmount: amount,
          purchaserId,
          purchaserRoleId,
        })
        break
      }
      // 线下支付
      case PAY_CHANNEL_OFFLINE: {
        setPaymentVoucherVisible(true)
        setRefundModalValue({
          id,
          purchaserId,
          purchaserRoleId,
        })
        break
      }
      // 授信支付
      case PAY_CHANNEL_CREDIT: {
        setModalName('credit')
        setRefundModalVisible(true)
        setRefundModalValue({
          id,
          refundAmount: amount,
          purchaserId,
          purchaserRoleId,
          supplierId,
          supplierRoleId,
        })
        break
      }
      // 货到付款
      case PAY_CHANNEL_COD: {
        setModalName('COD')
        setRefundModalVisible(true)
        setRefundModalValue({ id, refundAmount: amount })
        break
      }
      // 月结
      case PAY_CHANNEL_MONTHLY_STATEMENT: {
        setModalName('monthlyStatement')
        setRefundModalVisible(true)
        setRefundModalValue({ id, refundAmount: amount, payWay: payWayName, payChannel: channelName })
        break
      }
      // 账期
      case PAY_CHANNEL_PAYMENT_DAYS: {
        setModalName('paymentDays')
        setRefundModalVisible(true)
        setRefundModalValue({ id, refundAmount: amount, payWay: payWayName, payChannel: channelName })
        break
      }
      default: {
        if (onRefund) {
          confirm({
            title: intl.formatMessage({
              id: 'afterService.components.ReturnDetailInfo.refund.tip',
              defaultMessage: '提示',
            }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({
              id: 'afterService.components.ReturnDetailInfo.refund.content',
              defaultMessage: '是否确认退款？',
            }),
            okText: intl.formatMessage({
              id: 'afterService.components.ReturnDetailInfo.refund.okText',
              defaultMessage: '确认',
            }),
            cancelText: intl.formatMessage({
              id: 'afterService.components.ReturnDetailInfo.refund.cancelText',
              defaultMessage: '取消',
            }),
            onOk() {
              return onRefund({ id })
            },
          })
        }
        break
      }
    }
  }

  const handleConfirm = (id, flag) => {
    if (onConfirm) {
      flag === 1 ? setReceivedLoading(true) : setNotReceivedLoading(true)
      onConfirm(id, flag)
        .then(() => {
          setVisibleResult(false)
          flag === 1 ? setReceivedLoading(false) : setNotReceivedLoading(false)
        })
        .catch(() => {
          flag === 1 ? setReceivedLoading(false) : setNotReceivedLoading(false)
        })
    }
  }

  const handleConfirmResult = (record) => {
    setCurrentDetailItem({
      id: record.refundId,
      fileList: record.payProve.fileList
        ? record.payProve.fileList.map((item) => normalizeFiledata(item.proveUrl))
        : [],
    })
    setVisibleResult(true)
  }

  const handleCheck = (record) => {
    setCurrentDetailItem({
      fileList: record.payProve.fileList
        ? record.payProve.fileList.map((item) => normalizeFiledata(item.proveUrl))
        : [],
    })
    setVoucherVisible(true)
  }

  const handleRefundConfirm = (values, modalName) => {
    if (onRefund) {
      setSubmitLoading(true)
      onRefund(values).finally(() => {
        setSubmitLoading(false)
        setRefundModalVisible(false)
      })
    }
  }

  const handlePaymentVoucherSubmit = (value) => {
    if (onRefund) {
      setSubmitLoading(true)
      return onRefund({ ...value, id: refundModalValue.id }).finally(() => {
        setSubmitLoading(false)
        setPaymentVoucherVisible(false)
      })
    }
    return Promise.reject()
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.ReturnDetailInfo.title', defaultMessage: '退款明细' })}
      {...rest}
    >
      <PolymericTable
        rowKey={(record: any) => `${record.orderNo}+${record.productId}`}
        dataSource={dataSource}
        columns={columns}
        loading={false}
        pagination={null}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <CaretRightOutlined onClick={(e) => onExpand(record, e)} />
            ),
          expandedRowRender: (record: any) => (
            <Row gutter={16} className={styles.deliver}>
              {record.detailList.map((item) => (
                <Col span={8} className={styles['deliver-item']} key={item.refundId}>
                  <Stamp customStyle={{ margin: 0, padding: 20 }}>
                    <Descriptions column={2}>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payCount',
                          defaultMessage: '支付次数',
                        })}
                      >
                        {item.payCount}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.outerStatus',
                          defaultMessage: '状态',
                        })}
                      >
                        <StatusTag type={REFUND_OUTER_STATUS_TAG_MAP[item.outerStatus]} title={item.outerStatusName} />
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payNode',
                          defaultMessage: '支付环节',
                        })}
                      >
                        {item.payNode}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={`${intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payAmount',
                          defaultMessage: '已支付金额',
                        })}(${translate('web.common.currencySymbol')})`}
                      >
                        {item.payAmount}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payRatio',
                          defaultMessage: '支付比例',
                        })}
                      >
                        {item.payRatio * 100}%
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={`${intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.refundAmount',
                          defaultMessage: '退款金额',
                        })}(${translate('web.common.currencySymbol')})`}
                      >
                        {item.refundAmount}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.payWayName',
                          defaultMessage: '支付方式',
                        })}
                      >
                        {item.payWayName}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.refundTime',
                          defaultMessage: '退款时间',
                        })}
                      >
                        {item.refundTime}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={intl.formatMessage({
                          id: 'afterService.components.ReturnDetailInfo.channelName',
                          defaultMessage: '支付渠道',
                        })}
                      >
                        {item.channelName}
                      </Descriptions.Item>
                    </Descriptions>

                    <div className={styles['deliver-item-actions']}>
                      {isEdit &&
                        !isPurchaser &&
                        (outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
                          outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED) &&
                        !!item.canRefund &&
                        (item.outerStatus === REFUND_OUTER_STATUS_NOT_RECEIVED ||
                          item.innerStatus === REFUND_INNER_STATUS_NO_REFUND ||
                          item.innerStatus === REFUND_INNER_STATUS_REFUND_FAILED) && (
                          <div
                            className={styles['deliver-item-return']}
                            onClick={() =>
                              handleRefund(
                                item.refundId,
                                item.channel,
                                item.refundAmount,
                                item.payWayName,
                                item.channelName,
                              )
                            }
                          >
                            {intl.formatMessage({
                              id: 'afterService.components.ReturnDetailInfo.refund',
                              defaultMessage: '退款',
                            })}
                          </div>
                        )}
                      {/* 线下支付 才有确认 与 查看功能 */}
                      {item.channel === PAY_CHANNEL_OFFLINE && (
                        <>
                          {isEdit &&
                            isPurchaser &&
                            outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED &&
                            (item.outerStatus === REFUND_OUTER_STATUS_UNCONFIRMED_REFUND ||
                              item.outerStatus === REFUND_OUTER_STATUS_NOT_RECEIVED) && (
                              <div className={styles['deliver-item-return']} onClick={() => handleConfirmResult(item)}>
                                {intl.formatMessage({
                                  id: 'afterService.components.ReturnDetailInfo.confirm',
                                  defaultMessage: '确认',
                                })}
                              </div>
                            )}
                          {(item.outerStatus === REFUND_OUTER_STATUS_RECEIVED ||
                            item.outerStatus === REFUND_OUTER_STATUS_NOT_RECEIVED) && (
                            <div className={styles['deliver-item-check']} onClick={() => handleCheck(item)}>
                              {intl.formatMessage({
                                id: 'afterService.components.ReturnDetailInfo.check',
                                defaultMessage: '查看',
                              })}
                              <RightOutlined />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </Stamp>
                </Col>
              ))}
            </Row>
          ),
        }}
      />

      <CheckVoucherModal
        visible={voucherVisible}
        fileList={currentDetailItem.fileList}
        onCancel={() => setVoucherVisible(false)}
      />

      <Modal
        title={intl.formatMessage({
          id: 'afterService.components.ReturnDetailInfo.result',
          defaultMessage: '确认还款结果',
        })}
        width={576}
        visible={visibleResult}
        onCancel={() => setVisibleResult(false)}
        footer={[
          <Button key="1" onClick={() => setVisibleResult(false)}>
            {intl.formatMessage({
              id: 'afterService.components.ReturnDetailInfo.result.cancel',
              defaultMessage: '取消',
            })}
          </Button>,
          currentDetailItem.id && (
            <Button
              key="2"
              type="primary"
              loading={notReceivedLoading}
              onClick={() => handleConfirm(currentDetailItem.id, 0)}
              danger
            >
              {intl.formatMessage({
                id: 'afterService.components.ReturnDetailInfo.result.unreceived',
                defaultMessage: '未到账',
              })}
            </Button>
          ),
          currentDetailItem.id && (
            <Button
              key="3"
              type="primary"
              loading={receivedLoading}
              onClick={() => handleConfirm(currentDetailItem.id, 1)}
            >
              {intl.formatMessage({
                id: 'afterService.components.ReturnDetailInfo.result.received',
                defaultMessage: '已到账',
              })}
            </Button>
          ),
        ]}
        destroyOnClose
      >
        <Upload defaultFileList={currentDetailItem.fileList} disabled />
      </Modal>

      <RefundModal
        value={refundModalValue}
        visible={refundModalVisible}
        modalName={modalName}
        handleModalVisible={() => setRefundModalVisible(false)}
        handleConfirm={handleRefundConfirm}
        submitLoading={submitLoading}
      />

      <UploadPaymentVoucherModal
        visible={paymentVoucherVisible}
        onClose={() => setPaymentVoucherVisible(false)}
        onSubmit={handlePaymentVoucherSubmit}
        purchaserId={refundModalValue.purchaserId}
        purchaserRoleId={refundModalValue.purchaserRoleId}
        submitLoading={submitLoading}
      />
    </MellowCard>
  )
}

export default ReturnDetailInfo
