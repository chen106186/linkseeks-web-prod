import GlobalWrapper from '@/components/GlobalWrapper'
import addressIcon from '@/assets/images/address_icon.png'
import Taro from '@tarojs/taro'
import { Map, MapProps, ScrollView, Text, View } from '@tarojs/components'
import React, { useMemo, useRef, useState } from 'react'
import { MOCK_LOGISTICS_DETAIL } from './mock'
import styles from './index.module.scss'

const { windowHeight = 667 } = Taro.getSystemInfoSync()
const EXPANDED_TOP = Math.round(windowHeight * 0.36)
const MIDDLE_TOP = Math.round(windowHeight * 0.56)
const COLLAPSED_TOP = Math.round(windowHeight * 0.72)
const SHEET_HEIGHT = windowHeight - EXPANDED_TOP
const SNAP_POINTS = [EXPANDED_TOP, MIDDLE_TOP, COLLAPSED_TOP]
const OVERVIEW_CENTER = { latitude: 35.25, longitude: 116.05 }

const createCallout = (content: string): MapProps.callout => ({
  content,
  color: '#542c19',
  fontSize: 13,
  anchorX: 0,
  anchorY: -8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#e8cbb1',
  bgColor: '#fcf6f0',
  padding: 8,
  display: 'ALWAYS',
  textAlign: 'center',
})

const LogisticsDetail = () => {
  const [sheetTop, setSheetTop] = useState(MIDDLE_TOP)
  const [dragging, setDragging] = useState(false)
  const [mapView, setMapView] = useState({ ...OVERVIEW_CENTER, scale: 6.8 })
  const dragRef = useRef({ startY: 0, startTop: MIDDLE_TOP })
  const latestSheetTopRef = useRef(MIDDLE_TOP)
  const lastMapUpdateRef = useRef(0)

  const markers = useMemo<MapProps.marker[]>(
    () => [
      {
        id: 1,
        ...MOCK_LOGISTICS_DETAIL.origin,
        iconPath: addressIcon,
        width: 24,
        height: 24,
        callout: createCallout(`发  ${MOCK_LOGISTICS_DETAIL.origin.name}`),
      },
      {
        id: 2,
        ...MOCK_LOGISTICS_DETAIL.current,
        iconPath: addressIcon,
        width: 30,
        height: 30,
        zIndex: 3,
        callout: createCallout(`${MOCK_LOGISTICS_DETAIL.status}\n${MOCK_LOGISTICS_DETAIL.current.name}`),
      },
      {
        id: 3,
        ...MOCK_LOGISTICS_DETAIL.destination,
        iconPath: addressIcon,
        width: 24,
        height: 24,
        callout: createCallout(`收  ${MOCK_LOGISTICS_DETAIL.destination.name}`),
      },
    ],
    [],
  )

  const polyline = useMemo<MapProps.polyline[]>(() => {
    const currentIndex = MOCK_LOGISTICS_DETAIL.route.findIndex(
      (point) =>
        point.latitude === MOCK_LOGISTICS_DETAIL.current.latitude &&
        point.longitude === MOCK_LOGISTICS_DETAIL.current.longitude,
    )
    return [
      {
        points: MOCK_LOGISTICS_DETAIL.route.slice(0, currentIndex + 1),
        color: '#d8612eee',
        width: 6,
        arrowLine: true,
        borderColor: '#fff0e4',
        borderWidth: 2,
      },
      {
        points: MOCK_LOGISTICS_DETAIL.route.slice(currentIndex),
        color: '#c78a4c99',
        width: 5,
        dottedLine: true,
      },
    ]
  }, [])

  const updateMapView = (nextTop: number, force = false) => {
    const now = Date.now()
    if (!force && now - lastMapUpdateRef.current < 50) return
    lastMapUpdateRef.current = now
    const progress = Math.max(0, Math.min(1, (COLLAPSED_TOP - nextTop) / (COLLAPSED_TOP - EXPANDED_TOP)))
    const focusLatitude = MOCK_LOGISTICS_DETAIL.current.latitude - 0.42
    setMapView({
      latitude: OVERVIEW_CENTER.latitude + (focusLatitude - OVERVIEW_CENTER.latitude) * progress,
      longitude:
        OVERVIEW_CENTER.longitude + (MOCK_LOGISTICS_DETAIL.current.longitude - OVERVIEW_CENTER.longitude) * progress,
      scale: Number((5.7 + progress * 3.3).toFixed(1)),
    })
  }

  const snapSheet = (currentTop: number) => {
    const targetTop = SNAP_POINTS.reduce((nearest, point) =>
      Math.abs(point - currentTop) < Math.abs(nearest - currentTop) ? point : nearest,
    )
    latestSheetTopRef.current = targetTop
    setSheetTop(targetTop)
    setDragging(false)
    updateMapView(targetTop, true)
  }

  const handleDragStart = (event) => {
    const touch = event.touches?.[0]
    if (!touch) return
    dragRef.current = { startY: touch.clientY, startTop: latestSheetTopRef.current }
    setDragging(true)
  }

  const handleDragMove = (event) => {
    const touch = event.touches?.[0]
    if (!touch) return
    const nextTop = Math.max(
      EXPANDED_TOP,
      Math.min(COLLAPSED_TOP, dragRef.current.startTop + touch.clientY - dragRef.current.startY),
    )
    latestSheetTopRef.current = nextTop
    setSheetTop(nextTop)
    updateMapView(nextTop)
  }

  const handleCopy = (value: string) => {
    Taro.setClipboardData({ data: value })
  }

  return (
    <View className={styles.page}>
      <Map
        className={styles.map}
        longitude={mapView.longitude}
        latitude={mapView.latitude}
        scale={mapView.scale}
        markers={markers}
        polyline={polyline}
        enablePoi={false}
        enableRotate={false}
        enableScroll
        enableZoom
        showScale
        onError={() => Taro.showToast({ title: '地图加载失败', icon: 'none' })}
      />

      <View className={styles.mapStatus}>
        <Text className={styles.mapStatusLabel}>当前位置</Text>
        <Text>{MOCK_LOGISTICS_DETAIL.current.name}</Text>
      </View>

      <View
        className={`${styles.sheet} ${dragging ? styles.sheetDragging : ''}`}
        style={{ transform: `translate3d(0, ${sheetTop}px, 0)`, height: `${SHEET_HEIGHT}px` }}
      >
        <View
          className={styles.sheetHeader}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={() => snapSheet(latestSheetTopRef.current)}
          onTouchCancel={() => snapSheet(latestSheetTopRef.current)}
        >
          <View className={styles.dragHandle} />
          <View className={styles.statusRow}>
            <View>
              <Text className={styles.status}>{MOCK_LOGISTICS_DETAIL.status}</Text>
              <Text className={styles.statusDescription}>{MOCK_LOGISTICS_DETAIL.statusDescription}</Text>
            </View>
            <Text className={styles.slideTip}>上下滑动查看</Text>
          </View>
        </View>

        <ScrollView
          className={styles.sheetScroll}
          style={{ height: `${SHEET_HEIGHT - 82}px` }}
          scrollY
          enhanced
          showScrollbar={false}
        >
          <View className={styles.content}>
            <View className={styles.pickupCard}>
              <View>
                <Text className={styles.pickupLabel}>取件码</Text>
                <Text className={styles.pickupCode}>{MOCK_LOGISTICS_DETAIL.pickupCode}</Text>
              </View>
              <Text className={styles.copyButton} onClick={() => handleCopy(MOCK_LOGISTICS_DETAIL.pickupCode)}>
                复制
              </Text>
            </View>

            <View className={styles.infoCard}>
              <View className={styles.companyRow}>
                <View className={styles.companyLogo}>顺</View>
                <View className={styles.companyInfo}>
                  <Text className={styles.companyName}>{MOCK_LOGISTICS_DETAIL.company}</Text>
                  <Text className={styles.secondaryText}>{MOCK_LOGISTICS_DETAIL.logisticsNo}</Text>
                </View>
                <Text className={styles.copyButton} onClick={() => handleCopy(MOCK_LOGISTICS_DETAIL.logisticsNo)}>
                  复制单号
                </Text>
              </View>

              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>快递员</Text>
                <View className={styles.infoValueGroup}>
                  <Text>{MOCK_LOGISTICS_DETAIL.courier}</Text>
                  <Text className={styles.secondaryText}>{MOCK_LOGISTICS_DETAIL.courierPhone}</Text>
                </View>
                <Text
                  className={styles.outlineButton}
                  onClick={() => Taro.showToast({ title: 'Mock 页面暂不拨打电话', icon: 'none' })}
                >
                  联系
                </Text>
              </View>

              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>订单编号</Text>
                <Text className={styles.orderValue}>{MOCK_LOGISTICS_DETAIL.orderNo}</Text>
                <Text className={styles.copyButton} onClick={() => handleCopy(MOCK_LOGISTICS_DETAIL.orderNo)}>
                  复制
                </Text>
              </View>

              <View className={styles.addressRow}>
                <Text className={styles.infoLabel}>收货地址</Text>
                <Text className={styles.addressValue}>{MOCK_LOGISTICS_DETAIL.address}</Text>
              </View>
            </View>

            <View className={styles.timelineCard}>
              <Text className={styles.cardTitle}>物流轨迹</Text>
              <View className={styles.timeline}>
                {MOCK_LOGISTICS_DETAIL.events.map((event, index) => (
                  <View className={styles.timelineItem} key={event.id}>
                    <View className={styles.timelineAxis}>
                      <View className={`${styles.timelineDot} ${event.active ? styles.timelineDotActive : ''}`} />
                      {index < MOCK_LOGISTICS_DETAIL.events.length - 1 && <View className={styles.timelineLine} />}
                    </View>
                    <View className={styles.timelineContent}>
                      <View className={styles.timelineTitleRow}>
                        <Text className={event.active ? styles.timelineTitleActive : styles.timelineTitle}>
                          {event.status}
                        </Text>
                        <Text className={styles.timelineTime}>{event.time}</Text>
                      </View>
                      <Text className={styles.timelineDescription}>{event.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.mockTip}>当前页面使用 Mock 物流数据，暂未对接后端接口</View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(LogisticsDetail)
