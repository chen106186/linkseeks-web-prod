import { useEffect, useState } from 'react'
import { getProductMobilePriceCurveSetGetIsShowPriceCurve } from '@apps/apis'

type OptionsType = {
  /**
   * 商品id
   */
  commodityId: number
}

function useGetPriceHistory(options: OptionsType) {
  const { commodityId } = options
  const [showHistoricalAnalysis, setShowHistoricalAnalysis] = useState(false)

  useEffect(() => {
    const getIsShowHistoricalAnalysis = () => {
      getProductMobilePriceCurveSetGetIsShowPriceCurve({
        commodityId: `${commodityId}`,
      }).then((res) => {
        if (res.code === 1000) {
          setShowHistoricalAnalysis(!!res.data)
        }
      })
    }
    getIsShowHistoricalAnalysis()
  }, [])
  return { showHistoricalAnalysis }
}

export default useGetPriceHistory
