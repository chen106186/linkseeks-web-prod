import useModal from '@/pages/customerAbility/memberEvaluate/hooks/useModal'
import { GetEnhanceSupplierToBeAddDetailsResponse } from '@apps/apis'
import React, { useCallback, useState } from 'react'
import { DataPropsType } from '../../components/MachiningDetail'

type ResultData = {
  processDataProps: DataPropsType
  handleViewDetail: (record: GetEnhanceSupplierToBeAddDetailsResponse['details'][0]) => void
  visible: boolean
  toggle: (flag: boolean) => void
}

const useViewProcessInfo = (): ResultData => {
  const [processDataProps, setProcessDataProps] = useState<DataPropsType>({} as any)
  const { visible, toggle } = useModal()
  const handleViewDetail = useCallback((record: GetEnhanceSupplierToBeAddDetailsResponse['details'][0]) => {
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
