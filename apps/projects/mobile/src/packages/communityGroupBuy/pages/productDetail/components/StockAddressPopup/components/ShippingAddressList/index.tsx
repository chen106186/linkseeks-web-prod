/**
 * @Deprecated 配送至地址组件
 */
import React, { useState, useEffect } from 'react'
import { View, Radio } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import Loading from '@/components/Loading'
import {
  getLogisticsMobileReceiverAddressListDefault,
  GetLogisticsMobileReceiverAddressListDefaultResponse,
} from '@apps/apis'
import './index.scss'

export type ShippingAddressType = GetLogisticsMobileReceiverAddressListDefaultResponse[0] & {}

interface ShippingAddressListProps {
  /**
   * 当前选择的地址id
   */
  checked?: number
  /**
   * 选择地址触发事件
   */
  onChange?: (value: ShippingAddressType) => void
}

const ShippingAddressList: React.FC<ShippingAddressListProps> = (props: ShippingAddressListProps) => {
  const { checked, onChange } = props

  const [shippingAddressList, setShippingAddressList] = useState<ShippingAddressType[]>([])
  const [loading, setLoading] = useState(false)
  const [innerChecked, setInnerChecked] = useState<number | undefined>(undefined)

  const triggerChange = (value: ShippingAddressType) => {
    onChange?.(value)
  }

  const handleSelectAddress = (value: ShippingAddressType) => {
    if (!('checked' in props)) {
      setInnerChecked(value.id)
    }
    triggerChange(value)
  }

  const handleRadioChange = (value: number) => {
    const current = shippingAddressList.find((item) => item.id === value)
    if (current) {
      handleSelectAddress(current)
    }
  }

  /**
   * 获取收货地址
   */
  const fetchShippingAddressList = () => {
    setLoading(true)
    getLogisticsMobileReceiverAddressListDefault()
      .then((res) => {
        if (res.code === 1000) {
          const defaultAddress = res.data.find((item) => item.isDefault)
          if (defaultAddress) {
            handleSelectAddress(defaultAddress)
          }
          setShippingAddressList(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchShippingAddressList()
  }, [])

  useEffect(() => {
    if ('checked' in props) {
      setInnerChecked(checked)
    }
  }, [checked])

  return (
    <Radio.Group value={innerChecked} onChange={handleRadioChange}>
      <ScrollView className="shipping-addressList" scrollY>
        {shippingAddressList.map((item) => (
          <View key={item.id} className="shipping-addressList-item" onClick={() => handleSelectAddress(item)}>
            <View className="shipping-addressList-item-left">
              <Radio value={item.id} />
            </View>
            <View className="shipping-addressList-item-right">
              <View className="shipping-addressList-item-name">{item.address}</View>
              <View className="shipping-addressList-item-desc">{`${item.provinceName}${item.cityName}${item.districtName}${item.streetName}`}</View>
            </View>
          </View>
        ))}
        <Loading loading={!!loading} />
      </ScrollView>
    </Radio.Group>
  )
}

export default ShippingAddressList
