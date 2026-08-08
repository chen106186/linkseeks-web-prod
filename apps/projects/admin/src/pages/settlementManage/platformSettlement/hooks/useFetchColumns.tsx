import { EyeAuthButton } from '@apps/components'
import StatusTag from '../components/StatusTag'
import { priceFormat } from '@/utils/numberFomat'
// import StatusTag from '@/components/StatusTag';

import React, { useState } from 'react'

type BalanceInfoType = { id: number; settlementId: number; roleId: number }

function useFetchColumns() {
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

  return {
    manualStatus,
    handleManualsettlement,
    handlePay,
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
