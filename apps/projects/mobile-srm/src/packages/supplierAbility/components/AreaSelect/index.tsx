/*
 * @Description: 区域选择器
 */
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import AreaPopup, { AreaPopupProps, AreaPopupValueType, AreaPopupRef } from './components/AreaPopup'
import './index.scss'

export type AreaSelectValueType = {
  provinceCode?: string
  cityCode?: string
  districtCode?: string
}

interface AreaSelectProps extends Omit<AreaPopupProps, 'visible' | 'onClose' | 'value' | 'onChange' | 'onMatchNames'> {
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
  /**
   * value
   */
  value?: AreaSelectValueType
  /**
   * onChange
   */
  onChange?: (value: AreaSelectValueType) => void
}

const AreaSelect: React.FC<AreaSelectProps> = (props: AreaSelectProps) => {
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
  const [internalValue, setInternalValue] = useState<AreaPopupValueType>([])
  const [visible, setVisible] = useState(false)
  const [names, setNames] = useState<string[]>([])

  const AreaPopupRef = useRef<AreaPopupRef | null>(null)

  useEffect(() => {
    if ('value' in props) {
      const { provinceCode, cityCode, districtCode } = value || {}
      const initialValue: AreaPopupValueType = [
        provinceCode
          ? {
              code: provinceCode,
            }
          : null,
        provinceCode && cityCode
          ? {
              code: cityCode,
            }
          : null,
        provinceCode && cityCode && districtCode
          ? {
              code: districtCode,
            }
          : null,
      ].filter(Boolean) as any
      // 必须存在省级数据，否则不执行跳过
      if (initialValue.length > 0) {
        setInternalValue(initialValue)
      }
    }
  }, [value])

  const handleVisiblePopup = (flag?: boolean) => {
    if (disabled) {
      return
    }
    setVisible(!!flag)
  }

  const triggerChange = (next: AreaPopupValueType) => {
    const [province, cityCode, district] = next
    if (onChange) {
      const nextObj: Record<string, string> = {}
      province && (nextObj.provinceCode = province?.code!)
      cityCode && (nextObj.cityCode = cityCode?.code!)
      district && (nextObj.districtCode = district?.code!)
      onChange(nextObj)
    }
  }

  const handleAreaSelectItem = (next: AreaPopupValueType) => {
    if (!('value' in props)) {
      setInternalValue(next)
    }
    triggerChange(next)
    handleVisiblePopup(false)
  }

  const handleMatchNames = (names: string[]) => {
    setNames(names)
  }

  const contentText = useMemo(() => names.join(' '), [names])

  return (
    <View className={classNames('area-select', customClassName)} style={customStyle}>
      <View
        className="area-select-selector"
        onClick={() => handleVisiblePopup(true)}
        style={{
          paddingRight: !disabled ? 20 : 0,
        }}
      >
        <View
          className="area-select-content"
          style={{
            textAlign: contentAlign,
          }}
        >
          {contentText ? <View className="area-select-content-text">{contentText}</View> : !disabled ? placeholder : ''}
        </View>
        {!disabled ? (
          <View className="area-select-arrow">
            <Icons name="ChevronRight" size={14} color="#C0C4CC" />
          </View>
        ) : null}
      </View>
      <AreaPopup
        visible={visible}
        onClose={() => handleVisiblePopup(false)}
        value={internalValue}
        onChange={handleAreaSelectItem}
        onMatchNames={handleMatchNames}
        ref={AreaPopupRef}
        {...restPopupProps}
      />
    </View>
  )
}

export default AreaSelect
