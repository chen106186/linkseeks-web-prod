import { getManageAreaAll } from '@apps/apis'
import type { GetManageAreaAllResponse } from '@apps/apis'
import { useEffect, useState } from 'react'

interface AreaItemType {
  label: string
  value: string
  children: AreaItemType[]
}

const useAreaCascader = () => {
  const [areaList, setAreaList] = useState<AreaItemType[]>([])

  /** 因为这个接口有街道数据，所以不适用递归方式，直接遍历到第三级的区数据 */
  const normalizeArea = (list: GetManageAreaAllResponse): AreaItemType[] => {
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item: any) => {
        return {
          value: item.code,
          label: item.name,
          // children: (item.areaRespList && item.areaRespList.length > 0)
          // 	? normalizeArea(item.areaRespList as GetManageAreaAllResponse)
          // 	: []
          children: item.areaRespList?.map((secondItem) => ({
            value: secondItem.code,
            label: secondItem.name,
            children: secondItem.areaRespList?.map((thirdItem) => ({
              value: thirdItem.code,
              label: thirdItem.name,
              children: [],
            })),
          })),
        }
      })
    }
    return []
  }

  const fetchAreaList = () => {
    getManageAreaAll().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setAreaList(normalizeArea(res.data))
      }
    })
  }

  useEffect(() => {
    fetchAreaList()
  }, [])

  return {
    areaList,
  }
}

export default useAreaCascader
