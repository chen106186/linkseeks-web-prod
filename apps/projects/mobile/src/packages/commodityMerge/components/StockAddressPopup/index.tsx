/*
 * @Description: 配送至 Popup
 */
import React, { useState, useEffect, useRef } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons, Button } from '@apps/mobile-ui'
import { Swiper, SwiperItem } from '@tarojs/components'
import { observer } from 'mobx-react-lite'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import { THEME_COLORS, themeLayout } from '@/constants/theme'
import useStores from '@/store/useStores'
import Popup from '@/components/Popup'
import { getLogisticsMobileReceiverAddressListDefault } from '@apps/apis'
import { getStockStorage } from './utils'
import ShippingAddressList, { ShippingAddressValueType, ShippingAddressType } from './components/ShippingAddressList'
import ShippingAreaIndexes, {
  ShippingAreaIndexesValueType,
  ShippingAreaIndexesRefHandle,
} from './components/ShippingAreaIndexes'
import styles from './index.module.scss'

export type StockAddressValueType = {
  id?: number
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode?: string
  districtName?: string
  streetCode?: string
  streetName?: string
}

export type ChangeFromType = 'address' | 'areaIndexes'

interface IProps {
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 配送地址改变触发事件
   */
  onChange?: (value: StockAddressValueType) => void
}

const StockAddressPopup: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, onChange } = props
  const [current, setCurrent] = useState(0)
  const [address, setAddress] = useState<StockAddressValueType | undefined>(undefined)
  const [shippingAddressList, setShippingAddressList] = useState<ShippingAddressType[]>([])
  const [shippingAddressListLoading, setShippingAddressListLoading] = useState(false)

  const shippingAreaIndexesRef = useRef<ShippingAreaIndexesRefHandle | null>(null)
  const stockChangeFrom = useRef<ChangeFromType>('address')

  const { safeBottomHeight } = useSafeArea()
  const {
    userStore: { userInfo },
    locationStore: { currentCity },
  } = useStores()
  const intl = useIntl()

  const triggerChange = (next: StockAddressValueType) => {
    onChange?.(next)
  }

  useEffect(() => {
    const _getStockStorage = async () => {
      const stockHistory = await getStockStorage()

      if (stockHistory && stockHistory.type === 'address') {
        triggerChange(stockHistory.data as any)
        return
      }

      if (stockHistory && stockHistory.type === 'areaIndexes') {
        const [province, city, district, street] = stockHistory.data
        triggerChange({
          provinceCode: province.code!,
          provinceName: province.name!,
          cityCode: city?.code || '',
          cityName: city?.name || '',
          districtCode: district?.code || '',
          districtName: district?.name || '',
          streetCode: street?.code || '',
          streetName: street?.name || '',
        })
        return
      }
    }
    _getStockStorage()
  }, [])

  /**
   * 获取收货地址
   */
  const fetchShippingAddressList = () => {
    setShippingAddressListLoading(true)
    getLogisticsMobileReceiverAddressListDefault()
      .then((res) => {
        if (res.code === 1000) {
          // 用户已登录，但是没有地址信息触发 change null
          if (!res.data || !res.data.length) {
            handleSlideTo(1)
            setAddress(currentCity)
          } else {
            let _stockData
            const _getStockStorage = async () => {
              _stockData = await getStockStorage()
            }
            _getStockStorage()
            if (!_stockData) {
              triggerChange((res.data.find((item) => item.isDefault) || res.data[0]) as StockAddressValueType)
            }
            setShippingAddressList(res.data)
          }
        }
      })
      .finally(() => {
        setShippingAddressListLoading(false)
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (userInfo) {
      fetchShippingAddressList()
    } else {
      handleSlideTo(1)
      setAddress(undefined)
    }
  }, [userInfo])

  const handleClose = () => {
    onClose?.()
  }

  const handleSlideTo = (index: number) => {
    setCurrent(index)
  }

  const handleChooseOther = () => {
    handleSlideTo(1)
  }

  const handleSwiperChange = (index: number) => {
    setCurrent(index)
  }

  const handleAddressListChange = (next: ShippingAddressValueType) => {
    stockChangeFrom.current = 'address'
    handleSlideTo(0)
    if (!('value' in props)) {
      setAddress(next!)
    }
    triggerChange(next!)
    handleClose()
  }

  const handleAreaIndexesChange = (next: ShippingAreaIndexesValueType) => {
    const [province, city, district, street] = next
    stockChangeFrom.current = 'areaIndexes'
    triggerChange({
      provinceCode: province.code!,
      provinceName: province.name!,
      cityCode: city?.code || '',
      cityName: city?.name || '',
      districtCode: district?.code || '',
      districtName: district?.name || '',
      streetCode: street?.code || '',
      streetName: street?.name || '',
    })
    handleClose()
  }

  const handlePopupAfterClose = () => {
    // 弹窗关闭，恢复原位
    if (current === 1 && shippingAddressList.length > 0) {
      handleSlideTo(0)
      setAddress(undefined)
    }
    if (stockChangeFrom.current === 'areaIndexes') {
      shippingAreaIndexesRef.current?.reset()
    }
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      overlayStyle={{
        zIndex: 100,
      }}
      zIndex={101}
      onAfterClose={handlePopupAfterClose}
      preload
    >
      <View className={styles['stockAddress-popup']} style={{ height: `calc(100vh - 280px)` }}>
        <View className={styles['stockAddress-popup-nav']}>
          {current === 1 && shippingAddressList.length > 0 ? (
            <View className={styles['stockAddress-popup-nav-left']} onClick={() => handleSlideTo(0)}>
              <Icons name="ChevronLeft" color={THEME_COLORS.title} size={24} />
            </View>
          ) : null}
          <View className={styles['stockAddress-popup-nav-title']}>
            {intl.formatMessage({ id: 'commodityMerge.components.stockAddressPopup.title', defaultMessage: '配送至' })}
          </View>
        </View>
        <View className={styles['stockAddress-popup-content']}>
          <Swiper
            className={styles['stockAddress-popup-swiper']}
            current={current}
            duration={300}
            onChange={(e) => handleSwiperChange(e.detail.current)}
            disableTouch
          >
            <SwiperItem className={styles['stockAddress-popup-swiper-item']}>
              <View className={styles['stockAddress-popup-wrapper']} catchMove>
                <ShippingAddressList
                  dataSource={shippingAddressList}
                  loading={shippingAddressListLoading}
                  checked={address?.id}
                  onChange={handleAddressListChange}
                />
                <View
                  className={styles['stockAddress-popup-action']}
                  style={{
                    paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-l']),
                  }}
                >
                  <Button type="primary" onClick={handleChooseOther} loading={shippingAddressListLoading}>
                    {intl.formatMessage({
                      id: 'commodityMerge.components.stockAddressPopup.other',
                      defaultMessage: '选择其他地址',
                    })}
                  </Button>
                </View>
              </View>
            </SwiperItem>
            <SwiperItem className={styles['stockAddress-popup-swiper-item']}>
              <View className={styles['stockAddress-popup-wrapper']} catchMove>
                <ShippingAreaIndexes onChange={handleAreaIndexesChange} ref={shippingAreaIndexesRef} />
              </View>
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    </Popup>
  )
}

export default observer(StockAddressPopup)
