import { message } from 'antd'
import React, { useCallback, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
type ReturnRes = {
  batchLoading: boolean
  handleAction: <T>(keys: number[], api: (params: { idList: number[] }) => Promise<T>) => Promise<T>
}

/**
 * 批量操作hook
 * @returns
 */
function useBatchSubmit(): ReturnRes {
  const [batchLoading, setBatchLoading] = useState<boolean>(false)

  const handleAction = useCallback(async <T,>(keys: number[], api: (params: { idList: number[] }) => Promise<T>) => {
    const selectedRowKeys = keys
    if (selectedRowKeys.length === 0) {
      message.error(intl.formatMessage({ id: 'handling.qingxuanzehangshuju' }))
      // throw new Error("请选择行数据");
      return {
        code: -1,
      } as unknown as any
    }
    setBatchLoading(true)
    const res = await api({
      idList: selectedRowKeys,
    })
    setBatchLoading(false)
    return res
  }, [])
  return { batchLoading, handleAction }
}

export default useBatchSubmit
