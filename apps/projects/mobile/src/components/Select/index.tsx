import React, { useEffect, useState } from 'react'
import { PickerView, PickerViewColumn } from '@tarojs/components'
import { View, Text } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import './index.scss'

interface AddressPickerProps {
  SelectList: any
  // 显示控制
  selectVisible?: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any) => void
}
const Select = (props: AddressPickerProps) => {
  const { selectVisible, onClose, onSelect, SelectList } = props
  const [selectKey, setSelectKey] = useState<any>({})
  const [selectIndex, setSelectIndex] = useState(0)
  const intl = useIntl()
  /* 监听滚动的值 */
  const handlePickerChange = async (val) => {
    setSelectIndex(val[0])
    setSelectKey(SelectList[val])
  }
  useEffect(() => {
    setSelectKey(SelectList[selectIndex])
  }, [SelectList])

  const handleSelect = () => {
    console.log(selectKey)
    onSelect && onSelect(selectKey)
    onClose && onClose()
  }
  return (
    <View className={cx('select', selectVisible ? 'select--active' : '')}>
      <View
        className={cx('select-seat', selectVisible ? 'select-seat--active' : '')}
        onClick={() => {
          onClose && onClose()
        }}
      ></View>
      <View className={cx('select-container', selectVisible ? 'select-container--active' : '')}>
        <View className="select-container-top">
          <Text
            className="select-container-top-left"
            onClick={() => {
              onClose && onClose()
            }}
          >
            {intl.formatMessage({ id: 'addressPicker_cancel' })}
          </Text>
          <Text className="select-container-top-title"></Text>
          <Text className="select-container-top-right" onClick={handleSelect}>
            {intl.formatMessage({ id: 'addressPicker_confirm' })}
          </Text>
        </View>
        <PickerView
          style={{ width: '100%', height: '190px' }}
          value={[selectIndex]}
          onChange={(e) => handlePickerChange(e.detail.value)}
        >
          {SelectList.length > 0 && (
            <PickerViewColumn key={SelectList[0].value}>
              {SelectList?.map((item) => {
                return (
                  <View key={`countryList_${item.value}`} className="select-container-select-item">
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
export default Select
