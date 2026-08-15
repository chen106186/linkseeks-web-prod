import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useMemo, useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Text, View } from '@apps/mobile-ui'
import { getLogisticsMobileTrackingLatest, GetLogisticsMobileTrackingLatestResponse } from '@apps/apis'
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
  const { logisticsOrderId }: any = getCurrentInstance()?.router?.params || {}
  const [loading, setLoading] = useState(true)
  const [trackingDetail, setTrackingDetail] = useState<GetLogisticsMobileTrackingLatestResponse | null>(null)

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
        limit: 0,
      } as any)
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
    loadTrackingDetail(logisticsOrderId)
  }, [logisticsOrderId])

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
              {!!trackingDetail?.mailNo && (
                <Text className={styles['summary-description']}>
                  {trackingDetail?.expressCompanyName || '物流公司'} | {trackingDetail?.mailNo}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className={styles.timeline}>
          {loading && <Text className={styles['empty-tip']}>物流信息加载中...</Text>}
          {!loading && !events.length && <Text className={styles['empty-tip']}>暂无物流轨迹</Text>}
          {!loading &&
            events.map((item: any, index: number) => {
              const description = item.acceptStation || item.remark || ''
              let eventStatus = STATUS_MAP[item.opCode] || '物流更新'
              if (/退签/.test(description)) {
                eventStatus = '已退签'
              } else if (/签收|领取/.test(description)) {
                eventStatus = '已签收'
              } else if (/派件|派送/.test(description)) {
                eventStatus = '派件中'
              } else if (/揽收|揽件/.test(description)) {
                eventStatus = '已揽收'
              } else if (/疑难|异常|问题件/.test(description)) {
                eventStatus = '疑难件'
              } else if (/运输|到达|离开|发往|转运|中转/.test(description)) {
                eventStatus = '运输中'
              } else if (item.opCode === '3' && index > 0) {
                eventStatus = '物流更新'
              }
              return (
                <View className={styles['timeline-item']} key={`${item.acceptTime || index}-${item.opCode || ''}`}>
                  <View className={styles['timeline-axis']}>
                    <View className={index === 0 ? styles['active-dot'] : styles.dot} />
                    {index < events.length - 1 && <View className={styles.line} />}
                  </View>
                  <View className={styles['timeline-content']}>
                    <View className={styles['timeline-title-row']}>
                      <Text className={index === 0 ? styles['active-title'] : styles['timeline-title']}>
                        {eventStatus}
                      </Text>
                      <Text className={styles.time}>{item.acceptTime}</Text>
                    </View>
                    <Text className={styles.description}>{description || '-'}</Text>
                  </View>
                </View>
              )
            })}
        </View>
      </View>
    </View>
  )
}

export default GlobalWrapper(LogisticsDetail)
