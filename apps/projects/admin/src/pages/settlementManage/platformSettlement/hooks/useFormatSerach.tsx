import { formatTimeString } from '@/utils'
import { useCallback } from 'react'

export function useFormatSearch() {
  const formatData = useCallback((values) => {
    const format = 'YYYY-MM-DD'
    const { sourceDate, sourceDate2, ...rest } = values
    const payload = { ...rest }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.orderStartTime = formatTimeString(startDate, format)
      payload.orderEndTime = formatTimeString(endDate, format)
    }
    if (sourceDate2) {
      const [startDate, endDate] = sourceDate2.split(',')
      payload.payStartTime = formatTimeString(startDate, format)
      payload.payEndTime = formatTimeString(endDate, format)
    }
    return { ...payload }
  }, [])
  return { formatData }
}
