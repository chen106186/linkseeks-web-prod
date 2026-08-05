import { getManageAreaAll } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const createFlatData = (data: any[], target = {}) => {
  if (data.length === 0) {
    return target
  }
  data.forEach((item) => {
    if (item.areaRespList) {
      createFlatData(item.areaRespList, target)
    }

    target[item.code] = item
  })

  return target
}
/**
 * 获取省市区区域列表
 */
export const useAreaAllList = () => {
  const { data, loading } = useRequestApi(getManageAreaAll, {
    cacheKey: 'area-all-list',
    staleTime: -1,
  })
  const flatData = useMemo(() => {
    return data ? createFlatData(data) : {}
  }, [data])

  return [data, loading, flatData] as any
}
