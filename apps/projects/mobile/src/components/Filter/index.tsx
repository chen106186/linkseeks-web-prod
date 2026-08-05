/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-13 17:21:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-14 10:42:21
 * @Description: 过滤栏
 */
import React, { useState, useEffect } from 'react'
import { View } from '@apps/mobile-ui'
import classNames from 'classnames'
import FilterSortBar, { FilterSortBarValue } from '../FilterSortBar'
import { FILTER_BAR_TYPE, FILTER_BAR_TYPE_ONE } from '../FilterSortBar/type'
import './index.scss'

type FilterValue = FilterSortBarValue & {}

interface FilterProps {
  /**
   * 值
   */
  value?: FilterValue
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FilterValue) => void
  /**
   * 自定义外部 style
   */
  customStyle?: string | React.CSSProperties
  /**
   * 自定义外部 className
   */
  customClassName?: string | React.CSSProperties
  /**
   * 拓展部分
   */
  extra?: React.ReactNode[]
  config?: FILTER_BAR_TYPE_ONE[]
}

const DEFAULT_CONFIG = [FILTER_BAR_TYPE.soldSort, FILTER_BAR_TYPE.creditSort, FILTER_BAR_TYPE.priceSort]

const Filter: React.FC<FilterProps> = (props: FilterProps) => {
  const { value, onChange, customStyle, customClassName, extra, config = DEFAULT_CONFIG } = props
  const [innerValues, setInnerValues] = useState<FilterValue>()

  useEffect(() => {
    if ('value' in props) {
      setInnerValues(value!)
    }
  }, [props, value])

  const triggerChange = (next: FilterValue) => {
    if (!('value' in props)) {
      setInnerValues(next)
    }
    onChange?.(next)
  }

  const handleFilterSortBarChange = (next: FilterSortBarValue) => {
    const newData = { ...innerValues, ...next }
    triggerChange(newData)
  }

  return (
    <View className={classNames('filter', customClassName)} style={customStyle}>
      <FilterSortBar
        config={config}
        value={innerValues}
        onChange={handleFilterSortBarChange}
        extra={
          <>
            {extra ? (
              <View className="filter-extra">
                {extra.map((ele, index) => (
                  <View className="filter-extra-item" key={index}>
                    <View className="filter-extra-item-content">{ele}</View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        }
      />
    </View>
  )
}

export default Filter
