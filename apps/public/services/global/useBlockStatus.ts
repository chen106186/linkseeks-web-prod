import { useMemo, useState } from 'react'

export enum BLOCK_STATUS {
  ADD = 'ADD',
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW',
  DELETE = 'DELETE',
  DEFAULT = '',
}
export interface BlockStatusOption {
  showTitle?: {
    [key in BLOCK_STATUS]?: string
  }
  defaultStatus?: BLOCK_STATUS
}

export const useBlockStatus = (option: BlockStatusOption) => {
  const { showTitle, defaultStatus } = option
  const [blockStatus, setBlockStatus] = useState(defaultStatus || BLOCK_STATUS.ADD)

  const title = useMemo(() => {
    if (showTitle) {
      return showTitle[blockStatus]
    } else {
      return ''
    }
  }, [blockStatus])

  return {
    title,
    blockStatus,
    setBlockStatus,
  }
}
