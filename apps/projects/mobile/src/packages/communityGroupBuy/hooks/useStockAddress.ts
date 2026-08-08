/**
 * @Description 配送至业务 hook
 */
import { useState } from 'react'
import { StockStatus } from '../components/Stock'
import { StockAddressValueType } from '../components/StockAddressPopup'

const useStockAddress = () => {
  const [visibleStockAddressPopup, setVisibleStockAddressPopup] = useState(false)
  const [stockAddress, setStockAddress] = useState<StockAddressValueType | null>(null)
  const [stockStatus, setStockStatus] = useState<StockStatus>(0)

  const handleVisibleStockAddressPopup = (flag?: boolean) => {
    setVisibleStockAddressPopup(!!flag)
  }

  const handleStockAddressChange = (value: StockAddressValueType) => {
    setStockAddress(value)
  }

  const handleStockStatusChange = (status: StockStatus) => {
    setStockStatus(status)
  }

  return {
    visibleStockAddressPopup,
    handleVisibleStockAddressPopup,
    stockAddress,
    handleStockAddressChange,
    stockStatus,
    handleStockStatusChange,
  }
}

export default useStockAddress
