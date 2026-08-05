/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 14:17:19
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-05 16:32:53
 * @Description: 商品主图banner
 */
import React, { useState } from 'react'
import { View } from '@apps/mobile-ui'
import { previewImage } from '@apps/mobile-services/utils/taro'
import { CommonEventFunction, Swiper, SwiperItem } from '@tarojs/components'
import { SwiperProps } from '@tarojs/components/types/Swiper'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import './index.scss'

interface CommodityBannerProps {
  /**
   * 数据
   */
  banner: string[]
}

const CommodityBanner: React.FC<CommodityBannerProps> = (props: CommodityBannerProps) => {
  const { banner } = props
  const [current, setCurrent] = useState(0)

  const handleSwiperChange: CommonEventFunction<SwiperProps.onChangeEventDetail> = (e) => {
    setCurrent(e.detail.current)
  }

  const handlePreviewBanner = (cur: string) => {
    previewImage({
      current: cur,
      urls: banner,
    })
  }

  return (
    <MellowCard className="commodity-banner">
      <View className="commodity-banner-content">
        {banner.length > 0 ? (
          <Swiper className="commodity-banner-swiper" onChange={handleSwiperChange}>
            {banner.map((item, index) => (
              <SwiperItem key={index}>
                <View className="commodity-banner-swiper-item" onClick={() => handlePreviewBanner(item)}>
                  <ImageBox width="100%" height="100%" source={item} resizeMode="aspectFit" />
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        ) : null}
        {banner.length > 0 && <View className="commodity-banner-indicator">{`${current + 1} / ${banner.length}`}</View>}
      </View>
    </MellowCard>
  )
}

export default CommodityBanner
