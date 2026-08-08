/*
 * @Description: 选择器
 */
import React, { useMemo, useState, useEffect } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import SelectOptionsPopup, { SelectOptionsPopupProps, SelectValueType, Option } from './OptionsPopup'
import './index.scss'

export type SelectOptions = Option[]

interface SelectProps extends Omit<SelectOptionsPopupProps, 'visible' | 'onClose'> {
  /**
   * 是否禁用
   */
  disabled?: boolean
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

const Select: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    disabled,
    placeholder,
    customStyle,
    customClassName,
    contentAlign = 'left',
    value,
    onChange,
    ...restPopupProps
  } = props
  const [internalValue, setInternalValue] = useState<SelectValueType>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if ('value' in props) {
      setInternalValue(value!)
    }
  }, [value])

  const currentOption = useMemo(() => {
    const multiple = restPopupProps.multiple
    const arrValue: any[] = multiple && Array.isArray(internalValue) ? internalValue : [internalValue]
    return internalValue !== undefined ? restPopupProps.options?.filter((item) => arrValue.includes(item.value)) : []
  }, [restPopupProps.options, internalValue])

  const handleVisiblePopup = (flag?: boolean) => {
    setVisible(!!flag)
  }

  const triggerChange = (next: SelectValueType) => {
    if (onChange) {
      onChange(next)
    }
  }

  const handleSelectItem = (next: SelectValueType) => {
    if (!('value' in props)) {
      setInternalValue(next)
    }
    triggerChange(next)
  }

  const contentText = useMemo(() => currentOption.map((item) => item.label).join(';'), [currentOption])

  return (
    <View className={classNames('select', customClassName)} style={customStyle}>
      <View
        className="select-selector"
        onClick={() => handleVisiblePopup(true)}
        style={{
          paddingRight: !disabled ? 20 : 0,
        }}
      >
        <View
          className="select-content"
          style={{
            textAlign: contentAlign,
          }}
        >
          {contentText ? <View className="select-content-text">{contentText}</View> : !disabled ? placeholder : ''}
        </View>
        {!disabled ? (
          <View className="select-arrow">
            <Icons name="ChevronRight" size={14} color="#C0C4CC" />
          </View>
        ) : null}
      </View>
      <SelectOptionsPopup
        visible={visible}
        onClose={() => handleVisiblePopup(false)}
        value={internalValue}
        onChange={handleSelectItem}
        {...restPopupProps}
      />
    </View>
  )
}

export default Select
