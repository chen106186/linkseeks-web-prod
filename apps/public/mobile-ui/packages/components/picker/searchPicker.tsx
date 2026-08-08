import { CommonEventFunction, PickerView, PickerViewColumn, View } from '@tarojs/components'
import React, { useCallback, useRef, useState } from 'react'
import ActionSheet from '../action-sheet'
import Button from '../Button'
import Text from '../text'
import { PickerViewProps } from '@tarojs/components/types/PickerView'
import GodComponent from '../../types/base'
import { GodActionSheetProps } from '../../types/action-sheet'
import SearchBar from '../search-bar'

export interface SearchPickerProps extends GodComponent, Omit<GodActionSheetProps, 'isOpened'> {
  /**
   * 可控制datepicker的显示隐藏，如果不传，则默认点击props.children的内容触发
   */
  visible?: boolean
  title?: string
  range: any[]
  rangeKey: string
  /**
   * 传入时间的值
   */
  value?: number[]
  /**
   * 当某一列滑动停止时触发
   */
  onChange?(value: number): void
  /**
   * 点击确定触发
   */
  onConfirm?(value: number[]): void

  onSearch?(value: string | undefined): void
}

/***********************组件开始 ****************/
const SearchPicker: React.FC<SearchPickerProps> = (props) => {
  const { visible, title, value, range, rangeKey, onConfirm, onChange, onSearch, ...restSheetProps } = props
  const [searchValue, setSearchValue] = useState<string>()
  const [_value, setValue] = useState<number[]>(value || [])
  const [_visible, setVisible] = useState(visible)

  const handleChangeSheet = useCallback(() => {
    setVisible(visible !== undefined ? visible : !_visible)
  }, [visible, _visible])

  const handleChange: CommonEventFunction<PickerViewProps.onChangeEventDetail> = (e) => {
    setValue(e.detail.value)
  }

  const handleConfirm = () => {
    onConfirm?.(_value)
    handleChangeSheet()
  }

  const handleSearch = () => {
    onSearch?.(searchValue)
  }

  return (
    <View>
      <View className="dateTimePicker-emit-container" onClick={handleChangeSheet}>
        {props.children}
      </View>

      <ActionSheet isOpened={_visible} onClose={handleChangeSheet} {...restSheetProps}>
        <View className="dtp-picker-btns">
          <Button size="small" onClick={handleChangeSheet}>
            取消
          </Button>
          <Text className="dtp-picker-title">{title || ''}</Text>
          <Button size="small" type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </View>
        <SearchBar value={searchValue} onChange={(val) => setSearchValue(val)} onActionClick={() => handleSearch()} />
        <PickerView className="dtp-picker-container" onChange={handleChange} value={_value}>
          <PickerViewColumn>
            {range &&
              range.map((item) => (
                <View key={item[rangeKey]} className="dtp-picker-item">
                  {item[rangeKey]}
                </View>
              ))}
          </PickerViewColumn>
        </PickerView>
      </ActionSheet>
    </View>
  )
}

export default SearchPicker
