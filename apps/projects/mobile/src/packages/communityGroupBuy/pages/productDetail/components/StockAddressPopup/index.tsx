/*
 * @Description: 配送至 Popup
 */
import React, { useState, useRef } from 'react'
import { themeLayout } from '@/constants/theme'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, Button } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import { useSafeArea } from '@apps/mobile-services'
import Popup from '@/components/Popup'
import ShippingAddressList from './components/ShippingAddressList'
import ShippingAreaIndexes from './components/ShippingAreaIndexes'
import './index.scss'

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose: () => void
}

const StockAddressPopup: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose } = props
  const [current, setCurrent] = useState(0)

  const swiperRef = useRef<any>(null)

  const { safeBottomHeight } = useSafeArea()

  const handleClose = () => {
    onClose?.()
  }

  const handleSlideTo = (index: number) => {
    swiperRef.current?.scrollTo(index, true)
  }

  const handleChooseOther = () => {
    handleSlideTo(1)
  }

  const handleSwiperChange = (index: number) => {
    setCurrent(index)
  }

  return (
    <Popup visible={visible} onClose={handleClose}>
      <View className="stockAddress-popup" style={{ height: `calc(100vh - 280px)` }}>
        <View className="stockAddress-popup-nav">
          {current === 1 ? (
            <View className="stockAddress-popup-nav-left" onClick={() => handleSlideTo(0)}>
              <Icons name="ChevronLeft" size={24} />
            </View>
          ) : null}
          <Text className="stockAddress-popup-nav-title">配送至</Text>
        </View>
        <View className="stockAddress-popup-content">
          <Swiper onChange={(e) => handleSwiperChange(e.detail.current)} ref={swiperRef} disableTouch>
            <SwiperItem>
              <View className="stockAddress-popup-address">
                <ShippingAddressList />
                <View
                  className="stockAddress-popup-action"
                  style={{
                    paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-l']),
                  }}
                >
                  <Button type="primary" onClick={handleChooseOther}>
                    选择其他地址
                  </Button>
                </View>
              </View>
            </SwiperItem>
            <SwiperItem>
              <ShippingAreaIndexes />
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    </Popup>
  )
}

export default StockAddressPopup
