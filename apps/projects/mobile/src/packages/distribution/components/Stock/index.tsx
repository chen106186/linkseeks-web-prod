/**
 * @Deprecated 配送至组件
 */
import React, { useState, useEffect } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import useDeliverable, { DeliverAreaItem } from '@/hooks/useDeliverable'
import { useIntl } from '@linkseeks/i18n'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
import { getLogisticsMobileShipperAddressGet } from '@apps/apis'
import Bookshelf from '../Bookshelf'
import styles from './index.module.scss'

export type StockAddressType = {
  id?: number
  provinceCode: string
  provinceName: string
  cityCode: string
  cityName: string
  districtCode: string
  districtName: string
  streetCode: string
  streetName: string
  address: string
}

export type StockStatus = 0 | 1

interface StockProps {
  /**
   * 点击跳转触发事件
   */
  onJump?: () => void
  /**
   * 不限制的
   */
  unlimited: boolean
  /**
   * 配送区域
   */
  areas: DeliverAreaItem[]
  /**
   * 地址
   */
  address: StockAddressType
  /**
   * 是否可配送状态改变触发事件
   * 0 不可配送，1 可配送
   */
  onStatusChange?: (status: StockStatus) => void
  /**
   * 发货地址id
   */
  shippingAddressId: number
  /**
   * 配送方式
   */
  deliveryType: number
  limitWay?: number
}

const Stock: React.FC<StockProps> = (props: StockProps) => {
  const { onJump, unlimited, limitWay, areas, address, onStatusChange, shippingAddressId, deliveryType } = props

  const [status, setStatus] = useState<StockStatus>(unlimited ? 1 : 0)
  const [shippingPlace, setShippingPlace] = useState('')

  const { isDeliverable } = useDeliverable()
  const intl = useIntl()

  useEffect(() => {
    if (!unlimited) {
      let next: StockStatus = isDeliverable(unlimited, areas, limitWay, address!) ? 1 : 0
      if (deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP) {
        next = 1
      }
      setStatus(next)
      onStatusChange?.(next)
    } else {
      setStatus(1)
      onStatusChange?.(1)
    }
  }, [unlimited, areas, address, deliveryType])

  const getShippingPlaceById = (id: number) => {
    if (!id) {
      return
    }
    getLogisticsMobileShipperAddressGet({
      id: `${shippingAddressId}`,
    }).then((res) => {
      if (res.code === 1000) {
        setShippingPlace(res.data.fullAddress)
      }
    })
  }

  useEffect(() => {
    getShippingPlaceById(shippingAddressId)
  }, [shippingAddressId])

  const handlePress = () => {
    onJump?.()
  }

  return (
    <>
      {deliveryType && deliveryType !== DELIVERY_TYPE_ENUM.SELF_PICKUP ? (
        <Bookshelf.Item
          label={intl.formatMessage({ id: 'commodityMerge.components.stock.address', defaultMessage: '配送至' })}
          labelWidth={64}
          content={
            <View className={styles['stock']}>
              {address ? (
                <View className={styles['stock-address']}>
                  <View className={styles['stock-address-left']}>
                    <Icons name="Pin" size={12} color="#303133" />
                  </View>
                  <View className={styles['stock-address-right']}>
                    <Text className={styles['stock-address-text']}>
                      {address.provinceName
                        ? `${address.provinceName || ''}${address.cityName || ''}${address.districtName || ''}${
                            address.streetName || ''
                          }`
                        : address?.address}
                    </Text>
                  </View>
                </View>
              ) : null}
              {status === 0 ? (
                <View className={styles['stock-tip']}>
                  {intl.formatMessage({
                    id: 'commodityMerge.components.stock.illegal',
                    defaultMessage: '该地区暂不支持配送',
                  })}
                </View>
              ) : null}
            </View>
          }
          onPress={handlePress}
          customStyle={{
            alignItems: 'flex-start',
          }}
          isLink
        />
      ) : null}
      {shippingPlace ? (
        <Bookshelf.Item
          label={intl.formatMessage({ id: 'commodityMerge.components.stock.shippingPlace', defaultMessage: '发货地' })}
          labelWidth={64}
          content={shippingPlace}
        />
      ) : null}
    </>
  )
}

export default Stock
