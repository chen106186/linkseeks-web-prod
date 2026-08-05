import { useEffect, useState } from 'react'
import { getCommodityShopPortalList } from '@apps/apis'
import { PortalItemType } from '../types'

interface PortalReturn {
  loading: boolean
  portalList: PortalItemType[]
  refresh: () => void
}

const usePortalList = (): PortalReturn => {
  const [portalList, setPortalList] = useState<PortalItemType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchPortalList = () => {
    setLoading(true)
    getCommodityShopPortalList()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPortalList(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchPortalList()
  }, [])

  const refresh = () => {
    fetchPortalList()
  }

  return {
    loading,
    portalList,
    refresh,
  }
}

export default usePortalList
