/*
 * @Description: 选择器
 */
import React from 'react'
import { View, Icons } from '@apps/mobile-ui'
import { Picker } from '@tarojs/components'
import { PickerDateProps } from '@tarojs/components/types/Picker'
import classNames from 'classnames'
import './index.scss'

interface CustomDatePickerProps extends Partial<PickerDateProps> {
  /**
   * 选择框默认文本
   */
  placeholder?: string
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * 自定义className
   */
  customClassName?: string
  /**
   * content文本对其方式，默认 left
   */
  contentAlign?: 'center' | 'left' | 'right'
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = (props: CustomDatePickerProps) => {
  const { placeholder, customStyle, customClassName, contentAlign = 'left', ...restPickerProps } = props

  return (
    <View className={classNames('custom-date-picker', customClassName)} style={customStyle}>
      <Picker {...restPickerProps} mode="date">
        <View className="custom-date-picker-selector">
          <View
            className="custom-date-picker-content"
            style={{
              textAlign: contentAlign,
            }}
          >
            {restPickerProps.value ? (
              <View className="custom-date-picker-content-text">{restPickerProps.value}</View>
            ) : (
              placeholder
            )}
          </View>
          <View className="custom-date-picker-arrow">
            <Icons name="ChevronRight" size={14} color="#C0C4CC" />
          </View>
        </View>
      </Picker>
    </View>
  )
}

export default CustomDatePicker
