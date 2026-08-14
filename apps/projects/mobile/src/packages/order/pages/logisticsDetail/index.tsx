import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Text, View } from '@apps/mobile-ui'
import { getOrderMobileBuyerDetail, OrderLogisticsDetail, postOrderPlatformManageLogisticsDetail } from '@apps/apis'
import styles from './index.module.scss'

const STATUS_MAP: Record<string, string> = {
  '0': '运输中',
  '1': '揽收中',
  '2': '疑难件',
  '3': '已签收',
  '4': '已退签',
  '5': '派件中',
}

const SUBSCRIBE_STATUS_MAP: Record<number, string> = {
  1: '运输中',
  2: '已签收',
  3: '订阅失败',
}

const LogisticsDetail = () => {
  const { orderId, orderNo: routeOrderNo, batchNo: routeBatchNo }: any = getCurrentInstance()?.router?.params || {}
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<OrderLogisticsDetail | null>(null)

  const loadLogisticsDetail = async (orderNo?: string, batchNo?: string | number) => {
    if (!orderNo) {
      setDetail(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await postOrderPlatformManageLogisticsDetail({
        orderNo,
        ...(batchNo ? { batchNo: Number(batchNo) } : {}),
      })
      if (res.code === 1000) {
        setDetail(res.data || null)
      } else {
        setDetail(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (routeOrderNo) {
        await loadLogisticsDetail(routeOrderNo, routeBatchNo)
        return
      }
      if (!orderId) {
        setLoading(false)
        return
      }
      try {
        const detailRes = await getOrderMobileBuyerDetail({ orderId })
        if (detailRes.code === 1000) {
          const firstDelivery = detailRes.data?.deliveries?.[0]
          await loadLogisticsDetail(detailRes.data?.orderNo, firstDelivery?.batchNo)
          return
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [orderId, routeOrderNo, routeBatchNo])

  const trackingDetail = detail?.trackingDetail
  const events = trackingDetail?.events || []
  const latestEvent = events[0]
  const statusText = useMemo(() => {
    if (latestEvent?.opCode && STATUS_MAP[latestEvent.opCode]) {
      return STATUS_MAP[latestEvent.opCode]
    }
    if (trackingDetail?.subscribeStatus && SUBSCRIBE_STATUS_MAP[trackingDetail.subscribeStatus]) {
      return SUBSCRIBE_STATUS_MAP[trackingDetail.subscribeStatus]
    }
    return '暂无物流信息'
  }, [latestEvent, trackingDetail])

  const latestDescription = latestEvent?.acceptStation || latestEvent?.remark || '暂无轨迹更新'

  return (
    <View className={styles.page}>
      <View className={styles.panel}>
        <View className={styles.summary}>
          <View className={styles['summary-row']}>
            <View>
              <Text className={styles['summary-status']}>{statusText}</Text>
              <Text className={styles['summary-description']}>{latestDescription}</Text>
              {!!(detail?.logisticsNo || trackingDetail?.mailNo) && (
                <Text className={styles['summary-description']}>
                  {detail?.company || trackingDetail?.expressCompanyName || '物流公司'} |{' '}
                  {detail?.logisticsNo || trackingDetail?.mailNo}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className={styles.timeline}>
          {loading && <Text className={styles['empty-tip']}>物流信息加载中...</Text>}
          {!loading && !events.length && <Text className={styles['empty-tip']}>暂无物流轨迹</Text>}
          {!loading &&
            events.map((item: any, index: number) => (
              <View className={styles['timeline-item']} key={`${item.acceptTime || index}-${item.opCode || ''}`}>
                <View className={styles['timeline-axis']}>
                  <View className={index === 0 ? styles['active-dot'] : styles.dot} />
                  {index < events.length - 1 && <View className={styles.line} />}
                </View>
                <View className={styles['timeline-content']}>
                  <View className={styles['timeline-title-row']}>
                    <Text className={index === 0 ? styles['active-title'] : styles['timeline-title']}>
                      {STATUS_MAP[item.opCode] || item.remark || '物流更新'}
                    </Text>
                    <Text className={styles.time}>{item.acceptTime}</Text>
                  </View>
                  <Text className={styles.description}>{item.acceptStation || item.remark || '-'}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </View>
  )
}

export default GlobalWrapper(LogisticsDetail)
