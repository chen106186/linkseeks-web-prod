import { useEffect, useState } from 'react'
import useStores from '@/store/useStores'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { getOrderMobileCommonProductHistoryPage, GetOrderMobileCommonProductHistoryPageResponse } from '@apps/apis'

type OptionsType = {
  /**
   * 商品id
   */
  commodityId: number
  /**
   * 指定的商城id，主要是处理积分商城的商城id是特殊的
   */
  specifyShopId?: number
}

const RECORD_LEN = 2

// 获取商品交易记录
function useGetTradeRecord(options: OptionsType) {
  const { commodityId, specifyShopId } = options
  const [transactionRecordLoading, setTransactionRecordLoading] = useState<boolean>(false)
  const [transactionRecord, setTransactionRecord] = useState<GetOrderMobileCommonProductHistoryPageResponse>({
    data: [],
    totalCount: 0,
  })
  const router = useRouter()
  const {
    params: { routerShopId },
  } = router
  const {
    userStore: { shopAndSite },
  } = useStores()

  useEffect(() => {
    if (!commodityId) {
      return
    }
    async function getData() {
      try {
        setTransactionRecordLoading(true)
        const params = {
          shopId: specifyShopId ? `${specifyShopId}` : `${shopAndSite?.id || routerShopId || 0}`,
          productId: `${commodityId}`,
          current: `${1}`,
          pageSize: `${RECORD_LEN}`,
        }
        const { data, code } = await getOrderMobileCommonProductHistoryPage(params)
        if (code === 1000) {
          setTransactionRecord(data)
        }
      } finally {
        setTransactionRecordLoading(false)
      }
    }
    getData()
  }, [specifyShopId])

  return { transactionRecordLoading, transactionRecord }
}

export default useGetTradeRecord
