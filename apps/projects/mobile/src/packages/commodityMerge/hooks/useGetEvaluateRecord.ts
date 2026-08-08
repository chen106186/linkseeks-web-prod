import { useEffect, useState } from 'react'
import { useRouter } from '@apps/mobile-services/utils/taro'
import {
  getMemberMobileCommentMallTradeHistoryPage,
  GetMemberMobileCommentMallTradeHistoryPageResponse,
} from '@apps/apis'

type OptionsType = {
  /**
   * 商品id
   */
  commodityId: number
}

const RECORD_LEN = 3

// 商品评价记录
function useGetEvaluateRecord(options: OptionsType) {
  const { commodityId } = options
  const [evaluateRecordLoading, setEvaluateRecordLoading] = useState<boolean>(false)
  const [evaluateRecord, setEvaluateRecord] = useState<GetMemberMobileCommentMallTradeHistoryPageResponse>({
    data: [],
    totalCount: 0,
  })
  const router = useRouter()
  const {
    params: { routerShopType },
  } = router

  useEffect(() => {
    if (!commodityId) {
      return
    }
    async function getData() {
      try {
        setEvaluateRecordLoading(true)
        const params = {
          shopType: `${1 || routerShopType}`,
          productId: `${commodityId}`,
          starLevel: '0',
          current: `${1}`,
          pageSize: `${RECORD_LEN}`,
        }
        const { data, code } = await getMemberMobileCommentMallTradeHistoryPage(params)
        if (code === 1000) {
          setEvaluateRecord(data)
        }
      } finally {
        setEvaluateRecordLoading(false)
      }
    }
    getData()
  }, [])
  return { evaluateRecordLoading, evaluateRecord }
}

export default useGetEvaluateRecord
