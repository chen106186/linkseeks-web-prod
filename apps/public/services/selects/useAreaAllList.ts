import { getManageAreaAll } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const createFlatData = (data: any[], target1 = {}, target2 = {}) => {
  if (data.length === 0) {
    return { target1, target2 }
  }
  data = data.map((item) => {
    if (item.areaRespList) {
      item.children = item.areaRespList
      createFlatData(item.areaRespList, target1, target2)
    }
    item.label = item.name
    item.value = item.id
    target1[item.id] = item
    target2[item.code] = item
    return item
  })

  return {
    target1,
    target2,
  }
}
/**
 * 获取省市区区域列表
 */
export const useAreaAllList = () => {
  const { data, loading } = useRequestApi(getManageAreaAll)
  const { target1, target2 } = useMemo(() => {
    return data ? createFlatData(data) : { target1: undefined, target2: undefined }
  }, [data])

  return [data, loading, target1, target2] as any
}
