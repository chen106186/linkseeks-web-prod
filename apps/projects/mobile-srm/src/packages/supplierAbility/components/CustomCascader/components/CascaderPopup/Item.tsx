/**
 * @Deprecated 级联选择项组件
 */
import React, { useState, useEffect, useRef } from 'react'
import { ITouchEvent } from '@tarojs/components'
import { View, Text, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import { COLOR, PRIMARY } from '@/constants/theme'
import './index.scss'

export type CascaderItemType = {
  /**
   * 名称
   */
  title?: string
  /**
   * 值
   */
  value?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 子项
   */
  children?: CascaderItemType[]
} & Record<string, any>

export type CascaderItemValueType = CascaderItemType | null

export type FieldNamesType = {
  label?: string
  value?: string
  children?: string
}

export interface CascaderItemProps {
  /**
   * 当前选择的项id
   */
  checked?: string
  /**
   * 默认选择的项id
   */
  defaultChecked?: React.Key
  /**
   * 数据
   */
  dataSource: CascaderItemType[]
  /**
   * 选择区域触发事件，null表示没有数据了
   */
  onChange?: (value: CascaderItemValueType, e?: ITouchEvent) => void
  /**
   * 区域名称匹配上触发函数，用于展示区域名称
   */
  onMatchName?: (name: string) => void
  /**
   * 自定义节点 label、value、children 的字段，默认 { label: label, value: value, children: children }
   */
  fieldNames?: FieldNamesType
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
}

export const CascaderItem: React.FC<CascaderItemProps> = (props) => {
  const { checked, defaultChecked, dataSource, onChange, onMatchName, fieldNames, customStyle } = props

  const [innerChecked, setInnerChecked] = useState<React.Key | undefined>(defaultChecked || undefined)

  // 是否是手动选择标识
  const inputRef = useRef(false)

  const labelKeyName = fieldNames?.label || 'label'
  const valueKeyName = fieldNames?.value || 'value'

  const triggerChange = (value: CascaderItemValueType, e?: ITouchEvent) => {
    onChange?.(value, e)
  }

  useEffect(() => {
    if ('checked' in props) {
      setInnerChecked(checked!)
    }
  }, [checked])

  useEffect(() => {
    let match2: CascaderItemType | null = null
    if (!inputRef.current && (!dataSource || !dataSource.length)) {
      return
    }
    for (let i = 0; i < dataSource.length; i++) {
      const item = dataSource[i]
      if (item[valueKeyName] === innerChecked) {
        match2 = item
        break
      }
    }
    onMatchName?.(match2?.[labelKeyName] || '')
  }, [dataSource, innerChecked])

  const handleChooseItem = (item: CascaderItemType, e: ITouchEvent) => {
    e.stopPropagation()
    // 跳过
    if (item.disabled) {
      return
    }
    inputRef.current = true
    if (!('checked' in props)) {
      setInnerChecked(item[valueKeyName])
    }
    onMatchName?.(item[labelKeyName])
    triggerChange(item, e)
  }

  return (
    <View className="cascader-item-list" style={customStyle}>
      {dataSource?.map((item) => (
        <View
          className={classNames('cascader-item-list-item', {
            'cascader-item-list-item__disabled': item.disabled,
          })}
          key={`${item[valueKeyName]}`}
          onClick={(e) => handleChooseItem(item, e)}
        >
          <View className="cascader-item-list-item-titleWrap">
            <Text className="cascader-item-list-item-title">{item[labelKeyName]}</Text>
            {item[valueKeyName] === innerChecked ? (
              <View className="cascader-item-list-item-icon">
                <Icons name="Right" size={14} color={COLOR[PRIMARY]} />
              </View>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  )
}

export default CascaderItem
