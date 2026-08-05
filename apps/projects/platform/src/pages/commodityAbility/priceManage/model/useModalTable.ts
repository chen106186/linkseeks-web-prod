import { useState, useEffect } from 'react'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

export const useModalTable = (options?) => {
  const [visible, setVisible] = useState(false)

  /**f */
  const [rowSelection, rowSelectionCtl] = useRowSelectionTable(options)

  /**是否阶梯价格 */
  const [ladderPrice, setLadderPrice] = useState<boolean>(false)
  /**是否批量设置 */
  const [isBatchSetting, setIsBatchSetting] = useState<boolean>(false)
  /**当前操作行 */
  const [curretSetPriceRow, setCurrentSetPriceRow] = useState<any>()

  return {
    visible,
    setVisible,
    ladderPrice,
    setLadderPrice,
    isBatchSetting,
    setIsBatchSetting,
    curretSetPriceRow,
    setCurrentSetPriceRow,
    rowSelection,
    rowSelectionCtl,
  }
}
