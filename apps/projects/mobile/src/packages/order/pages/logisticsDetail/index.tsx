import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { Map, ScrollView } from '@tarojs/components'
import { Text, View } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { MOCK_LOGISTICS_DATA } from './mock'
import styles from './index.module.scss'

const markerIcon = getOssUrlPath('/miniprogram/assets/images/location.png')

const LogisticsDetail = () => {
  const windowHeight = Taro.getSystemInfoSync().windowHeight || 667
  const minPanelHeight = Math.round(windowHeight * 0.46)
  const maxPanelHeight = Math.round(windowHeight * 0.72)
  const [panelHeight, setPanelHeight] = useState(minPanelHeight)
  const [mapScale, setMapScale] = useState(9)
  const panelHeightRef = useRef(minPanelHeight)
  const dragRef = useRef({ startY: 0, startHeight: minPanelHeight })

  const markers = [
    {
      id: 1,
      latitude: MOCK_LOGISTICS_DATA.route[0].latitude,
      longitude: MOCK_LOGISTICS_DATA.route[0].longitude,
      iconPath: markerIcon,
      width: 30,
      height: 36,
      callout: {
        content: `${MOCK_LOGISTICS_DATA.status}\n${MOCK_LOGISTICS_DATA.currentLocation}`,
        color: '#5A2A12',
        fontSize: 13,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EAD9CD',
        bgColor: '#FDF9F5',
        padding: 8,
        display: 'ALWAYS' as const,
        textAlign: 'center' as const,
        anchorX: 0,
        anchorY: -8,
      },
    },
  ]

  const updatePanelHeight = (nextHeight: number) => {
    const height = Math.max(minPanelHeight, Math.min(maxPanelHeight, nextHeight))
    const progress = (height - minPanelHeight) / (maxPanelHeight - minPanelHeight)
    panelHeightRef.current = height
    setPanelHeight(height)
    setMapScale(Math.round(9 - progress * 2))
  }

  const handleTouchStart = (event: any) => {
    dragRef.current = {
      startY: event.touches[0].clientY,
      startHeight: panelHeightRef.current,
    }
  }

  const handleTouchMove = (event: any) => {
    const offsetY = dragRef.current.startY - event.touches[0].clientY
    updatePanelHeight(dragRef.current.startHeight + offsetY)
  }

  const handleTouchEnd = () => {
    const middleHeight = (minPanelHeight + maxPanelHeight) / 2
    updatePanelHeight(panelHeightRef.current >= middleHeight ? maxPanelHeight : minPanelHeight)
  }

  return (
    <View className={styles.page}>
      <Map
        className={styles.map}
        latitude={MOCK_LOGISTICS_DATA.center.latitude}
        longitude={MOCK_LOGISTICS_DATA.center.longitude}
        scale={mapScale}
        markers={markers}
        polyline={[
          {
            points: MOCK_LOGISTICS_DATA.route,
            color: '#C45124CC',
            width: 5,
            arrowLine: true,
          },
        ]}
        enableZoom
        onError={(event) => console.warn('物流地图加载失败', event.detail)}
      />
      <View className={styles['location-tag']}>
        <Text className={styles['location-label']}>当前位置</Text>
        <Text>{MOCK_LOGISTICS_DATA.currentLocation}</Text>
      </View>
      <View className={styles.panel} style={{ height: `${panelHeight}px` }}>
        <View
          className={styles['drag-area']}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <View className={styles.handle} />
          <View className={styles['summary-row']}>
            <View>
              <Text className={styles['summary-status']}>{MOCK_LOGISTICS_DATA.status}</Text>
              <Text className={styles['summary-description']}>{MOCK_LOGISTICS_DATA.latestDescription}</Text>
            </View>
          </View>
        </View>
        <ScrollView
          scrollY
          className={styles.timeline}
          style={{ height: `${Math.max(panelHeight - 108, 180)}px` }}
        >
          {MOCK_LOGISTICS_DATA.traces.map((item, index) => (
            <View className={styles['timeline-item']} key={`${item.time}-${item.status}`}>
              <View className={styles['timeline-axis']}>
                <View className={index === 0 ? styles['active-dot'] : styles.dot} />
                {index < MOCK_LOGISTICS_DATA.traces.length - 1 && <View className={styles.line} />}
              </View>
              <View className={styles['timeline-content']}>
                <View className={styles['timeline-title-row']}>
                  <Text className={index === 0 ? styles['active-title'] : styles['timeline-title']}>{item.status}</Text>
                  <Text className={styles.time}>{item.time}</Text>
                </View>
                <Text className={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
          <Text className={styles['mock-tip']}>当前页面使用 Mock 物流数据，暂未对接后端接口</Text>
        </ScrollView>
      </View>
    </View>
  )
}

export default GlobalWrapper(LogisticsDetail)
