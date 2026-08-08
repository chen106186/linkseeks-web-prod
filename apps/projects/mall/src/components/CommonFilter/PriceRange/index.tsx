import React, { useState, useEffect } from 'react'
import { InputNumber } from 'antd'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import useHistory from '@/hooks/useHistory'
import { changeURLArg, removeURLArg } from '@/utils/getUrlParam'
import IconFont from '@/utils/iconfont'
import FilterBox from '../FilterBox'
import { FILTER_PARAM } from '../types'
import './index.less'

interface PriceRangePropsType {
  innerValue: FILTER_PARAM | undefined
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FILTER_PARAM) => void
  pathname?: string
  search?: string
}

const PriceRange: React.FC<PriceRangePropsType> = (props) => {
  const { innerValue, pathname, search, onChange } = props
  const [minPrice, setMinPrice] = useState<number | null>()
  const [maxPrice, setMaxPrice] = useState<number | null>()
  const [confirmDisable, setConfirmDisable] = useState<boolean>(true)
  const history = useHistory()
  const translate = getWebIntl()

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
        if (min) {
          url = changeURLArg(url, 'min', `${min}`)
        } else {
          url = removeURLArg(url, 'min')
        }
      } else {
        if (min) url = `${url}&min=${min}`
      }
      if (search.indexOf('max') > -1) {
        if (max) {
          url = changeURLArg(url, 'max', `${max}`)
        } else {
          url = removeURLArg(url, 'max')
        }
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
    handleConfirmPriceRange()
  }

  return (
    <FilterBox title={translate('web.resource.mall.price')}>
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

export default PriceRange
