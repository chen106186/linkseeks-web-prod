/*
 * @Author: GHua
 * @Date: 2022-03-25 15:19:38
 * @LastEditTime: 2022-03-29 18:04:33
 * @LastEditors: GHua
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { InputNumber } from 'antd'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { useHistory } from '@linkseeks/router-core'
import { changeURLArg } from '@/utils'
import FilterBox from '../FilterBox'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '../types'
import './index.less'
import { getWebIntl } from '@apps/locales'
import IconFont from '../../../utils/iconfont'
const translate = getWebIntl()
interface PriceRangePropsType {
  innerValue: FILTER_PARAM | undefined
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FILTER_PARAM) => void
  filterType?: FILTER_SEARCH_TYPE
  pathname?: string
  search?: string
}

const PriceRange: React.FC<PriceRangePropsType> = (props) => {
  const { innerValue, pathname, filterType, search, onChange } = props
  const [minPrice, setMinPrice] = useState<number | null>()
  const [maxPrice, setMaxPrice] = useState<number | null>()
  const [confirmDisable, setConfirmDisable] = useState<boolean>(true)
  const history = useHistory()
  const intl = useIntl()

  useEffect(() => {
    if (innerValue) {
      if (innerValue.min) {
        setMinPrice(innerValue.min)
      } else {
        setMinPrice(undefined)
      }
      if (innerValue.max) {
        setMaxPrice(innerValue.max)
      } else {
        setMaxPrice(undefined)
      }
    } else {
      setMinPrice(undefined)
      setMaxPrice(undefined)
    }
  }, [innerValue])

  useEffect(() => {
    if (minPrice || maxPrice) {
      setConfirmDisable(false)
    } else {
      setConfirmDisable(true)
    }
  }, [minPrice, maxPrice])

  const handleConfirmPriceRange = () => {
    const min = minPrice
    const max = maxPrice
    let url = ''
    if (search) {
      url = `${pathname}${search}`
      if (search.indexOf('min') > -1) {
        url = changeURLArg(url, 'min', `${min}`)
      } else {
        if (min) url = `${url}&min=${min}`
      }
      if (search.indexOf('max') > -1) {
        url = changeURLArg(url, 'max', `${max}`)
      } else {
        if (max) url = `${url}&max=${max}`
      }
    } else {
      url = `${pathname}?${min ? `min=${min}` : ''}${max ? `${min ? '&' : ''}max=${max}` : ''}`
    }
    if (search) {
      history.push(url)
    } else {
      window.location.href = url
    }
  }

  const handleMinChange = (value: number | null) => {
    setMinPrice(value)
  }

  const handleMaxChange = (value: number | null) => {
    setMaxPrice(value)
  }

  const handleConfirm = () => {
    if (filterType === 'silence') {
      onChange &&
        onChange({
          ...innerValue,
          min: minPrice,
          max: maxPrice,
        })
    } else {
      handleConfirmPriceRange()
    }
  }

  return (
    <FilterBox title={intl.formatMessage({ id: 'filter.priceRange.title' })}>
      <div className="filter_price">
        <div className="price_box">
          <div className="price_range">
            <InputNumber
              min={0}
              className="price_input"
              value={minPrice}
              placeholder={translate('web.common.currencySymbol')}
              onChange={handleMinChange}
            />
            <span className="split">-</span>
            <InputNumber
              min={minPrice || 0}
              className="price_input"
              value={maxPrice}
              placeholder={translate('web.common.currencySymbol')}
              onChange={handleMaxChange}
            />
          </div>
          <div className={cx('confirm_btn', confirmDisable ? 'disabled' : {})} onClick={handleConfirm}>
            <IconFont className="confirm_btn_icon" type="icon-a-tubiao1" />
          </div>
        </div>
      </div>
    </FilterBox>
  )
}

PriceRange.defaultProps = {
  filterType: FILTER_SEARCH_TYPE.url,
}

export default PriceRange
