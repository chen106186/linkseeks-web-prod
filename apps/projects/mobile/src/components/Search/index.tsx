/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-09 14:55:04
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-02 17:23:55
 * @Description: 搜索框
 */
import React, { useRef, useImperativeHandle, useState, useEffect } from 'react'
import { View, Text, Icons, Input } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getIntl } from '@linkseeks/i18n'
import classNames from 'classnames'
import './index.scss'

export interface SearchProps {
  defaultValue?: string
  /**
   * 搜索框左侧文本
   */
  label?: string
  /**
   * 形状，可选值为 shape | round
   */
  shape?: 'shape' | 'round'
  /**
   * 当前输入的值
   */
  value?: string
  /**
   * 是否在搜索框右侧显示取消按钮
   */
  showAction?: boolean
  /**
   * 搜索框内部背景色
   */
  innerBackground?: string
  /**
   * 搜索框背景色
   */
  background?: string
  /**
   * 取消按钮文字
   */
  actionText?: string
  /**
   * 是否自动获取焦点
   */
  focus?: boolean
  /**
   * 是否可编辑的
   */
  editable?: boolean
  /**
   * 是否启用清除控件
   */
  clearable?: boolean
  /**
   * 输入框为空时占位符
   */
  placeholder?: string
  /**
   * 输入框左侧图标名称
   */
  leftIcon?: string
  /**
   * 自定义左侧图标
   */
  customLeftIcon?: React.ReactNode
  /**
   * 自定义搜索框右侧按钮
   */
  customAction?: React.ReactNode
  /**
   * 输入内容变化时触发
   */
  onChange?: (value: string) => void
  /**
   * 取消搜索搜索时触发，同时会触发 onChange 传递 字符串
   */
  onCancel?: (value: string) => void
  /**
   * 确定搜索时触发
   */
  onSearch?: (value: string) => void
  /**
   * 点击清空控件时触发，同时会触发 onChange 传递 字符串
   */
  onClear?: (value: string) => void
  /**
   * 点击整个 Search 框触发
   */
  onClick?: () => void
  /**
   * Search Input 失焦触发事件
   */
  onBlur?: () => void
  /**
   * 是否在清空搜索框之后调用 onSearch 事件，默然为 true
   */
  searchOnClearAction?: boolean
  /**
   * 自定义外部样式
   */
  customClassName?: string
  /**
   * 自定义外部容器 style
   */
  customStyle?: string | React.CSSProperties

	customPlaceholderClass?: string

	customSearchFieldClass?: string
}

const Search: React.FC<SearchProps> = React.forwardRef((props: SearchProps, ref: any) => {
  const {
    defaultValue = '',
    label,
    shape,
    value = '',
    showAction,
    innerBackground,
    background,
    actionText,
    focus,
    editable,
    clearable,
    placeholder,
    leftIcon,
    customLeftIcon,
    customAction,
    searchOnClearAction,
    onChange,
    onSearch,
    onCancel,
    onClear,
    onClick,
    onBlur,
    customClassName,
    customStyle,
		customPlaceholderClass,
		customSearchFieldClass,
  } = props
  const [innerValue, setInnerValue] = useState('')
  const [innerFocus, setInnerFocus] = useState(false)
  const inputRef = useRef<null | Input>(null)

  useEffect(() => {
    if (defaultValue) {
      setInnerValue(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value)
    }
  }, [value])

  const triggerChange = (text: string) => {
    if (!('value' in props)) {
      setInnerValue(text)
    }
    if (onChange) {
      onChange(text)
    }
  }

  const handleChange = (text: string) => {
    triggerChange(text)
  }

  const handleClear = () => {
    triggerChange('')
    if (onClear) {
      onClear('')
    }
    if (searchOnClearAction && onSearch) {
      onSearch('')
    }
  }

  const handleCancel = () => {
    triggerChange('')
    if (onCancel) {
      onCancel('')
    }
  }

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(innerValue)
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleBlur = () => {
    if (onBlur) {
      onBlur()
    }
  }

  useImperativeHandle(ref, () => ({
    focus: () => {
      setInnerFocus(true)
    },
    isFocused: () => innerFocus,
    blur: () => {
      setInnerFocus(false)
    },
  }))

  return (
    <View
      className={classNames('search', customClassName, { 'search-show-action': showAction })}
      style={`background-color: ${background};${customStyle}`}
      onClick={handleClick}
    >
      <View
        className={classNames('search-content', { 'search-content__round': shape === 'round' })}
        style={`background-color: ${innerBackground}`}
      >
        {!!label && <Text className="search-label">{label}</Text>}
        <View className="search-control">
          {!customLeftIcon ? (
            <Icons name={leftIcon} size={18} color="#C0C4CC" className="search-control-left-icon" />
          ) : (
            customLeftIcon
          )}
          <View
            className="search-field-wrap"
            style={`padding-right: ${!clearable ? pxTransform(8) : pxTransform(20)};`}
          >
            <Input
              ref={inputRef}
              value={innerValue}
              onChange={handleChange}
              placeholder={placeholder}
							// placeholderClass="search-field-placeholder"
							placeholderClass={classNames('search-field-placeholder', `${customPlaceholderClass}`)}
              autoFocus={focus}
              editable={editable}
              onConfirm={handleSearchSubmit}
              onBlur={handleBlur}
							// className="search-field"
							className={classNames('search-field', `${customSearchFieldClass}`)}
              focus={innerFocus}
            />
            {/* 为了解决 ios 点击 Input 不会触发父级点击事件的问题 */}
            {!editable ? <View className="search-field-placeholder" /> : null}
          </View>
          {clearable && innerValue.length > 0 && (
            <View className="search-control-right-icon" onClick={handleClear}>
              <Icons name="Close" size={14} color="#F7F7F7" />
            </View>
          )}
        </View>
      </View>
      {!!showAction &&
        (!customAction ? (
          <View onClick={handleCancel} className="search-action">
            {actionText}
          </View>
        ) : (
          customAction
        ))}
    </View>
  )
})

Search.defaultProps = {
  label: '',
  shape: 'round',
  showAction: false,
  background: '#FFFFFF',
  actionText: getIntl().formatMessage({ id: 'search_default_actionText', defaultMessage: '取消' }),
  focus: false,
  editable: true,
  clearable: false,
  placeholder: getIntl().formatMessage({ id: 'search_default_title', defaultMessage: '请输入搜索关键词' }),
  leftIcon: 'Search',
  customLeftIcon: null,
  customAction: null,
  searchOnClearAction: true,
  onSearch: undefined,
  onCancel: undefined,
  onClear: undefined,
  onClick: undefined,
  onBlur: undefined,
	customPlaceholderClass: undefined,
	customSearchFieldClass: undefined,
}

export default Search
