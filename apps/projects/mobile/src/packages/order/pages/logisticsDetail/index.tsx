import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { ScrollView } from '@tarojs/components'
import { Text, View } from '@apps/mobile-ui'
import { getLogisticsMobileTrackingLatest, getOrderMobileBuyerDetail } from '@apps/apis'
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
  const { orderId, logisticsOrderId: routeLogisticsOrderId }: any = getCurrentInstance()?.router?.params || {}
  const [loading, setLoading] = useState(true)
  const [trackingDetail, setTrackingDetail] = useState<any>(null)

  const loadTrackingDetail = async (logisticsOrderId?: string | number) => {
    if (!logisticsOrderId) {
      setTrackingDetail(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await getLogisticsMobileTrackingLatest({
        logisticsOrderId: `${logisticsOrderId}`,
      })
      if (res.code === 1000) {
        setTrackingDetail(res.data || null)
      } else {
        setTrackingDetail(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (routeLogisticsOrderId) {
        await loadTrackingDetail(routeLogisticsOrderId)
        return
      }
      if (!orderId) {
        setLoading(false)
        return
      }
      try {
        const detailRes = await getOrderMobileBuyerDetail({ orderId })
        if (detailRes.code === 1000) {
          const firstDelivery = detailRes.data?.deliveries?.find((item: any) => !!item?.logisticsOrderId)
          await loadTrackingDetail(firstDelivery?.logisticsOrderId)
          return
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [orderId, routeLogisticsOrderId])

  const latestEvent = trackingDetail?.events?.[0]
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
  const currentLocation = latestEvent?.acceptStation || trackingDetail?.expressCompanyName || '暂无定位信息'
  const events = trackingDetail?.events || []

  return (
    <View className={styles.page}>
      <View className={styles.map}>
        <View className={styles['map-placeholder']}>
          <Text className={styles['map-placeholder-title']}>{statusText}</Text>
          <Text className={styles['map-placeholder-desc']}>{latestDescription}</Text>
        </View>
      </View>
      <View className={styles['location-tag']}>
        <Text className={styles['location-label']}>当前位置</Text>
        <Text>{currentLocation}</Text>
      </View>
      <View className={styles.panel} style={{ height: '58vh' }}>
        <View className={styles['drag-area']}>
          <View className={styles.handle} />
          <View className={styles['summary-row']}>
            <View>
              <Text className={styles['summary-status']}>{statusText}</Text>
              <Text className={styles['summary-description']}>{latestDescription}</Text>
              {!!trackingDetail?.mailNo && (
                <Text className={styles['summary-description']}>
                  {trackingDetail?.expressCompanyName} | {trackingDetail?.mailNo}
                </Text>
              )}
            </View>
          </View>
        </View>
        <ScrollView scrollY className={styles.timeline} style={{ height: '100%' }}>
          {loading && <Text className={styles['mock-tip']}>物流信息加载中...</Text>}
          {!loading && !events.length && <Text className={styles['mock-tip']}>暂无物流轨迹</Text>}
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
        </ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(LogisticsDetail)
