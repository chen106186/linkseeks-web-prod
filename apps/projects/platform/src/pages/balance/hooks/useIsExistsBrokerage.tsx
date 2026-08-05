import { getSettlementPlatformSettlementIsExistsBrokerage } from '@apps/apis'
import { useEffect, useState } from 'react'

const useIsExistBrokerage = (columns, blackListDataIndex: string[]) => {
  const [retColumn, setRetColumn] = useState(columns)

  const fetchIsExist = async () => {
    const { data, code } = await getSettlementPlatformSettlementIsExistsBrokerage()
    if (code !== 1000) {
      return
    }
    if (!data) {
      const newColumn = retColumn.filter((item) => !blackListDataIndex.includes(item.dataIndex))
      setRetColumn(newColumn)
    }
  }

  useEffect(() => {
    fetchIsExist()
  }, [])

  return { retColumn }
}

export default useIsExistBrokerage
