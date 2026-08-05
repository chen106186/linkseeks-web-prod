/*
 * @Description: Cascader 级联选择器
 */
import React, { useMemo, useState } from 'react'
import { View, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import CascaderPopup, { CascaderProps } from './components/CascaderPopup'
import './index.scss'

export interface CustomCascaderProps extends Omit<CascaderProps, 'visible' | 'onClose'> {
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
   * 分隔符，默认 '-'
   */
  split?: string
}

const CustomCascader: React.FC<CustomCascaderProps> = (props) => {
  const {
    disabled,
    placeholder,
    customStyle,
    customClassName,
    contentAlign = 'left',
    split = '-',
    ...restPopupProps
  } = props
  const [visible, setVisible] = useState(false)
  const [names, setNames] = useState<string[]>([])

  const handleVisiblePopup = (flag?: boolean) => {
    if (disabled) {
      return
    }
    setVisible(!!flag)
  }

  const handleMatchNames = (names: string[]) => {
    const originMatchNamesFunc: any = restPopupProps.onMatchNames
    setNames(names)
    originMatchNamesFunc?.(names)
  }

  const handleCascaderChange = (...args: any[]) => {
    const originChangeFunc: any = restPopupProps.onChange
    handleVisiblePopup(false)
    originChangeFunc?.(...args)
  }

  const contentText = useMemo(() => names.join(split), [names])

  return (
    <View className={classNames('cascader', customClassName)} style={customStyle}>
      <View className="cascader-selector" onClick={() => handleVisiblePopup(true)}>
        <View
          className="cascader-content"
          style={{
            textAlign: contentAlign,
          }}
        >
          {contentText ? <View className="cascader-content-text">{contentText}</View> : placeholder}
        </View>
        <View className="cascader-arrow">
          <Icons name="ChevronRight" size={14} color="#C0C4CC" />
        </View>
      </View>
      <CascaderPopup
        visible={visible}
        onClose={() => handleVisiblePopup(false)}
        {...restPopupProps}
        onChange={handleCascaderChange}
        onMatchNames={handleMatchNames}
      />
    </View>
  )
}

export default CustomCascader
