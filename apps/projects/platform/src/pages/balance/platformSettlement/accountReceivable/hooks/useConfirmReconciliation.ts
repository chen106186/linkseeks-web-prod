import { useState, useEffect } from 'react';


type ReconciliationInfoType = {
  /** 结算id */
  id: number,
  /** 结算时间 */
  settlementDate: string,
  /** 付款方名字 */
  payName: string
}

/** 确认对账完成 */
function useConfirmReconciliation() {
  const [visible, setVisible] = useState<boolean>(false);
  const [reconciliationInfo, setReconciliationInfo] = useState<ReconciliationInfoType | null>(null)

  const handleReconciliationOpen = (params: ReconciliationInfoType) => {
    setReconciliationInfo(params)
    setVisible(true)
  }

  const handleReconciliationClose = () => {
    setVisible(false);
  }

  return {
    reconciliationModalVisible: visible,
    handleReconciliationClose,
    handleReconciliationOpen,
    reconciliationInfo
  }

}

export default useConfirmReconciliation
