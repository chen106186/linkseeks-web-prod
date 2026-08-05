import { useState } from 'react'
import { SpecsAttributeTableRow } from '../models/SpecsAttributeTableItem'

/**
 * 规格属性弹窗出现的表格
 */
export const useSpecsAttributeDataTable = () => {
  const [columns, setColumns] = useState<any[]>([])
  const [dataSource, setDataSource] = useState<SpecsAttributeTableRow[]>([])

  return {
    columns,
    setColumns,
    dataSource,
    setDataSource,
  }
}
