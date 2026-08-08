import { useEffect, useState } from 'react'
import { getMemberMobileCommentMallTradeSummary } from '@apps/apis'

type OptionsType = {
  /**
   * 商品id
   */
  commodityId: number
}

/** 获取总体满意度 */
function useGetTradeSummary(options: OptionsType) {
  const { commodityId } = options
  const [tradeSummary, setTradeSummary] = useState<number>(0)

  useEffect(() => {
    if (!commodityId) {
      return
    }
    async function getData() {
      const params = {
        shopType: `1`,
        productId: `${commodityId}`,
      }
      const { data, code } = await getMemberMobileCommentMallTradeSummary(params)
      if (code === 1000) {
        let sum = 0
        let praiseCount = 0
        data.rows.forEach((item) => {
          sum += item.sum
          if (item.star === 4 || item.star === 5) {
            praiseCount += item.sum
          }
        })
        setTradeSummary(sum > 0 ? parseInt(`${(praiseCount / sum) * 100}`, 10) : 0)
      }
    }
    getData()
  }, [])

  return { tradeSummary }
}

export default useGetTradeSummary
