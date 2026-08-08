import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 18:09:37
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 15:57:44
 * @Description:
 */
import React, { useState, useEffect, useRef } from 'react'
import { View } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import { checkMore } from '@/utils'
import {
  getOrderMobileCommonProductHistoryPage,
  GetOrderMobileCommonProductHistoryPageResponseDetail,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import Loading from '@/components/Loading'
import TransactionRecordItem from '../../../components/TransactionRecord'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PAGE_SIZE = 10
type RouteParams = {
  /**
   * 商品id
   */
  commodityId: string
  /**
   * 当前商城id
   */
  shopId: string
  /**
   * 商品定价类型
   */
  priceType: string
  /**
   * 当前商城id
   */
  routerShopId: string
}
const TransactionRecord: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { commodityId, shopId, priceType, routerShopId },
  } = router
  const [transactionRecord, setTransactionRecord] = useState<GetOrderMobileCommonProductHistoryPageResponseDetail[]>([])
  const [transactionRecordLoading, setTransactionRecordLoading] = useState(false)
  const [transactionRecordHasMore, setTransactionRecordHasMore] = useState(true)
  const pageRef = useRef<number>(1)
  const intl = useIntl()
  usePageInit()
  // 商品交易记录
  const getEvaluateRecord = (): Promise<GetOrderMobileCommonProductHistoryPageResponseDetail[]> => {
    if (transactionRecordLoading) {
      return Promise.reject()
    }
    setTransactionRecordLoading(true)
    return new Promise((resolve, reject) => {
      getOrderMobileCommonProductHistoryPage({
        shopId: shopId || routerShopId,
        productId: commodityId,
        current: `${pageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
      })
        .then((res) => {
          if (res.code === 1000) {
            setTransactionRecordHasMore(
              checkMore(pageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount),
            )
            resolve(res.data.data)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setTransactionRecordLoading(false)
        })
    })
  }
  useEffect(() => {
    getEvaluateRecord()
      .then((res) => {
        setTransactionRecord(res)
      })
      .catch(() => {})
  }, [])
  const handleLoadMore = () => {
    if (transactionRecordLoading || !transactionRecordHasMore) {
      return
    }
    pageRef.current += 1
    getEvaluateRecord()
      .then((res) => {
        setTransactionRecord(transactionRecord.concat(res))
      })
      .catch(() => {})
  }
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={
              +priceType !== 3
                ? intl.formatMessage({
                    id: 'commodityMerge.salesCampaignList.transaction',
                    defaultMessage: '全部交易记录',
                  })
                : intl.formatMessage({
                    id: 'commodityMerge.salesCampaignList.exchange',
                    defaultMessage: '全部兑换记录',
                  })
            }
          />
        </>
      }
    >
      {() => (
        <View className="transaction-record">
          <ScrollView className="transaction-record-scroll" onScrollToLower={handleLoadMore} scrollY>
            <View className="transaction-record-record">
              {transactionRecord.map((item) => (
                <View className="transaction-record-record-item" key={`${Math.random().toFixed(16).slice(2, 10)}`}>
                  <MellowCard>
                    <TransactionRecordItem data={item} />
                  </MellowCard>
                </View>
              ))}
            </View>
            <Loading loading={transactionRecordLoading} noMore={!transactionRecordHasMore} />
          </ScrollView>
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(TransactionRecord)
