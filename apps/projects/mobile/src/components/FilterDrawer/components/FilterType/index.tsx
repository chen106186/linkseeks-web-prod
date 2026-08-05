/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-28 18:59:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-28 20:32:52
 * @Description:
 */
import { FILTER_PARAM, FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import React, { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import FilterShelf from '../FilterShelf'
import FilterTofu, { FilterTofuOption, FilterTofuValue } from '../FilterTofu'
import './index.scss'

interface FilterTypeProps {
  /**
   * 是否多选，默认 false
   */
  multiple?: boolean
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: any) => void
  /**
   * 选中参数
   */
  innerValue: FILTER_PARAM | undefined
}

const FilterType: React.FC<FilterTypeProps> = (props: FilterTypeProps) => {
  const { multiple, innerValue, onChange } = props
  const [options, setOptions] = useState<FilterTofuOption[]>([])
  const [tofuValue, setTofuValue] = useState<FilterTofuValue>([])
  const intl = useIntl()
  useEffect(() => {
    if (innerValue && innerValue.priceTypeList) {
      const selectVal = innerValue.priceTypeList[0]
      setTofuValue(selectVal)
    } else {
      setTofuValue([])
    }
  }, [innerValue])

  const getOptions = () => {
    setOptions([
      { label: intl.formatMessage({ id: 'search.xianhuoshangpin', defaultMessage: '现货商品' }), value: 1 },
      { label: intl.formatMessage({ id: 'search.xunjiashangpin', defaultMessage: '询价商品' }), value: 2 },
    ])
  }

  useEffect(() => {
    getOptions()
  }, [])

  const handleChange = (value: FilterTofuValue) => {
    setTofuValue(value)
    if (onChange) {
      onChange({
        ...innerValue,
        [FILTER_PARAM_KEY.priceTypeList]: Array.isArray(value) ? value : [value],
      })
    }
  }

  return (
    <>
      <FilterShelf
        title={intl.formatMessage({ id: 'search.shangpinleixing', defaultMessage: '商品类型' })}
        more={false}
      >
        <FilterTofu options={options} value={tofuValue} onChange={handleChange} multiple={multiple} />
      </FilterShelf>
    </>
  )
}

FilterType.defaultProps = {
  multiple: false,
}

export default FilterType
