import { getManageContentNoticeGetContentNoticeTypeEnum } from '@apps/apis'
import { useEffect, useState } from 'react'

const useColumns = () => {
  const [columnOptions, setColumnOptions] = useState<{ value: string; label: string }[]>([])

  const getColumnType = async () => {
    const res = await getManageContentNoticeGetContentNoticeTypeEnum()
    if (res.code === 1000) {
      setColumnOptions(res?.data || [])
    }
  }

  useEffect(() => {
    getColumnType()
  }, [])

  return {
    columnOptions,
  }
}

export default useColumns
