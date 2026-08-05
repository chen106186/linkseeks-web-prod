import GlobalWrapper from '@/components/GlobalWrapper'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-01 17:01:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 15:58:08
 * @Description: 评价记录
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { useIntl } from '@linkseeks/i18n'
import classNames from 'classnames'
import { checkMore } from '@/utils'
import {
  getMemberMobileCommentMallTradeHistoryPage,
  GetMemberMobileCommentMallTradeHistoryPageResponseDetail,
  getMemberMobileCommentMallTradeSummary,
  GetMemberMobileCommentMallTradeSummaryResponse,
} from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import Loading from '@/components/Loading'
import EvaluateRecordItem from '../../../components/EvaluateRecord'
import './index.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PAGE_SIZE = 10
type RouteParams = {
  /**
   * 商品id
   */
  commodityId: string
  /**
   * 商城类型
   */
  shopType: string
  /**
   * 商城类型
   */
  routerShopType: string
}
interface ListParams {
  /**
   * 每页行数
   */
  pageSize?: string
  /**
   * 评论级别
   */
  starLevel?: string
}
const EvaluateRecord: React.FC = () => {
  const router = useRouter<RouteParams>()
  const {
    params: { commodityId, shopType, routerShopType },
  } = router
  const [curAction, setCurAction] = useState(0)
  const [evaluateRecord, setEvaluateRecord] = useState<GetMemberMobileCommentMallTradeHistoryPageResponseDetail[]>([])
  const [evaluateRecordLoading, setEvaluateRecordLoading] = useState(false)
  const [evaluateRecordHasMore, setEvaluateRecordHasMore] = useState(true)
  const [tradeSummary, setTradeSummary] = useState<GetMemberMobileCommentMallTradeSummaryResponse>({
    avgStar: 0,
    rows: [],
  })
  const pageRef = useRef<number>(1)
  const intl = useIntl()
  usePageInit()
  // 商品评价记录
  const getEvaluateRecord = (
    params?: ListParams,
  ): Promise<GetMemberMobileCommentMallTradeHistoryPageResponseDetail[]> => {
    if (evaluateRecordLoading) {
      return Promise.reject()
    }
    setEvaluateRecordLoading(true)
    const payload = {
      productId: `${commodityId}`,
      shopType: `${shopType || routerShopType}`,
      starLevel: `${curAction}`,
      current: `${pageRef.current}`,
      pageSize: `${PAGE_SIZE}`,
      ...params,
    }
    return new Promise((resolve, reject) => {
      getMemberMobileCommentMallTradeHistoryPage(payload)
        .then((res) => {
          if (res.code === 1000) {
            setEvaluateRecordHasMore(
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
          setEvaluateRecordLoading(false)
        })
    })
  }

  // 获取总体满意度
  const getTradeSummary = () => {
    if (!commodityId) {
      return
    }
    const params = {
      shopType: `${shopType || routerShopType}`,
      productId: `${commodityId}`,
    }
    getMemberMobileCommentMallTradeSummary(params).then((res) => {
      if (res.code === 1000) {
        setTradeSummary(res.data)
      }
    })
  }
  useEffect(() => {
    getEvaluateRecord()
      .then((res) => {
        setEvaluateRecord(res)
      })
      .catch(() => {})
    getTradeSummary()
  }, [])
  const handleSelect = (key: number) => {
    if (key === curAction || evaluateRecordLoading) {
      return
    }
    setCurAction(key)
    pageRef.current = 1
    setEvaluateRecord([])
    setEvaluateRecordHasMore(true)
    getEvaluateRecord({
      starLevel: `${key}`,
    })
      .then((res) => {
        setEvaluateRecord(res)
      })
      .catch(() => {})
  }
  const handleLoadMore = () => {
    if (evaluateRecordLoading || !evaluateRecordHasMore) {
      return
    }
    pageRef.current += 1
    getEvaluateRecord()
      .then((res) => {
        setEvaluateRecord(evaluateRecord.concat(res))
      })
      .catch(() => {})
  }
  const actions = useMemo(
    () => [
      {
        title: intl.formatMessage({
          id: 'commodityMerge.evaluateRecord.all',
          defaultMessage: '全部',
        }),
        num: tradeSummary.rows.reduce((pre, now) => now.sum + pre, 0),
        key: 0,
      },
      {
        title: intl.formatMessage({
          id: 'commodityMerge.evaluateRecord.good',
          defaultMessage: '好评',
        }),
        num: tradeSummary.rows
          .filter((item) => item.star === 4 || item.star === 5)
          .reduce((pre, now) => now.sum + pre, 0),
        key: 3,
      },
      {
        title: intl.formatMessage({
          id: 'commodityMerge.evaluateRecord.notBad',
          defaultMessage: '中评',
        }),
        num: tradeSummary.rows.filter((item) => item.star === 3).reduce((pre, now) => now.sum + pre, 0),
        key: 2,
      },
      {
        title: intl.formatMessage({
          id: 'commodityMerge.evaluateRecord.bad',
          defaultMessage: '差评',
        }),
        num: tradeSummary.rows
          .filter((item) => item.star === 1 || item.star === 2)
          .reduce((pre, now) => now.sum + pre, 0),
        key: 1,
      },
    ],
    [tradeSummary],
  )
  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar
            title={intl.formatMessage({
              id: 'commodityMerge.evaluateRecord.nav',
              defaultMessage: '评价记录',
            })}
          />
        </>
      }
    >
      {() => (
        <View className="evaluate-record">
          <View className="evaluate-record-actions">
            {actions.map((item) => (
              <View
                className={classNames('evaluate-record-actions-item', {
                  'evaluate-record-actions-item__active': item.key === curAction,
                })}
                key={item.key}
                onClick={() => handleSelect(item.key)}
              >
                <Text
                  className={classNames('evaluate-record-actions-item-title', {
                    'evaluate-record-actions-item-title__active': item.key === curAction,
                  })}
                >
                  {`${item.title}(${item.num})`}
                </Text>
              </View>
            ))}
          </View>
          <View className="evaluate-record-scrollWrap">
            <ScrollView className="evaluate-record-scroll" onScrollToLower={handleLoadMore} scrollY>
              <View className="evaluate-record-record">
                {evaluateRecord.map((item) => (
                  <View className="evaluate-record-record-item" key={item.id}>
                    <MellowCard>
                      <EvaluateRecordItem data={item} />
                    </MellowCard>
                  </View>
                ))}
              </View>
              <Loading loading={evaluateRecordLoading} noMore={!evaluateRecordHasMore} />
            </ScrollView>
          </View>
        </View>
      )}
    </PageLayout>
  )
}
export default GlobalWrapper(EvaluateRecord)
