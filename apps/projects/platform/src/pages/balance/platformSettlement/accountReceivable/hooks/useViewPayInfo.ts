import { getSettlementPlatformSettlementGetReceivablePayProve } from '@apps/apis'
import { useState, useEffect, useCallback } from 'react'

type RecordType = {
  id: number
}

type PayInfoType = {
  id: number
  /** 支付状态 */
  statusName: string
  /** 支付时间 */
  settlementDate: string
  /** 结算金额 */
  amount: number
  /** 结算方 */
  name: string
  /** 1. 线下支付， 2.通联支付 */
  payWay: 1 | 2
  /** 支付方式 */
  payWayName: string
}

/** 查看付款凭证 */
function useViewPayInfo() {
  const [visible, setVisible] = useState<boolean>(false)
  const [visible1, setVisible1] = useState<boolean>(false)

  const [files, setFiles] = useState<any>([])
  const [payInfo, setPayInfo] = useState<PayInfoType | null>(null)

  const fetchVouchers = useCallback(async (params: { id: number }) => {
    const { code, data } = await getSettlementPlatformSettlementGetReceivablePayProve({ id: params.id.toString() })
    if (code === 1000) {
      setFiles(data)
    }
  }, [])

  const handleOpen = (params: any) => {
    // amount: 49.02
    // brokerage: 0.5
    // collectAmount: 49.52
    // communityGroupBuyingAmount: 0
    // estimatedPaymentDate: "2025-08-01"
    // id: 13
    // memberId: 5
    // payTime: "2025-07-15 09:18:25"
    // payWay: 2
    // payWayName: "通联支付结算"
    // roleId: 2
    // settlementDate: "2025-07-15"
    // settlementName: "元宵智鲜坊"
    // settlementNo: "202507080110000002"
    // settlementTime: "2025-07-14 08:46"
    // settlementWayName: "账期(按天)"
    // socialDistributionAmount: 0
    // status: 4
    // statusName: "已完成"
    // totalCount: 11

    setPayInfo(params)
    if (params.payWay === 1) {
      fetchVouchers({ id: params.id }).then(() => {
        setVisible(true)
      })
      return
    } else if (params.payWay === 2) {
      setVisible1(true)
      setPayInfo({ ...params, name: params.settlementName })
      return
    }

    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }
  const handleClose1 = () => {
    setVisible1(false)
  }

  return {
    files,
    payInfo,
    viewVisible: visible,
    viewVisible1: visible1,
    viewModalonCancel: handleClose,
    viewModalonCancel1: handleClose1,
    handleViewPayModal: handleOpen,
  }
}

export default useViewPayInfo
