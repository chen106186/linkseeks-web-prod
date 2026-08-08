import { useState, useEffect } from 'react'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

export const useModalTable = (options?) => {
  const [visible, setVisible] = useState(false)

  const [rowSelection, rowSelectionCtl] = useRowSelectionTable(options)

  return {
    visible,
    setVisible,
    rowSelection,
    rowSelectionCtl,
  }
}
