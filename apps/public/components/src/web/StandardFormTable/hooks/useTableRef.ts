import { useRef } from 'react'
import { ActionType } from '../types'

export const useTableRef = () => {
  const tableRef = useRef<ActionType>({} as ActionType)

  return tableRef
}
