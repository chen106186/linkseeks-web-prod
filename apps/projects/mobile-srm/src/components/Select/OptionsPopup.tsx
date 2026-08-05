/*
 * @Description: 选择器
 */
import React, { useState, useEffect } from 'react'
import { CommonEventFunction } from '@tarojs/components'
import { Text, View, ScrollView, Checkbox, Button } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import { themeLayout } from '@/constants/theme'
import Popup from '@/components/Popup'
import Search from '@/components/Search'
import OptionLabel from './OptionLabel'
import './index.scss'

export type SelectValueType = React.Key | React.Key[]

type IntervalValueType = React.Key[]

export type Option = { label; value; description? }

export interface SelectOptionsPopupProps {
  /**
   * 弹窗标题
   */
  title: string
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 值
   */
  value?: SelectValueType
  /**
   * 选择值改变触发事件
   */
  onChange?: (value: SelectValueType) => void
  /**
   * 选项
   */
  options: Option[]
  /**
   * 搜索框默认文本
   */
  searchPlaceholder?: string
  /**
   * 是否是多选的，默认 false
   */
  multiple?: boolean
  /**
   * 是否可搜索的
   */
  showSearch?: boolean
  /**
   * 搜索框变化时触发事件
   */
  onSearch?: (value: string) => void
  /**
   * 选项列表滚动到底部触发事件
   */
  onScrollToLower?: CommonEventFunction
  /**
   * 选项区域高度，默认 448
   */
  height?: number | string
  /**
   * 关闭事件
   */
  onClose: () => void
}

const SelectOptionsPopup: React.FC<SelectOptionsPopupProps> = (props: SelectOptionsPopupProps) => {
  const {
    title,
    visible,
    value,
    onChange,
    options,
    searchPlaceholder,
    multiple = false,
    showSearch,
    onSearch,
    onScrollToLower,
    height = 448,
    onClose,
  } = props
  const [internalValue, setInternalValue] = useState<IntervalValueType>([])
  const [keyword, setKeyword] = useState('')

  const { safeBottomHeight } = useSafeArea()

  useEffect(() => {
    if ('value' in props) {
      const arrValue = multiple ? value || [] : Array.isArray(value) ? value : value ? [value] : []
      setInternalValue(arrValue as IntervalValueType)
    }
  }, [value])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const triggerChange = (next: IntervalValueType) => {
    if (onChange) {
      const last = next[next.length - 1]
      const nextValue = multiple ? next : last
      onChange(nextValue)
    }
  }

  const handleCheckboxChange = (next: IntervalValueType) => {
    const last = next[next.length - 1]
    const nextValue = multiple ? next : [last]
    // 多选状态下，需要内部缓存value
    if (!('value' in props) || multiple) {
      setInternalValue(nextValue)
    }
    // 多选状态下，需要点击确认按钮才会最终触发change
    if (!multiple) {
      triggerChange(nextValue)
      handleClose()
    }
  }

  const handleSelectItem = (record: Option) => {
    const next = record.value
    const nextValue = [...internalValue]
    const index = nextValue.findIndex((item) => item === next)
    if (index !== -1) {
      nextValue.splice(index, 1)
    } else {
      nextValue.push(next)
    }
    handleCheckboxChange(nextValue)
  }

  const handleSearch = (next: string) => {
    if (onSearch) {
      onSearch(next)
    }
    setKeyword(next)
  }

  const handleScrollToLower: CommonEventFunction = (...arg) => {
    if (onScrollToLower) {
      onScrollToLower(...arg)
    }
  }

  const handleConfirm = () => {
    triggerChange(internalValue)
    handleClose()
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      title={title}
      customStyle={{
        backgroundColor: '#FFFFFF',
      }}
      customTitleStyle={{
        borderBottom: 'none',
      }}
    >
      {showSearch ? (
        <Search placeholder={searchPlaceholder} onSearch={(next) => handleSearch(next)} shape="shape" clearable />
      ) : null}
      <Checkbox.Group value={internalValue} onChange={handleCheckboxChange}>
        <ScrollView
          className="select-scroll"
          style={{
            height: pxTransform(+height),
          }}
          onScrollToLower={handleScrollToLower}
        >
          <View className="select-options">
            {options?.map((item) => (
              <View key={item.value} className="select-options-item" onClick={() => handleSelectItem(item)}>
                <View className="select-options-item-center">
                  {/* <View
                    className='select-options-item-title'
                  >
                    {item.label}
                  </View> */}
                  <OptionLabel customClassName="select-options-item-title" keyword={keyword} content={item.label} />
                  {item.description ? <Text className="select-options-item-desc">{item.description}</Text> : null}
                </View>
                <View className="select-options-item-right">
                  <Checkbox value={item.value} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {multiple ? (
          <View
            className="select-actions"
            style={{
              paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
            }}
          >
            <Button type="primary" onClick={handleConfirm}>
              确定
            </Button>
          </View>
        ) : null}
      </Checkbox.Group>
    </Popup>
  )
}

export default SelectOptionsPopup
