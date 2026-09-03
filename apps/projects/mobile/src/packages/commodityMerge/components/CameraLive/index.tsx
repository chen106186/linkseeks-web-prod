import React, { useState, useMemo } from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import MellowCard from '@/components/MellowCard'
import type { CommodityCameraMobileResp } from '@apps/apis'
import './index.scss'

interface CameraLiveProps {
  cameras: CommodityCameraMobileResp[]
}

const EzPlayer = 'ezplayer' as unknown as React.FC<Record<string, any>>

const CameraLive: React.FC<CameraLiveProps> = ({ cameras }) => {
  const [activeIdx, setActiveIdx] = useState(0)

  const onlineCameras = useMemo(() => cameras.filter((c) => c.cameraStatus === 1 && c.videoUrl?.url), [cameras])

  if (!cameras.length) return null

  const active = cameras[activeIdx] || cameras[0]
  const isOnline = active.cameraStatus === 1 && !!active.videoUrl?.url

  return (
    <MellowCard bodyStyle={{ padding: 0 }} className="camera-live-card">
      <View className="camera-live">
        <View className="camera-live-player">
          {isOnline ? (
            <EzPlayer
              id={`ezplayer-${active.cameraId}`}
              url={active.videoUrl!.url}
              access-token={active.videoUrl!.accessToken}
              poster={active.coverUrl}
              autoplay
              className="camera-live-player__inner"
            />
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

        {onlineCameras.length === 0 && (
          <View className="camera-live-empty-hint">
            <Text>当前所有摄像头均离线</Text>
          </View>
        )}
      </View>
    </MellowCard>
  )
}

export default CameraLive
