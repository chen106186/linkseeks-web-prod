import React, { useState, useMemo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import MellowCard from '@/components/MellowCard'
import type { CommodityCameraMobileResp } from '@apps/apis'
import './index.scss'

interface CameraLiveProps {
  cameras: CommodityCameraMobileResp[]
}

const CameraLive: React.FC<CameraLiveProps> = ({ cameras }) => {
  const [activeIdx, setActiveIdx] = useState(0)

  const playableCameras = useMemo(
    () => cameras.filter((c) => c.cameraStatus === 1 && c.videoUrl?.url && c.videoUrl?.accessToken),
    [cameras],
  )

  if (!cameras.length) return null

  const active = cameras[activeIdx] || cameras[0]
  const playUrl = active.videoUrl?.url?.trim()
  const accessToken = active.videoUrl?.accessToken?.trim()

  // 从 ezopen:// URL 兜底解析出 deviceSerial 和 channel，防止后端字段缺失
  // 例：ezopen://open.ys7.com/GV6073093/1.live → deviceSerial=GV6073093, channel=1
  const parseFromUrl = (url?: string): { sn: string; ch: number } => {
    if (!url) return { sn: '', ch: 1 }
    const m = url.match(/ezopen:\/\/[^/]+\/([^/]+)\/(\d+)(?:\.|$)/i)
    return { sn: m?.[1] || '', ch: m?.[2] ? Number(m[2]) : 1 }
  }
  const parsed = parseFromUrl(playUrl)
  const deviceSerial = (active.deviceSerial || parsed.sn || '').trim()
  const cameraNo = active.channelNo || parsed.ch || 1
  const isPlayable = active.cameraStatus === 1 && !!accessToken && !!deviceSerial

  // 萤石 ezplayer 插件官方属性均为 kebab-case（access-token / device-serial / camera-no / type）
  // 用 React.createElement 显式传属性名，避免 JSX 编译层把 kebab-case 转成 camelCase 或反之
  // type: 1=预览(live) 2=回放(playback)，必填
  const renderEzPlayer = () =>
    React.createElement('ezplayer', {
      id: `ezplayer-${active.cameraId}`,
      type: 1,
      'access-token': accessToken || '',
      'device-serial': deviceSerial,
      'camera-no': cameraNo,
      url: playUrl || '',
      poster: active.coverUrl,
      autoplay: true,
      class: 'camera-live-player__inner',
    })

  return (
    <MellowCard title="基地直播视频溯源" className="camera-live-card">
      <View className="camera-live">
        <View className="camera-live-player">
          {isPlayable ? (
            renderEzPlayer()
          ) : (
            <View className="camera-live-offline">
              {active.coverUrl ? <ImageBox source={active.coverUrl} className="camera-live-offline__cover" /> : null}
              <View className="camera-live-offline__mask">
                <Text className="camera-live-offline__text">
                  {active.cameraStatus === 2 ? '摄像头离线' : active.cameraStatus === 3 ? '摄像头异常' : '暂无直播画面'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {cameras.length > 1 && (
          <View className="camera-live-tabs">
            {cameras.map((cam, idx) => (
              <View
                key={cam.id}
                className={`camera-live-tabs__item ${idx === activeIdx ? 'camera-live-tabs__item--active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <Text className="camera-live-tabs__label">{cam.directionName || cam.cameraName}</Text>
                {cam.cameraStatus !== 1 ? <Text className="camera-live-tabs__dot camera-live-tabs__dot--off" /> : null}
              </View>
            ))}
          </View>
        )}

        {playableCameras.length === 0 && (
          <View className="camera-live-empty-hint">
            <Text>暂无可用直播画面</Text>
          </View>
        )}
      </View>
    </MellowCard>
  )
}

export default CameraLive
