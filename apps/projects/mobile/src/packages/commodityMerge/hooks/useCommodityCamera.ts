import { useEffect, useState } from 'react'
import { getCommodityMobileCameraListByCommodity, CommodityCameraMobileResp } from '@apps/apis'

type OptionsType = {
  commodityId?: number
}

function useCommodityCamera(options: OptionsType) {
  const { commodityId } = options
  const [cameras, setCameras] = useState<CommodityCameraMobileResp[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!commodityId) return
    let cancelled = false
    setLoading(true)
    getCommodityMobileCameraListByCommodity({ commodityId })
      .then((res) => {
        if (cancelled) return
        if (res?.code === 1000 && Array.isArray(res.data)) {
          const sorted = [...res.data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          setCameras(sorted)
        } else {
          setCameras([])
        }
      })
      .catch(() => {
        if (!cancelled) setCameras([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [commodityId])

  return { cameras, loading }
}

export default useCommodityCamera
