/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-13 13:54:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-13 18:30:37
 * @Description: 排序栏
 */
import React, { useState, useEffect } from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import classNames from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { useMobileIntl } from '@apps/locales'
import { FILTER_BAR_TYPE, FILTER_BAR_TYPE_ONE } from './type'
import './index.scss'

export type SortOrderType = 'ASC' | 'DESC' | null

export type FilterSortBarValue = {
  /**
   * 销量
   */
  [FILTER_BAR_TYPE.soldSort]: boolean
  /**
   * 信用
   */
  [FILTER_BAR_TYPE.creditSort]: boolean
  /**
   * 价格
   */
  [FILTER_BAR_TYPE.priceSort]: SortOrderType
  /**
   * 发布时间
   */
  [FILTER_BAR_TYPE.publishTime]: SortOrderType
  /**
   * 剩余时间
   */
  [FILTER_BAR_TYPE.remainingTime]: SortOrderType
  /**
   * 默认
   */
  [FILTER_BAR_TYPE.defaultdSort]: boolean
  /**
   * 预估返现
   */
  [FILTER_BAR_TYPE.rewardSort]: SortOrderType
}

interface FilterSortBarProps {
  /**
   * 值
   */
  value?: FilterSortBarValue
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FilterSortBarValue) => void
  /**
   * 是否可以多个选择的，默认为 false
   */
  multiple?: boolean
  /**
   * 自定义外部 style
   */
  customStyle?: string | React.CSSProperties
  /**
   * 自定义外部 className
   */
  customClassName?: string | React.CSSProperties
  /**
   * 右侧额外内容
   */
  extra?: React.ReactNode
  config: FILTER_BAR_TYPE_ONE[]
}

export const SORT_ORDER: SortOrderType[] = ['ASC', 'DESC', null]

// 默认值
const DEFAULT_VALUES = {
  [FILTER_BAR_TYPE.soldSort]: false,
  [FILTER_BAR_TYPE.creditSort]: false,
  [FILTER_BAR_TYPE.priceSort]: null,
  [FILTER_BAR_TYPE.defaultdSort]: false,
  [FILTER_BAR_TYPE.rewardSort]: null,
}

const FilterSortBar: React.FC<FilterSortBarProps> = (props: FilterSortBarProps) => {
  const { value = DEFAULT_VALUES, onChange, multiple, customStyle, customClassName, extra, config } = props
  const initInnerValues = value || DEFAULT_VALUES
  const [innerValues, setInnerValues] = useState<FilterSortBarValue>(initInnerValues)
  const intl = useIntl()
  const translate = useMobileIntl()

  useEffect(() => {
    if ('value' in props) {
      setInnerValues(value as FilterSortBarValue)
    }
  }, [value])

  const triggerChange = (next: FilterSortBarValue) => {
    if (!('value' in props)) {
      setInnerValues(next)
    }
    onChange?.(next)
  }

  const findNextSortOrder = (current: SortOrderType): SortOrderType => {
    const index = SORT_ORDER.findIndex((item) => item === current)
    const nextIndex = index !== SORT_ORDER.length - 1 ? index + 1 : 0
    return SORT_ORDER[nextIndex]
  }

  const handleFilterItem = (name: string, next: any) => {
    const newValues = !multiple ? { ...DEFAULT_VALUES } : { ...innerValues }
    newValues[name] = next
    triggerChange(newValues)
  }

  const checkItemActive = (name: string, current: any): boolean => innerValues?.[name] === current

  return (
    <View className={classNames('filter-sort-bar', customClassName)} style={customStyle}>
      <View className="filter-sort-bar-list">
        {config.includes(FILTER_BAR_TYPE.soldSort) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active': checkItemActive(FILTER_BAR_TYPE.soldSort, true),
            })}
            onClick={() => handleFilterItem(FILTER_BAR_TYPE.soldSort, !innerValues?.[FILTER_BAR_TYPE.soldSort])}
          >
            <Text className="filter-sort-bar-list-item-name">
              {intl.formatMessage({ id: 'search.xiaoliang', defaultMessage: '销量' })}
            </Text>
          </View>
        )}
        {config.includes(FILTER_BAR_TYPE.defaultdSort) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active': checkItemActive(FILTER_BAR_TYPE.defaultdSort, true),
            })}
            onClick={() => handleFilterItem(FILTER_BAR_TYPE.defaultdSort, !innerValues?.[FILTER_BAR_TYPE.defaultdSort])}
          >
            <Text className="filter-sort-bar-list-item-name">
              {intl.formatMessage({ id: 'search.moren', defaultMessage: '默认' })}
            </Text>
          </View>
        )}
        {/* 隐藏信用排序 */}
        {/* {config.includes(FILTER_BAR_TYPE.creditSort) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active': checkItemActive(FILTER_BAR_TYPE.creditSort, true),
            })}
            onClick={() => handleFilterItem(FILTER_BAR_TYPE.creditSort, !innerValues?.[FILTER_BAR_TYPE.creditSort])}
          >
            <Text className="filter-sort-bar-list-item-name">
              {intl.formatMessage({ id: 'search.xinyong', defaultMessage: '信用' })}
            </Text>
          </View>
        )} */}
        {config.includes(FILTER_BAR_TYPE.rewardSort) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active':
                checkItemActive(FILTER_BAR_TYPE.rewardSort, 'ASC') ||
                checkItemActive(FILTER_BAR_TYPE.rewardSort, 'DESC'),
            })}
            onClick={() =>
              handleFilterItem(FILTER_BAR_TYPE.rewardSort, findNextSortOrder(innerValues?.[FILTER_BAR_TYPE.rewardSort]))
            }
          >
            <Text className="filter-sort-bar-list-item-name">
              {intl.formatMessage({ id: 'search.yugufanli', defaultMessage: '预估返利' })}
            </Text>
            <View className="filter-sort-bar-list-item-sorter">
              <View
                className={classNames('filter-sort-bar-list-item-sorter-up', {
                  active: checkItemActive(FILTER_BAR_TYPE.rewardSort, 'ASC'),
                })}
              >
                <Icons className="filter-sort-bar-list-item-icon" name="ArrowUpFill" size={12} />
              </View>
              <View
                className={classNames('filter-sort-bar-list-item-sorter-down', {
                  active: checkItemActive(FILTER_BAR_TYPE.rewardSort, 'DESC'),
                })}
              >
                <Icons className="filter-sort-bar-list-item-icon" name="ArrowDownFill" size={12} />
              </View>
            </View>
          </View>
        )}
        {config.includes(FILTER_BAR_TYPE.priceSort) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active':
                checkItemActive(FILTER_BAR_TYPE.priceSort, 'ASC') || checkItemActive(FILTER_BAR_TYPE.priceSort, 'DESC'),
            })}
            onClick={() =>
              handleFilterItem(FILTER_BAR_TYPE.priceSort, findNextSortOrder(innerValues?.[FILTER_BAR_TYPE.priceSort]))
            }
          >
            <Text className="filter-sort-bar-list-item-name">
              {intl.formatMessage({ id: 'search.jiage', defaultMessage: '价格' })}
            </Text>
            <View className="filter-sort-bar-list-item-sorter">
              <View
                className={classNames('filter-sort-bar-list-item-sorter-up', {
                  active: checkItemActive(FILTER_BAR_TYPE.priceSort, 'ASC'),
                })}
              >
                <Icons className="filter-sort-bar-list-item-icon" name="ArrowUpFill" size={12} />
              </View>
              <View
                className={classNames('filter-sort-bar-list-item-sorter-down', {
                  active: checkItemActive(FILTER_BAR_TYPE.priceSort, 'DESC'),
                })}
              >
                <Icons className="filter-sort-bar-list-item-icon" name="ArrowDownFill" size={12} />
              </View>
            </View>
          </View>
        )}
        {config.includes(FILTER_BAR_TYPE.publishTime) && (
          <View
            className={classNames('filter-sort-bar-list-item', {
              'filter-sort-bar-list-item__active': checkItemActive(FILTER_BAR_TYPE.publishTime, true),
            })}
            onClick={() => handleFilterItem(FILTER_BAR_TYPE.publishTime, !innerValues?.[FILTER_BAR_TYPE.publishTime])}
          >
            <Text className="filter-sort-bar-list-item-name">
              {translate('mobile.common.shangjiashiian', { defaultMessage: '上架时间' })}
            </Text>
          </View>
        )}
      </View>
      <View className="filter-sort-bar-extra">{extra}</View>
    </View>
  )
}

export default FilterSortBar
