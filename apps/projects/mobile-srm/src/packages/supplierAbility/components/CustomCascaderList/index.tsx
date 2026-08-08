/*
 * @Description: 级联列表
 */
import React, { useState, useEffect, useRef } from 'react'
import { View, Icons, Button } from '@apps/mobile-ui'
import CustomCascaderPro, { CustomCascaderProProps } from '../CustomCascaderPro'
import './index.scss'

let cascaderKey = 0

function getOnlyCascaderKey() {
  cascaderKey += 1
  return cascaderKey
}

export type CustomCascaderListValueType = React.Key[][]

type CustomCascaderListInternalValueType = {
  key: number
  value: React.Key[]
}[]

export type MatchNamesType = string[][]

interface CustomCascaderListProps {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 自定义样式
   */
  customStyle?: React.CSSProperties
  /**
   * value
   */
  value?: CustomCascaderListValueType
  /**
   * onChange
   */
  onChange?: (value: CustomCascaderListValueType) => void
  /**
   * 级联选择器数据
   */
  cascaderProps: Omit<CustomCascaderProProps, 'value' | 'onChange' | 'onMatchNames'>
  /**
   * 添加按钮文本，默认 string
   */
  btnTxt?: string
  /**
   * 匹配到选中项文本触发事件
   */
  onMatchNames?: (names: MatchNamesType) => void
}

const CustomCascaderList: React.FC<CustomCascaderListProps> = (props: CustomCascaderListProps) => {
  const { disabled, customStyle, value, onChange, cascaderProps, btnTxt = '添加', onMatchNames } = props

  const [internalValue, setInternalValue] = useState<CustomCascaderListInternalValueType>([])

  const namesCache = useRef<MatchNamesType>([])

  const inputRef = useRef(false)

  useEffect(() => {
    if ('value' in props && !inputRef.current) {
      const provideValue = (value || []).map((item) => ({
        key: getOnlyCascaderKey(),
        value: item,
      }))
      setInternalValue(provideValue)
    }
  }, [value])

  const triggerChange = (next: CustomCascaderListInternalValueType) => {
    onChange?.(next?.map((item) => item.value))
  }

  const handleRemove = (index: number) => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    mergedValue.splice(index, 1)
    // 删除名称
    namesCache.current.splice(index, 1)
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
    // 对应的names也需要清空
    handleCascaderItemMatchNames([], index)
  }

  const handleAdd = () => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    mergedValue.push({
      key: getOnlyCascaderKey(),
      value: [],
    })
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
  }

  const handleCascaderItemChange = (value: CustomCascaderProProps['value'], index: number) => {
    inputRef.current = true
    const mergedValue = [...internalValue]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      value: value as CustomCascaderListValueType[0],
    })
    setInternalValue(mergedValue)
    triggerChange(mergedValue)
  }

  const handleCascaderItemMatchNames = (names: string[], index: number) => {
    namesCache.current[index] = names
    // 过滤掉空的数组
    onMatchNames?.([...namesCache.current].filter((item) => item && item.length))
  }

  return (
    <View className="cascader-list" style={customStyle}>
      <View className="cascader-list-list">
        {internalValue.map((item, index) => (
          <View className="cascader-list-list-item" key={item.key || index}>
            <View className="cascader-list-list-item-control">
              <CustomCascaderPro
                value={item.value}
                {...(cascaderProps || {})}
                onChange={(next) => handleCascaderItemChange(next, index)}
                onMatchNames={(next) => handleCascaderItemMatchNames(next, index)}
              />
            </View>
            <View className="cascader-list-list-item-delete">
              <Icons name="Trash" color="#c8cacd" size={16} onClick={() => handleRemove(index)} />
            </View>
          </View>
        ))}
      </View>
      {!disabled ? (
        <View className="cascader-list-add">
          <Button onClick={handleAdd}>
            <Icons size={16} name="Plus" className="cascader-list-add-icon" />
            {btnTxt}
          </Button>
        </View>
      ) : null}
    </View>
  )
}

export default CustomCascaderList
