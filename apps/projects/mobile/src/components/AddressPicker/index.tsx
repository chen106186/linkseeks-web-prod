import React, { useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { PickerView, PickerViewColumn } from '@tarojs/components'
import { View, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import './index.scss'

export interface PickerItem {
  label: string | undefined
  value: string | undefined
  children: {
    label: string | undefined
    value: string | undefined
  }[]
}

export interface AddressListType {
  label: string | undefined
  value: string | undefined
  children: PickerItem[]
}

interface AddressPickerProps {
  // 外部值，暂不使用
  value?: any[]
  // 显示控制
  visible?: boolean
  // 传入的地区数组
  actions?: any[]
  // 选择层级
  column?: 1 | 2 | 3
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any[]) => void
}

const AddressPicker: React.FC<AddressPickerProps> = (props: AddressPickerProps) => {
  const { value, visible, actions, column = 2, onClose, onSelect } = props
  const [provinceList, setProvinceList] = useState<AddressListType[]>([])
  const [cityList, setCityList] = useState<AddressListType[]>([])
  const [countryList, setCountryList] = useState<AddressListType[]>([])
  const [selectValue, setSelectValue] = useState<any[]>([])
  const [arrValue, setArrValue] = useState<any[]>([])

  const intl = useIntl()

  const initActions = () => {
    const _selectValue: any = []
    if (actions) {
      setProvinceList(actions)
      _selectValue[0] = actions[0].value
      if (actions[0].children) {
        setCityList(actions[0].children as AddressListType[])
        _selectValue[1] = actions[0].children[0].value
        if (actions[0].children[0].children && actions[0].children[0].children.length > 0) {
          _selectValue[2] = actions[0].children[0].children[0].value
          setCountryList(actions[0].children[0].children as AddressListType[])
        }
      }
      setSelectValue(_selectValue)
    }
  }

  const handleSelect = () => {
    onSelect && onSelect(selectValue)
    onClose && onClose()
  }

  useEffect(() => {
    if (actions && actions.length > 0) {
      initActions()
    }
  }, [actions])

  /* 循环元素 */
  const mapItem = (list: any, code: string) => {
    const ArrList: any = []
    list.forEach((element: any) => {
      if (element.value === code) {
        ArrList.push(element)
      }
      return false
    })
    return ArrList
  }

  const handlePickerChange = (val: any) => {
    if (!visible) return
    const arr: any = val
    const _select: any = []
    const List = mapItem(provinceList, actions?.[arr[0]]?.value)
    _select[0] = List[0]?.value
    _select[1] = List[0]?.children?.[arr[1]]?.value
    if (List[0]?.children?.[arr[1]]?.children?.[arr[2]]?.value) {
      _select[2] = List[0]?.children?.[arr[1]]?.children?.[arr[2]]?.value
    }
    if (_select[0] !== selectValue[0]) {
      setCityList([])
      setCityList(List[0].children)

      _select[1] = List[0].children[0].value
      arr[1] = 0

      if (List[0].children[0].children && List[0].children[0].children.length > 0) {
        setCountryList([])
        setCountryList(List[0].children[0].children)
        _select[2] = List[0].children[0].children[0].value
        arr[2] = 0
      }
    }
    if (column === 3 && _select[1] !== selectValue[1]) {
      List.forEach((element: any) => {
        element.children.forEach((elements: any) => {
          if (elements.value === _select[1]) {
            setCountryList([])
            setCountryList(elements.children)
            _select[2] = elements.children[0].value
            arr[2] = 0
          }
        })
        return false
      })
    }
    setSelectValue(_select)
    setArrValue(arr)
  }

  return (
    <View className={cx('address-picker', visible ? 'address-picker--active' : '')}>
      <View
        className={cx('address-picker-seat', visible ? 'address-picker-seat--active' : '')}
        onClick={() => {
          onClose && onClose()
        }}
      ></View>
      <View className={cx('address-picker-container', visible ? 'address-picker-container--active' : '')}>
        <View className="address-picker-container-top">
          <Text
            className="address-picker-container-top-left"
            onClick={() => {
              onClose && onClose()
            }}
          >
            {intl.formatMessage({ id: 'addressPicker_cancel' })}
          </Text>
          <Text className="address-picker-container-top-title">
            {intl.formatMessage({ id: 'addressPicker_title' })}
          </Text>
          <Text className="address-picker-container-top-right" onClick={handleSelect}>
            {intl.formatMessage({ id: 'addressPicker_confirm' })}
          </Text>
        </View>
        <PickerView
          style={{ width: '100%', height: pxTransform(190) }}
          value={arrValue}
          onChange={(e) => handlePickerChange(e.detail.value)}
        >
          <PickerViewColumn key={provinceList?.[0]?.value || '0'}>
            {provinceList?.map((item) => {
              return (
                <View key={`provinceList_${item.value}`} className="address-picker-container-select-item">
                  {item.label}
                </View>
              )
            })}
          </PickerViewColumn>
          {cityList.length > 0 && (
            <PickerViewColumn key={cityList[0].value}>
              {cityList?.map((item) => {
                return (
                  <View key={`cityList_${item.value}`} className="address-picker-container-select-item">
                    {item.label}
                  </View>
                )
              })}
            </PickerViewColumn>
          )}
          {countryList.length > 0 && (
            <PickerViewColumn key={countryList[0].value}>
              {countryList?.map((item) => {
                return (
                  <View key={`countryList_${item.value}`} className="address-picker-container-select-item">
                    {item.label}
                  </View>
                )
              })}
            </PickerViewColumn>
          )}
        </PickerView>
      </View>
    </View>
  )
}

export default AddressPicker
