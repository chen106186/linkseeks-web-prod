import { getLogisticsSelectListCompany, getManageAreaAll } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

/**
 * 获取物流公司列表
 */
export const useLogisticsCompany = () => {
  const { data, loading } = useRequestApi(getLogisticsSelectListCompany)

  const dispatchData = useMemo(() => {
    if (data) {
      return data.map((v) => ({
        label: v.name,
        value: v.id,
      }))
    } else {
      return data
    }
  }, [data])
  return [dispatchData, loading] as any
}
