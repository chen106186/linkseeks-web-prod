import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useRef } from 'react'
import { useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, ScrollView, Tabs, TabsPane } from '@apps/mobile-ui'
import useStores from '@/store/useStores'
import Empty from '@/components/Empty'
import { checkMore } from '@/utils'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import {
  ORDER_TYPE_CENTRALIZED,
  ORDER_TYPE_CHANNEL_DIRECT,
  ORDER_TYPE_CHANNEL_POINTS,
  ORDER_TYPE_CHANNEL_STOCK,
  ORDER_TYPE_DEMAND,
  ORDER_TYPE_INQUIRY,
  ORDER_TYPE_POINTS,
  ORDER_TYPE_STOCK,
} from '@/constants/const/workbench'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import {
  getMemberMobileCommentCompletePage,
  getMemberMobileCommentReceivePage,
  getMemberMobileCommentWaitPage,
} from '@apps/apis'
import NotEvaluatedItem, { NotEvaluatedItemData } from './components/NotEvaluatedItem'
import EvaluatedItem, { EvaluatedItemData } from './components/EvaluatedItem'
import GenIndicator from './components/GenIndicator'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
const PAGE_SIZE = 10
interface ListParams {
  /**
   * 每页行数
   */
  pageSize?: string
}
const EvaluatingManage: React.FC = () => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  usePageInit()
  // setNavigationBarTitle({
  //   title: intl.formatMessage({ id: 'evaluatingManage.pingjiazhongxin', defaultMessage: '评价中心' }),
  // })
  const [notEvaluatedLoading, setNotEvaluatedLoading] = useState(false)
  const [notEvaluatedHasMore, setNotEvaluatedHasMore] = useState(true)
  const [notEvaluatedRefreshing, setNotEvaluatedRefreshing] = useState(false)
  const [notEvaluated, setNotEvaluated] = useState<NotEvaluatedItemData[]>([])
  const [notEvaluatedTotal, setNotEvaluatedTotal] = useState(0)
  const [evaluatedLoading, setEvaluatedLoading] = useState(false)
  const [evaluatedHasMore, setEvaluatedHasMore] = useState(true)
  const [evaluatedRefreshing, setEvaluatedRefreshing] = useState(false)
  const [evaluated, setEvaluated] = useState<EvaluatedItemData[]>([])
  const [evaluatedTotal, setEvaluatedTotal] = useState(0)
  const [sellerEvaluatedLoading, setSellerEvaluatedLoading] = useState(false)
  const [sellerEvaluatedHasMore, setSellerEvaluatedHasMore] = useState(true)
  const [sellerEvaluatedRefreshing, setSellerEvaluatedRefreshing] = useState(false)
  const [sellerEvaluated, setSellerEvaluated] = useState<EvaluatedItemData[]>([])
  const [sellerEvaluatedTotal, setSellerEvaluatedTotal] = useState(0)
  const [actived, setActived] = useState(0)
  const {
    userStore: { userInfo },
  } = useStores()
  const notEvaluatedPageRef = useRef<number>(1)
  const evaluatedPageRef = useRef<number>(1)
  const sellerEvaluatedPageRef = useRef<number>(1)
  const _normalizeNotEvaluatedList = (data: any[]) => {
    const ret: NotEvaluatedItemData[] = []
    data.forEach((item: any) => {
      const atom: NotEvaluatedItemData = {
        ...item,
        id: item.orderProductId,
        picture: item.logo,
        orderId: item.orderProductId,
      }
      ret.push(atom)
    })
    return ret
  }
  const _normalizeEvaluatedList = (data: any[], isSeller?: boolean) => {
    const ret: EvaluatedItemData[] = []
    data.forEach((item: any) => {
      const atom: EvaluatedItemData = {
        ...item,
        subMemberName: item[isSeller ? 'memberName' : 'subMemberName'],
        subMemberNameAvatar: item[isSeller ? 'memberLogo' : 'subMemberLogo'],
      }
      ret.push(atom)
    })
    return ret
  }

  // 获取待评价列表
  const getNotEvaluatedList = (): Promise<{
    data: NotEvaluatedItemData[]
    total: number
  }> => {
    if (!userInfo) {
      Router.redirectTo('user/login')
      return Promise.reject()
    }
    setNotEvaluatedLoading(true)
    const payload: any = {
      current: `${notEvaluatedPageRef.current}`,
      pageSize: `${PAGE_SIZE}`,
    }
    return new Promise((resolve, reject) => {
      getMemberMobileCommentWaitPage(payload)
        .then((res) => {
          if (res.code === 1000) {
            setNotEvaluatedHasMore(
              checkMore(notEvaluatedPageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount),
            )
            resolve({
              data: _normalizeNotEvaluatedList(res.data.data),
              total: res.data.totalCount,
            })
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setNotEvaluatedLoading(false)
        })
    })
  }

  // 获取已评价列表
  const getEvaluatedList = (): Promise<{
    data: EvaluatedItemData[]
    total: number
  }> => {
    if (!userInfo) {
      Router.redirectTo('user/login')
      return Promise.reject()
    }
    setEvaluatedLoading(true)
    return new Promise((resolve, reject) => {
      getMemberMobileCommentCompletePage({
        current: `${evaluatedPageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
      })
        .then((res) => {
          if (res.code === 1000) {
            setEvaluatedHasMore(
              checkMore(evaluatedPageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount),
            )
            resolve({
              data: _normalizeEvaluatedList(res.data.data),
              total: res.data.totalCount,
            })
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setEvaluatedLoading(false)
        })
    })
  }
  // 获取卖家评价列表
  const getSellerEvaluatedList = (): Promise<{
    data: EvaluatedItemData[]
    total: number
  }> => {
    if (!userInfo) {
      Router.redirectTo('user/login')
      return Promise.reject()
    }
    setSellerEvaluatedLoading(true)
    return new Promise((resolve, reject) => {
      getMemberMobileCommentReceivePage({
        current: `${sellerEvaluatedPageRef.current}`,
        pageSize: `${PAGE_SIZE}`,
      })
        .then((res) => {
          if (res.code === 1000) {
            setSellerEvaluatedHasMore(
              checkMore(sellerEvaluatedPageRef.current, PAGE_SIZE, (res.data.data || []).length, res.data.totalCount),
            )
            resolve({
              data: _normalizeEvaluatedList(res.data.data, true),
              total: res.data.totalCount,
            })
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setSellerEvaluatedLoading(false)
        })
    })
  }

  // 重新加载待评价列表
  const refreshNotEvaluated = () => {
    if (notEvaluatedRefreshing) {
      return
    }
    notEvaluatedPageRef.current = 1
    setNotEvaluatedRefreshing(true)
    getNotEvaluatedList()
      .then((res) => {
        setNotEvaluated(res.data)
        setNotEvaluatedTotal(res.total)
      })
      .catch(() => {})
      .finally(() => {
        setNotEvaluatedRefreshing(false)
      })
  }

  // 重新加载已评价列表
  const refreshEvaluated = () => {
    if (evaluatedRefreshing) {
      return
    }
    evaluatedPageRef.current = 1
    setEvaluatedRefreshing(true)
    getEvaluatedList()
      .then((res) => {
        setEvaluated(res.data)
        setEvaluatedTotal(res.total)
      })
      .catch(() => {})
      .finally(() => {
        setEvaluatedRefreshing(false)
      })
  }

  // 重新加载卖家评价列表
  const refreshSellerEvaluated = () => {
    if (sellerEvaluatedRefreshing) {
      return
    }
    sellerEvaluatedPageRef.current = 1
    setSellerEvaluatedRefreshing(true)
    getSellerEvaluatedList()
      .then((res) => {
        setSellerEvaluated(res.data)
        setSellerEvaluatedTotal(res.total)
      })
      .catch(() => {})
      .finally(() => {
        setSellerEvaluatedRefreshing(false)
      })
  }
  const refresh = () => {
    refreshNotEvaluated()
    refreshEvaluated()
    refreshSellerEvaluated()
  }
  const renderNotEvaluatedItem = ({ item }: { item: NotEvaluatedItemData }) => {
    const handleJumpEvaluating = (id: number) => {
      const current = notEvaluated.find((child) => child.id === id)
      if (current) {
        Router.navigateTo('extra/evaluatingManage/evaluating', {
          orderId: current.orderId,
        })
      }
    }
    return (
      <NotEvaluatedItem
        data={item}
        className={styles['evaluatingManage-notEvaluated-item']}
        onEvaluate={handleJumpEvaluating}
      />
    )
  }

  // 加载更多待评价列表
  const handleNotEvaluatedLoadMore = () => {
    if (notEvaluatedLoading || !notEvaluatedHasMore) {
      return
    }
    notEvaluatedPageRef.current += 1
    getNotEvaluatedList()
      .then((res) => {
        setNotEvaluated(notEvaluated.concat(res.data))
        setNotEvaluatedTotal(res.total)
      })
      .catch(() => {})
  }
  const handleJumpProductDetail = (record: EvaluatedItemData) => {
    let route
    const rest: {
      /**
       * 渠道会员id
       */
      commodityId?: number
      channelMemberId?: number
    } = {
      commodityId: record.productId,
    }
    switch (record.orderType) {
      case ORDER_TYPE_INQUIRY: {
        return jmpProductDetail(PRICE_TYPE_ENUM.CONSULTING, {
          skuId: record.skuId,
          ...rest,
        })
      }
      case ORDER_TYPE_DEMAND: {
        route = 'order/mycommodityDetails'
        break
      }
      case ORDER_TYPE_STOCK: {
        return jmpProductDetail(PRICE_TYPE_ENUM.SPOT, {
          skuId: record.skuId,
          ...rest,
        })
      }
      case ORDER_TYPE_CENTRALIZED: {
        route = 'order/mycommodityDetails'
        break
      }
      case ORDER_TYPE_CHANNEL_DIRECT: {
        route = 'order/mycommodityDetails'
        rest.channelMemberId = record.productMemberId
        break
      }
      case ORDER_TYPE_CHANNEL_STOCK: {
        route = 'order/mycommodityDetails'
        rest.channelMemberId = record.productMemberId
        break
      }
      case ORDER_TYPE_POINTS: {
        return jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, {
          skuId: record.skuId,
          ...rest,
        })
      }
      case ORDER_TYPE_CHANNEL_POINTS: {
        rest.channelMemberId = record.productMemberId
        return jmpProductDetail(PRICE_TYPE_ENUM.INTEGRAL, {
          skuId: record.skuId,
          ...rest,
        })
      }
      default:
        break
    }
    if (route) {
      Router.navigateTo(route, {
        skuId: record.skuId,
        ...rest,
      })
    }
  }
  const renderEvaluatedItem = ({ item }: { item: EvaluatedItemData }) => (
    <EvaluatedItem
      data={item}
      className={styles['evaluatingManage-notEvaluated-item']}
      onClickProduct={() => handleJumpProductDetail(item)}
    />
  )

  // 加载更多已评价列表
  const handleEvaluatedLoadMore = () => {
    if (evaluatedLoading || !evaluatedHasMore) {
      return
    }
    evaluatedPageRef.current += 1
    getEvaluatedList()
      .then((res) => {
        setEvaluated(evaluated.concat(res.data))
        setEvaluatedTotal(res.total)
      })
      .catch(() => {})
  }

  // 加载更多卖家评价列表
  const handleSellerEvaluatedLoadMore = () => {
    if (sellerEvaluatedLoading || !sellerEvaluatedHasMore) {
      return
    }
    sellerEvaluatedPageRef.current += 1
    getSellerEvaluatedList()
      .then((res) => {
        setSellerEvaluated(sellerEvaluated.concat(res.data))
        setSellerEvaluatedTotal(res.total)
      })
      .catch(() => {})
  }
  const handleTabsChange = (key: number) => {
    setActived(key)
  }
  useDidShow(() => {
    refresh()
  })
  return (
    <View className={styles['evaluatingManage']}>
      <Tabs
        display
        height="100%"
        current={actived}
        tabList={[
          {
            title: intl.formatMessage({
              id: 'evaluatingManage.daipingjia',
              defaultMessage: '待评价',
              data: `(${notEvaluatedTotal})`,
            }),
          },
          {
            title: intl.formatMessage({
              id: 'evaluatingManage.yipingjia',
              defaultMessage: '已评价',
              data: `(${evaluatedTotal})`,
            }),
          },
          {
            title: intl.formatMessage({
              id: 'evaluatingManage.maijiapingjia',
              defaultMessage: '卖家评价',
              data: `(${sellerEvaluatedTotal})`,
            }),
          },
        ]}
        onClick={handleTabsChange}
      >
        <TabsPane display current={actived} index={0}>
          <View className={styles['tabs-pane__view']}>
            <ScrollView
              className={styles['evaluatingManage-notEvaluated']}
              data={notEvaluated}
              renderItem={renderNotEvaluatedItem}
              keyExtractor={(item) => `${item.id}`}
              onEndReached={handleNotEvaluatedLoadMore}
              listEmptyComponent={<Empty />}
              listFooterComponent={
                notEvaluated.length ? (
                  <GenIndicator loading={notEvaluatedLoading} noMore={!notEvaluatedHasMore} />
                ) : null
              }
              onEndReachedThreshold={50}
              onRefresh={refreshNotEvaluated}
              refreshing={notEvaluatedRefreshing}
              style={{
                backgroundColor: '#F4F5F7',
              }}
            />
          </View>
        </TabsPane>
        <TabsPane display current={actived} index={1}>
          <View className={styles['tabs-pane__view']}>
            <ScrollView
              className={styles['evaluatingManage-notEvaluated']}
              data={evaluated}
              renderItem={renderEvaluatedItem}
              keyExtractor={(item) => `${item.id}`}
              onEndReached={handleEvaluatedLoadMore}
              listEmptyComponent={<Empty />}
              listFooterComponent={
                evaluated.length ? <GenIndicator loading={evaluatedLoading} noMore={!evaluatedHasMore} /> : null
              }
              onEndReachedThreshold={50}
              onRefresh={refreshEvaluated}
              refreshing={evaluatedRefreshing}
              style={{
                backgroundColor: '#F4F5F7',
              }}
            />
          </View>
        </TabsPane>
        <TabsPane display current={actived} index={2}>
          <View className={styles['tabs-pane__view']}>
            <ScrollView
              className={styles['evaluatingManage-notEvaluated']}
              data={sellerEvaluated}
              renderItem={renderEvaluatedItem}
              keyExtractor={(item) => `${item.id}`}
              onEndReached={handleSellerEvaluatedLoadMore}
              listEmptyComponent={<Empty />}
              listFooterComponent={
                sellerEvaluated.length ? (
                  <GenIndicator loading={sellerEvaluatedLoading} noMore={!sellerEvaluatedHasMore} />
                ) : null
              }
              onEndReachedThreshold={50}
              onRefresh={refreshSellerEvaluated}
              refreshing={sellerEvaluatedRefreshing}
              style={{
                backgroundColor: '#F4F5F7',
              }}
            />
          </View>
        </TabsPane>
      </Tabs>
    </View>
  )
}
export default GlobalWrapper(EvaluatingManage)
