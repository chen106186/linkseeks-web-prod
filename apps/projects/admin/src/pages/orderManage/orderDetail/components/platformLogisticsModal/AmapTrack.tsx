import React, { useEffect, useMemo, useRef } from 'react'

const AMAP_KEY = 'c1d47ecf315a019cc6fc902cb7317d04'
const AMAP_SECURITY_CODE = '857adc138889ea61771607498d13cd98'

let amapLoader: Promise<any> | null = null

const loadAmap = () => {
  if ((window as any).AMap) {
    return Promise.resolve((window as any).AMap)
  }
  if (!amapLoader) {
    amapLoader = new Promise((resolve, reject) => {
      ;(window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
      script.onload = () => resolve((window as any).AMap)
      script.onerror = () => {
        amapLoader = null
        reject(new Error('AMap load failed'))
      }
      document.head.appendChild(script)
    })
  }
  return amapLoader
}

export interface TrackPoint {
  lat?: number
  lng?: number
  acceptTime?: string
  acceptStation?: string
  remark?: string
  opCode?: string
}

export interface AmapTrackProps {
  events: TrackPoint[]
  height?: number
}

const AmapTrack: React.FC<AmapTrackProps> = ({ events, height = 180 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const points = useMemo(
    () =>
      (events || [])
        .filter((item) => item.lat != null && item.lng != null)
        .slice()
        .sort((a, b) => String(a.acceptTime || '').localeCompare(String(b.acceptTime || ''))),
    [events],
  )

  useEffect(() => {
    if (!points.length || !containerRef.current) {
      return undefined
    }
    let disposed = false
    loadAmap()
      .then((AMap) => {
        if (disposed || !containerRef.current) {
          return
        }
        if (!mapRef.current) {
          mapRef.current = new AMap.Map(containerRef.current, {
            zoom: 6,
            resizeEnable: true,
          })
        }
        const map = mapRef.current
        map.clearMap()
        const path = points.map((item) => [item.lng, item.lat])
        map.add(
          new AMap.Polyline({
            path,
            strokeColor: '#C45124',
            strokeWeight: 4,
            showDir: true,
            lineJoin: 'round',
          }),
        )
        const start = path[0]
        const current = path[path.length - 1]
        map.add(
          new AMap.CircleMarker({
            center: start,
            radius: 6,
            strokeColor: '#fff',
            strokeWeight: 2,
            fillColor: '#52c41a',
            fillOpacity: 1,
          }),
        )
        map.add(
          new AMap.CircleMarker({
            center: current,
            radius: 8,
            strokeColor: '#fff',
            strokeWeight: 2,
            fillColor: '#1677ff',
            fillOpacity: 1,
          }),
        )
        map.setFitView(null, false, [40, 40, 40, 40])
      })
      .catch(() => {
        // 地图加载失败时静默降级，仅展示时间轴
      })
    return () => {
      disposed = true
    }
  }, [points])

  useEffect(
    () => () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    },
    [],
  )

  if (!points.length) {
    return null
  }

  return <div ref={containerRef} style={{ width: '100%', height, borderRadius: 8, marginBottom: 16 }} />
}

export default AmapTrack
