import { useIntl } from '@linkseeks/i18n'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
// import StatusTag from '../components/StatusTag';
import {
  TO_BE_RECONCILED,
  TO_BE_PAY,
  TO_BE_COLLECTED,
  COMPLETED,
  PRODUCT_NOTICE_SETTLEMENT_DETAIL,
  LOGISTICS_DETAIL,
  ORDER_DETAIL,
  CONTRACT_FUND_BILL,
} from '../common/constants'
import { priceFormat } from '@/utils/numberFomat'
import StatusTag from '@/components/StatusTag'
import { STATUS_TEXT } from '@/constants/balance'
import React, { useState } from 'react'
import { payStatus } from '../common'
import moment from 'moment'

type BalanceInfoType = { id: number; settlementId: number; roleId: number }
const format = 'YYYY-MM-DD HH:mm:ss'
const URL_MAP = {
  [PRODUCT_NOTICE_SETTLEMENT_DETAIL]: 'productNoticeSettlementDetail',
  [LOGISTICS_DETAIL]: 'logisticsDetail',
  [ORDER_DETAIL]: 'orderDetail',
  [CONTRACT_FUND_BILL]: '',
}

const STATUS_COLOR = ['default', 'warning', 'primary', 'danger', 'success']

function useFetchColumns(mode: 'payable' | 'receiveable') {
  const intl = useIntl()
  /**
   * 手动结算状态
   */
  const [manualStatus, setManualStatus] = useState<number | null>(null)
  /**
   * 付款弹框
   */
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  /**
   * 查看付款凭证弹框
   */
  const [viewVisible, setViewVisible] = useState<boolean>(false)
  /**
   *
   * 获取当前结算单信息
   */
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfoType | null>(null)
  /**
   * 付款凭证info
   */
  const [payVoucherInfo, setPayVoucherInfo] = useState<{ id: number } | null>(null)
  /**
   *
   * 确认对账完成Info
   */
  const [reconciliationVisible, setReconciliationVisible] = useState<boolean>(false)
  /**
   * 确认对账完成info
   */
  const [reconciliationInfo, setReconciliationInfo] = useState<{
    payName: string
    settlementDate: string
    id: number
  } | null>(null)
  /**
   * 确认付款完成visible
   */
  const [confirmPayVisible, setConfirmPayVisible] = useState<boolean>(false)
  /**
   * 确认付款完成Info
   */
  const [confirmPayInfo, setConfirmPayInfo] = useState<{ id: number } | null>(null)

  /**
   *
   * @param id: 结算单id
   * @param settlementId 结算方id
   * @param roleId 结算方角色id
   *
   */
  const handlePay = (params: BalanceInfoType) => {
    setBalanceInfo(params)
    setPayModalVisible(true)
  }

  const handleManualsettlement = (id: number | null) => {
    setManualStatus(id)
  }

  const payModalOnCancel = () => {
    setPayModalVisible(false)
  }

  /**
   * 查看支付凭证Cancel
   */
  const viewModalonCancel = () => {
    setViewVisible(false)
  }

  const handleViewPayModal = (params: { id: number }) => {
    setPayVoucherInfo(params)
    setViewVisible(true)
  }

  const handleReconciledComfirm = (params: any) => {
    setReconciliationInfo(params)
    setReconciliationVisible(true)
  }

  const reconciliationOnCancel = () => {
    setReconciliationVisible(false)
  }

  /**
   * 确认付款凭证
   */
  const handleComfirmCompletePaymentStatus = (params: { id: number }) => {
    setConfirmPayInfo(params)
    /**
     * 这里确认付款完成 收款方需要查看付款凭证
     */
    setPayVoucherInfo(params)
    setConfirmPayVisible(true)
  }

  const confirmPayOnCancel = () => {
    setConfirmPayVisible(false)
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.settlementNo' }),
      dataIndex: 'settlementNo',
      render: (text, record) => {
        const prefix =
          mode === 'payable'
            ? `/balance/accountsPayable/settlementList/`
            : '/balance/accountsReceivable/settlementList/'
        const url = URL_MAP[record.orderType]
        let fullUrl = `${prefix}${url}?id=${record.id}`
        if (record.orderType === CONTRACT_FUND_BILL) {
          fullUrl = `/contract/funds/bill/detail?applyId=${record.orderId}`
        }
        return <EyeAuthButton url={fullUrl}>{record.settlementNo}</EyeAuthButton>
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.settlementWayName' }),
      dataIndex: 'settlementWayName',
    },
    {
      title:
        mode === 'receiveable'
          ? intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payName' })
          : intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.settlementName' }),
      dataIndex: mode === 'receiveable' ? 'payName' : 'settlementName',
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.orderTypeName' }),
      dataIndex: 'orderTypeName',
      filters: [
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.orderTypeName.1' }),
          value: 1,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.orderTypeName.2' }),
          value: 2,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.orderTypeName.3' }),
          value: 3,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.orderTypeName.4' }),
          value: 6,
        },
      ],
      onFilter: (value: number, record: any) => record.orderType === value,
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.amount' }),
      dataIndex: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (text, record) => {
        return <div>{`${intl.formatMessage({ id: 'common.money' })}${priceFormat(record.amount)}`}</div>
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.totalCount' }),
      dataIndex: 'totalCount',
      sorter: (a, b) => a.totalCount - b.totalCount,
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.settlementTime' }),
      dataIndex: 'settlementTime',
      sorter: (a, b) => moment(a.settlementTime, format).valueOf() - moment(b.settlementTime, format).valueOf(),
    },
    // {title: '结算日期', dataIndex: 'settlementDate'},
    { title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.prePayTime' }), dataIndex: 'prePayTime' },
    { title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payTime' }), dataIndex: 'payTime' },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.status' }),
      dataIndex: 'status',
      // filters: payStatus,
      // onFilter: (value: number, record: any) => record.status == value,
      render: (text: string, record: any) => {
        return <StatusTag type={STATUS_COLOR[record.status] as 'success'} title={STATUS_TEXT[record.status]} />
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payWayName' }),
      dataIndex: 'payWayName',
      filters: [
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payWayName.1' }),
          value: 1,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payWayName.2' }),
          value: 2,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payWayName.3' }),
          value: 3,
        },
        {
          text: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.payWayName.4' }),
          value: 4,
        },
      ],
      onFilter: (value: number, record: any) => record.payWay === value,
    },
    {
      title: intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation' }),
      render: (text: string, record: any) => {
        if (mode === 'payable') {
          // 待对账的时候可以手动结算
          if (record.status === TO_BE_RECONCILED) {
            if (record.orderType !== CONTRACT_FUND_BILL) {
              return (
                <a onClick={() => handleManualsettlement(record.id)}>
                  {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.1' })}
                </a>
              )
            }
            return null
          }
          if (record.status === TO_BE_PAY) {
            return (
              <a onClick={() => handlePay({ id: record.id, settlementId: record.memberId, roleId: record.roleId })}>
                {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.2' })}
              </a>
            )
          }
          return (
            <a onClick={() => handleViewPayModal({ id: record.id })}>
              {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.3' })}
            </a>
          )
        }
        // 待收账款结算
        if (record.status === TO_BE_RECONCILED) {
          return (
            <a
              onClick={() =>
                handleReconciledComfirm({
                  id: record.id,
                  payName: record.payName,
                  settlementDate: record.settlementDate,
                })
              }
            >
              {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.4' })}
            </a>
          )
        }
        if (record.status === TO_BE_COLLECTED) {
          return (
            <a onClick={() => handleComfirmCompletePaymentStatus({ id: record.id })}>
              {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.5' })}
            </a>
          )
        }
        if (record.status === COMPLETED) {
          return (
            <a onClick={() => handleViewPayModal({ id: record.id })}>
              {intl.formatMessage({ id: 'balance.hooks.useFetchColumns.columns.operation.button.6' })}
            </a>
          )
        }
      },
    },
  ]

  return {
    columns,
    manualStatus,
    handleManualsettlement,
    viewVisible,
    payModalVisible,
    balanceInfo,
    payModalOnCancel,
    viewModalonCancel,
    payVoucherInfo,
    reconciliationVisible,
    reconciliationInfo,
    confirmPayInfo,
    confirmPayVisible,
    reconciliationOnCancel,
    confirmPayOnCancel,
    handleReconciledComfirm,
    handleComfirmCompletePaymentStatus,
    handleViewPayModal,
  }
}

export default useFetchColumns
