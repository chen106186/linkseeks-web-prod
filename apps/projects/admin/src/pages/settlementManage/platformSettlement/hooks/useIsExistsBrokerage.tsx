import React, { useState, useEffect, useCallback } from 'react'
import { getSettlementPlatformSettlementIsExistsBrokerage } from '@apps/apis'

/**
 * 是否拥有扣减佣金列，
 */
function useIsExistsBrokerage() {
  const [hasBrokerage, setHasBrokerage] = useState(false)

  useEffect(() => {
    async function fetchBrokerageStatus() {
      const { data, code } = await getSettlementPlatformSettlementIsExistsBrokerage()
      if (code === 1000) {
        setHasBrokerage(data)
      }
    }
    fetchBrokerageStatus()
  }, [])

  /**
   * 过滤掉佣金比率，扣减佣金
   */
  const filterColumns = useCallback(
    (columns, blackList) => {
      return hasBrokerage ? columns : columns.filter((_row) => !blackList.includes(_row.dataIndex))
    },
    [hasBrokerage],
  )

  return { hasBrokerage, filterColumns }
}

export default useIsExistsBrokerage
