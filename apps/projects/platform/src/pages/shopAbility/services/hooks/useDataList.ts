import { getCommodityWebStoreWebStoreList } from '@apps/apis'
import { authService } from '@apps/services'
import { useState, useEffect } from 'react'
import { StoreItemType } from '../types'

const useDataList = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<StoreItemType[]>([])

  const fetchDateList = () => {
    setLoading(true)
    getCommodityWebStoreWebStoreList()
      .then((res) => {
        if (res.code === 1000 && res.data) {
          setDataList(res.data)
        }
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDateList()
  }, [])

  const refresh = () => fetchDateList()

  return {
    loading,
    dataList,
    refresh,
  }
}

export default useDataList
