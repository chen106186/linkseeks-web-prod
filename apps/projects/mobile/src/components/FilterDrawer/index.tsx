/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-13 19:12:01
 * @LastEditors: GHua
 * @LastEditTime: 2022-03-14 11:46:04
 * @Description: 过滤抽屉
 */
import React, { useEffect, useState } from 'react'
import { IS_WEB } from '@/constants'
import { View, Button } from '@apps/mobile-ui'
import { getSystemInfoSync } from '@apps/mobile-services/utils/taro'
import { FILTER_CONFIG_TYPE } from '@/store/searchStore/model'
import { themeLayout } from '@/constants/theme'
import { useIntl } from '@linkseeks/i18n'
import Popup from '../Popup'
import FilterClassify from './components/FilterClassify'
import FilterBrand from './components/FilterBrand'
import FilterOrigin from './components/FilterOrigin'
import FilterPriceRange from './components/FilterPriceRange'
import FilterType from './components/FilterType'
import { FILTER_PARAM } from '../FilterSortBar/type'
import './index.scss'

interface FilterDrawerProps {
  /**
   * 店铺id
   */
  storeId?: string | undefined
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose?: () => void
  /**
   * 顶部偏移距离
   */
  offsetTop?: number
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: any) => void
  /**
   * 品类和品牌是否支持多选
   */
  multiple?: boolean
  filterParam?: FILTER_PARAM
  filterConfig?: FILTER_CONFIG_TYPE[]
}

const FilterDefaultConfig = [
  FILTER_CONFIG_TYPE.category,
  FILTER_CONFIG_TYPE.brand,
  // FILTER_CONFIG_TYPE.address,
  FILTER_CONFIG_TYPE.price,
  FILTER_CONFIG_TYPE.priceType,
]

const FilterDrawer: React.FC<FilterDrawerProps> = (props: FilterDrawerProps) => {
  const {
    visible,
    onClose,
    storeId,
    filterParam,
    onChange,
    filterConfig = FilterDefaultConfig,
    multiple = true,
    offsetTop,
  } = props
  const [innerValue, setInnerValue] = useState<FILTER_PARAM>()
  const intl = useIntl()
  const safeBottom = getSystemInfoSync().safeArea.bottom
  const screenHeight = getSystemInfoSync().screenHeight
	const [resetKey, setResetKey] = useState(0)

  const safePadding = IS_WEB ? 0 : screenHeight - safeBottom

  useEffect(() => {
    if (filterParam) {
      console.log(filterParam, 'filterParam')
      setInnerValue(filterParam)
    }
  }, [filterParam])

  const handleClose = () => {
    onClose?.()
  }

  const formatParam = (param: FILTER_PARAM | undefined) => {
    if (!param) return param
    const newParam = {}
    Object.keys(param).forEach((key) => {
      const item = param[key]
      if (item !== undefined) {
        if (Array.isArray(item)) {
          if (item.length > 0) {
            newParam[key] = item
          }
        } else {
          newParam[key] = item
        }
      }
    })
    return newParam as FILTER_PARAM
  }

  const handleConfirm = () => {
    if (onChange) {
      console.log(innerValue, 1)
      console.log(formatParam(innerValue), 2)
      onChange(formatParam(innerValue))
      handleClose()
    }
  }

  const handleChange = (values) => {
    setInnerValue(values)
  }

  const handleRest = () => {
    setInnerValue(undefined)
		setResetKey(prev => prev + 1)
  }

  const _renderFilterItem = () => {
    if (!filterConfig) return undefined
    return filterConfig.map((filterKey) => {
      switch (filterKey) {
        case FILTER_CONFIG_TYPE.category:
          return (
            <FilterClassify innerValue={innerValue} onChange={handleChange} storeId={storeId} multiple={multiple} />
          )
        case FILTER_CONFIG_TYPE.brand:
          return <FilterBrand innerValue={innerValue} onChange={handleChange} storeId={storeId} multiple={multiple} />
        case FILTER_CONFIG_TYPE.address:
          return <FilterOrigin innerValue={innerValue} onChange={handleChange} storeId={storeId} />
        case FILTER_CONFIG_TYPE.price:
          return <FilterPriceRange key={`price-range-${resetKey}`} innerValue={innerValue} onChange={handleChange} />
        case FILTER_CONFIG_TYPE.priceType:
          return <FilterType innerValue={innerValue} onChange={handleChange} />
        default:
          return null
      }
    })
  }

  return (
    <View className="filter-drawer">
      <Popup
        visible={visible}
        onClose={handleClose}
        position="right"
        closeable={false}
        round={false}
        customClassName="filter-drawer-popup"
        customStyle={{
          top: `${offsetTop}PX`,
        }}
        overlayStyle={{
          top: `${offsetTop}PX`,
        }}
      >
        <View
          className="filter-drawer-content"
          style={{ paddingBottom: safePadding ? `${safePadding}PX` : themeLayout['padding-xs'] }}
        >
          <View className="filter-drawer-scroll">{_renderFilterItem()}</View>
          <View className="filter-page-actions">
            <View className="filter-page-actions-item">
              <Button onClick={handleRest}>
                {intl.formatMessage({ id: 'search.zhongzhi', defaultMessage: '重置' })}
              </Button>
            </View>
            <View className="filter-page-actions-item">
              <Button type="primary" onClick={handleConfirm}>
                {intl.formatMessage({ id: 'search.queren', defaultMessage: '确认' })}
              </Button>
            </View>
          </View>
        </View>
      </Popup>
    </View>
  )
}

FilterDrawer.defaultProps = {
  onClose: undefined,
  offsetTop: 0,
}

export default FilterDrawer
