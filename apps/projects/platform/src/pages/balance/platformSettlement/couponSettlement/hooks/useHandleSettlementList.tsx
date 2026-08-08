import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
// import StatusTag from '../components/StatusTag';
// import { TO_BE_RECONCILED, TO_BE_PAY, TO_BE_COLLECTED, COMPLETED, PRODUCT_NOTICE_SETTLEMENT_DETAIL, LOGISTICS_DETAIL, ORDER_DETAIL, CONTRACT_FUND_BILL } from '../common/constants';
import { numFormat, priceFormat } from '@/utils/numberFomat'
import StatusTag, { STATUS_TYPE } from '@/components/StatusTag'
import React, { useMemo, useState } from 'react'
// import { payStatus } from '../common';
import {
  COMPLETED,
  TO_BE_COLLECTED,
  TO_BE_PAY,
  TO_BE_RECONCILED,
  IS_UNIVERSAL_PAY,
} from '@/pages/balance/common/constants'
import { useCallback } from 'react'
import { GetSettlementPlatformScoreSettlementPageReceivableSettlementResponseDetail } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { authService } from '@apps/services'
import { payStatus } from '@/pages/balance/common'
import { STATUS_TEXT } from '@/constants/balance'
const intl = getIntl()

type ModalsType = {
  /** 待对账 */
  reconciledComfirm: boolean
  /** 确认付款凭证 */
  confirmCompletePaymentStatus: boolean
  /** 查看付款 */
  viewPay: boolean
  /** 查看通联支付 */
  viewUniversalPay: boolean
}

function useHandleSettlementList() {
  const auth = authService.getAuth()
  const [itemInfo, setItemInfo] =
    useState<GetSettlementPlatformScoreSettlementPageReceivableSettlementResponseDetail | null>(null)
  const [modals, setModals] = useState<ModalsType>({
    viewPay: false,
    viewUniversalPay: false,

    reconciledComfirm: false,
    confirmCompletePaymentStatus: false,
  })

  /** 这里不对其他key 做限制，即可存在多个为true的时候 */
  const handleOpen = useCallback((key: keyof ModalsType) => {
    setModals((prev) => ({
      ...prev,
      [key]: true,
    }))
  }, [])

  const handleClose = useCallback((key: keyof ModalsType) => {
    setModals((prev) => ({
      ...prev,
      [key]: false,
      // unionPay: false
    }))
  }, [])

  const handleAction = async (
    record: GetSettlementPlatformScoreSettlementPageReceivableSettlementResponseDetail,
    key: keyof ModalsType,
  ) => {
    setItemInfo(record)
    handleOpen(key)
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.settlementNo' }),
      dataIndex: 'settlementNo',
      render: (text, record) => {
        return (
          <EyeAuthButton url={`/balance/platformSettlement/couponSettlement/detail?id=${record.id}`}>
            {record.settlementNo}
          </EyeAuthButton>
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.settlementWayName' }),
      dataIndex: 'settlementWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.columns.settlementName', defaultMessage: '结算方' }),
      dataIndex: 'settlementName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.settlementDate' }),
      dataIndex: 'settlementDate',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.totalCount' }),
      dataIndex: 'totalCount',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.amount' }),
      dataIndex: 'amount',
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
    },
    {
      title: intl.formatMessage({
        id: 'balance.platformSettlement.columns.estimatedPaymentDate',
        defaultMessage: '预计付款时间',
      }),
      dataIndex: 'estimatedPaymentDate',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.columns.payTime', defaultMessage: '实际付款时间' }),
      dataIndex: 'actualPaymentTime',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.payWayName' }),
      dataIndex: 'payWayName',
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.status' }),
      dataIndex: 'status',
      render: (text, record) => {
        return (
          // <StatusTag status={record.status || 1} />
          <StatusTag type={STATUS_TYPE[record.status] as 'success'} title={record.statusName} />
        )
      },
    },
    {
      title: intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.operation' }),
      render: (text, record) => {
        /** 通联支付 */
        const isUniversalPay = record.payWay === IS_UNIVERSAL_PAY
        // 待收账款结算
        if (record.status === TO_BE_RECONCILED) {
          return (
            <a onClick={() => handleAction(record, 'reconciledComfirm')}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.operation.button.1' })}
            </a>
          )
        }
        if (record.status === TO_BE_COLLECTED) {
          return (
            <a onClick={() => handleAction(record, 'confirmCompletePaymentStatus')}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.operation.button.2' })}
            </a>
          )
        }
        if (record.status === COMPLETED) {
          return (
            <a onClick={() => handleAction(record, isUniversalPay ? 'viewUniversalPay' : 'viewPay')}>
              {intl.formatMessage({ id: 'balance.platformSettlement.integral.columns.operation.button.3' })}
            </a>
          )
        }
      },
    },
  ]

  const cacheItemInfo = useMemo(() => itemInfo, [itemInfo])

  return {
    columns,
    handleOpen,
    handleClose,
    itemInfo: cacheItemInfo,
    modals,
  }
}

export default useHandleSettlementList
