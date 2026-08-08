import { getSettlementPlatformSettlementGetReceivablePayProve } from '@apps/apis'
import { useCallback, useState } from 'react'

type FileType = {
  name: string
  /**
   * 凭证地址
   */
  proveUrl: string
}

type ConfirmPayInfoType = {
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

/** 确认付款凭证 */
function useConfirmPayInfo() {
  const [payFiles, setPayFiles] = useState<FileType[]>([])
  const [visible, setVisible] = useState<boolean>(false)
  const [confirmPayInfo, setConfirmPayInfo] = useState<ConfirmPayInfoType | null>(null)

  const fetchVouchers = useCallback(async (params: { id: number }) => {
    const { code, data } = await getSettlementPlatformSettlementGetReceivablePayProve({ id: params.id.toString() })
    if (code === 1000) {
      setPayFiles(data)
    }
  }, [])

  const handleOpen = (params: ConfirmPayInfoType) => {
    console.log(handleOpen, 'handleOpenhandleOpenhandleOpenhandleOpen')
    setConfirmPayInfo(params)
    fetchVouchers({ id: params.id }).then(() => {
      setVisible(true)
    })
  }

  const handleClose = () => {
    setVisible(false)
  }

  return {
    payFiles,
    confirmPayInfo,
    confirmPayVisible: visible,
    handleConfirmCompletePaymentStatus: handleOpen,
    confirmPayOnCancel: handleClose,
  }
}

export default useConfirmPayInfo
