/**
 * @Deprecated 配送至地址组件
 */
import React, { useState, useEffect } from 'react'
import { View, Radio } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import Loading from '@/components/Loading'
import { getStockStorage, setStockStorage } from '../../utils'
import { GetLogisticsMobileReceiverAddressListDefaultResponse } from '@apps/apis'
import styles from './index.module.scss'

export type ShippingAddressType = GetLogisticsMobileReceiverAddressListDefaultResponse[0] & {}

export type ShippingAddressValueType = ShippingAddressType | null

interface ShippingAddressListProps {
  /**
   * 地址数据
   */
  dataSource: ShippingAddressType[]
  /**
   * 数据loading
   */
  loading: boolean
  /**
   * 当前选择的地址id
   */
  checked?: number
  /**
   * 选择地址触发事件
   */
  onChange?: (value: ShippingAddressValueType) => void
}

const ShippingAddressList: React.FC<ShippingAddressListProps> = (props: ShippingAddressListProps) => {
  const { dataSource, loading, checked, onChange } = props

  const [innerChecked, setInnerChecked] = useState<number | undefined>(undefined)

  const triggerChange = (value: ShippingAddressValueType) => {
    onChange?.(value)
  }

  useEffect(() => {
    const _getStockStorage = async () => {
      const stockHistory = await getStockStorage()
      if (stockHistory && stockHistory.type === 'address') {
        if (!('checked' in props)) {
          setInnerChecked(stockHistory.data.id)
        }
        triggerChange(stockHistory.data as any)
      }
    }
    _getStockStorage()
  }, [])

  const handleSelectAddress = (value: ShippingAddressValueType) => {
    if (!('checked' in props)) {
      setInnerChecked(value?.id)
    }
    setStockStorage('address', {
      data: value,
    })
    triggerChange(value)
  }

  const handleRadioChange = (value: number) => {
    const current = dataSource.find((item) => item.id === value)
    if (current) {
      handleSelectAddress(current)
    }
  }

  useEffect(() => {
    const stockHistory = getStockStorage()
    const defaultAddress = dataSource.find((item) => item.isDefault) || dataSource[0]
    if (!stockHistory && defaultAddress) {
      if (!('checked' in props)) {
        setInnerChecked(defaultAddress?.id)
      }
      triggerChange(defaultAddress)
    }
  }, [dataSource])

  useEffect(() => {
    if ('checked' in props) {
      setInnerChecked(checked)
    }
  }, [checked])

  return (
    <Radio.Group
      value={innerChecked}
      onChange={handleRadioChange}
      customStyle={{
        flex: 1,
        position: 'relative',
      }}
    >
      <ScrollView className={styles['shipping-addressList']} scrollY>
        {dataSource.map((item) => (
          <View key={item.id} className={styles['shipping-addressList-item']} onClick={() => handleSelectAddress(item)}>
            <View className={styles['shipping-addressList-item-left']}>
              <Radio value={item.id} />
            </View>
            <View className={styles['shipping-addressList-item-right']}>
              <View className={styles['shipping-addressList-item-name']}>{item.address}</View>
              <View className={styles['shipping-addressList-item-desc']}>{`${item.provinceName || ''}${
                item.cityName || ''
              }${item.districtName || ''}${item.streetName || ''}`}</View>
            </View>
          </View>
        ))}
        <Loading loading={!!loading} />
      </ScrollView>
    </Radio.Group>
  )
}

export default ShippingAddressList
