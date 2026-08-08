import React, { useCallback, useState } from 'react'
import { DataPropsType } from '../../components/MachiningDetail'
import useModal from './useModal'

type ResultData = {
  processDataProps: DataPropsType
  handleViewDetail: (record: any) => void
  visible: boolean
  toggle: (flag: boolean) => void
}

const useViewProcessInfo = (): ResultData => {
  const [processDataProps, setProcessDataProps] = useState<DataPropsType>({} as any)
  const { visible, toggle } = useModal()
  const handleViewDetail = useCallback((record: any) => {
    const dataProps = {
      productId: record.productId,
      name: record.productName,
      category: record.category,
      brand: record.brand,
      unitName: record.unit,
      processUnitPrice: record.processPrice,
      quantity: record.processNum,
      isHasTax: (record as any).isHasTax,
      taxRate: (record as any).taxRate,
      productProps: (record.property as any).specs,
      files: (record.property as any).annex,
    }
    toggle(true)
    setProcessDataProps(dataProps)
  }, [])

  return { processDataProps, handleViewDetail, visible, toggle }
}

export default useViewProcessInfo
