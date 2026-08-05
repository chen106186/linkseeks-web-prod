/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-27 18:48:09
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-28 18:00:26
 * @Description: 选择组件
 */
import React, { useEffect, useState, useImperativeHandle } from 'react'
import { View, IndexList } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import './index.scss'

export type FilterTofuOption = {
  /**
   * 展示文本
   */
  label: string
  /**
   * 值
   */
  value: any
  /**
   * 是否禁用，暂时不用
   */
  disabled?: boolean
  children?: any[]
}

interface ItemType {
  name: string
  value: string
}

interface IndexListItemType {
  title: string
  key: string
  items: ItemType[]
}

export type FilterTofuValue = any | any[]

interface FilterTofuProps {
  maxLength?: number
  /**
   * 是否多选，默认 false
   */
  multiple?: boolean
  /**
   * 选项
   */
  options: FilterTofuOption[]
  /**
   *
   */
  indexList?: boolean
  /**
   * 值
   */
  value?: FilterTofuValue
  /**
   * 默认值
   */
  defaultValue?: FilterTofuValue
  /**
   * 选择改变触发事件，根据是否多选返回不同类型的值
   */
  onChange?: (value: FilterTofuValue) => void
}

export interface FilterTofuRefHandle {
  /**
   * 值
   */
  getValue: () => FilterTofuValue
  /**
   * 设置值
   */
  setValue: (newValue: FilterTofuValue) => void
}

const FilterTofu = React.forwardRef<FilterTofuRefHandle | undefined, FilterTofuProps>((props: FilterTofuProps, ref) => {
  const { multiple, options, value, defaultValue, maxLength, indexList, onChange } = props
  const [innerValue, setInnerValue] = useState<FilterTofuValue>(defaultValue || [])
  const intl = useIntl()
  useEffect(() => {
    if ('value' in props) {
      setInnerValue(value)
    }
  }, [value])

  const triggerChange = (next: FilterTofuValue) => {
    if (!('value' in props)) {
      setInnerValue(next)
    }
    onChange?.(next)
  }

  const handleSelectItem = (record: FilterTofuOption) => {
    if (record.disabled) {
      return
    }
    if (!multiple) {
      if (record.value === innerValue) {
        triggerChange([])
      } else {
        triggerChange(record.value)
      }
      return
    }

    const newData = [...innerValue]
    const index = newData.findIndex((item) => item === record.value)

    if (index !== -1) {
      newData.splice(index, 1)
    } else {
      newData.push(record.value)
    }
    triggerChange(newData)
  }

  const isFilterItemActive = (record: FilterTofuOption) => {
    const newData: any[] = !multiple ? [innerValue] : innerValue
    return newData.includes(record.value)
  }

  useImperativeHandle(ref, () => ({
    getValue: () => innerValue,
    setValue: (newValue: FilterTofuValue) => setInnerValue(newValue),
  }))

  const renderItem = (itemInfo: any, index: number) => {
    return (
      <View
        className={classNames('filter-tofu-item', { 'filter-tofu-item__active': isFilterItemActive(itemInfo) })}
        onClick={() => handleSelectItem(itemInfo)}
      >
        <View key={`${itemInfo.value}-${index}`} className="filter-tofu-item-wrap">
          <View className="filter-tofu-item-content">{itemInfo.name}</View>
        </View>
      </View>
    )
  }

  return indexList ? (
    <IndexList
      list={options as unknown as IndexListItemType[]}
      isShowToast={false}
      isVibrate={false}
      className="filter-page-scroll"
      itemWrapClassName="filter-tofu__indexes"
      renderItem={renderItem}
      topKey={intl.formatMessage({ id: 'search.sheng', defaultMessage: '省' })}
    />
  ) : (
    <View className="filter-tofu">
      {options.map(
        (item, index) =>
          ((maxLength && index < maxLength) || !maxLength) && (
            <View
              key={`${item.value}-${index}`}
              className={classNames('filter-tofu-item', { 'filter-tofu-item__active': isFilterItemActive(item) })}
              onClick={() => handleSelectItem(item)}
            >
              <View className="filter-tofu-item-wrap">
                <View className="filter-tofu-item-content">{item.label}</View>
              </View>
            </View>
          ),
      )}
    </View>
  )
})

FilterTofu.defaultProps = {
  multiple: false,
  onChange: undefined,
  indexList: false,
}

export default FilterTofu
