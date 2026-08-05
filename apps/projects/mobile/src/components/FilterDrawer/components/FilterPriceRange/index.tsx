/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 18:55:54
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 19:39:39
 * @Description: 价格区间过滤
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import { Input } from '@tarojs/components'
import { FILTER_PARAM } from '@/components/FilterSortBar/type'
import { useIntl } from '@linkseeks/i18n'
import FilterShelf from '../FilterShelf'
import './index.scss'

interface FilterPriceRangeProps {
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: any) => void
  /**
   * 选中参数
   */
  innerValue: FILTER_PARAM | undefined
}

const FilterPriceRange: React.FC<FilterPriceRangeProps> = (props) => {
  const { onChange, innerValue } = props
  const intl = useIntl()
  const handleMinPrice = (e) => {
    if (onChange) {
      onChange({
        ...innerValue,
        min: +e.detail.value,
      })
    }
  }

  const handleMaxPrice = (e) => {
    if (onChange) {
      onChange({
        ...innerValue,
        max: +e.detail.value,
      })
    }
  }

  return (
    <>
      <FilterShelf title={intl.formatMessage({ id: 'search.jiagequjian', defaultMessage: '价格区间' })} more={false}>
        <View className="filter-price-form">
          <View className="filter-price-form-field">
            <Input
              className="filter-price-digit"
              placeholderClass="filter-price-digit-placeholder"
              type="digit"
              onBlur={handleMinPrice}
              placeholder={intl.formatMessage({ id: 'search.zuidijia', defaultMessage: '最低价' })}
              alwaysEmbed
            />
          </View>
          <View className="filter-price-form-interval">-</View>
          <View className="filter-price-form-field">
            <Input
              className="filter-price-digit"
              placeholderClass="filter-price-digit-placeholder"
              type="digit"
              onBlur={handleMaxPrice}
              placeholder={intl.formatMessage({ id: 'search.zuigaojia', defaultMessage: '最高价' })}
              alwaysEmbed
            />
          </View>
        </View>
      </FilterShelf>
    </>
  )
}

export default FilterPriceRange
