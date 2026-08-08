/*
 * @Author: GHua
 * @Date: 2022-03-25 20:27:42
 * @LastEditTime: 2022-03-31 19:22:15
 * @LastEditors: GHua
 * @Description:
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils'
import cx from 'classnames'
import { useHistory, useLocation } from '@linkseeks/router-core'
import { FILTER_PARAM, FILTER_SEARCH_TYPE, FILTER_TYPE } from '../CommonFilter/types'
import { Checkbox } from 'antd'
import { COMMODITY_SHOW_TYPE } from '../../constants'
import './index.less'

interface SortBarProps {
  isMro?: boolean
  checkPrice?: boolean
  current: number
  pageSize: number
  totalCount: number
  filterType: FILTER_SEARCH_TYPE
  showType: COMMODITY_SHOW_TYPE
  filterParam: FILTER_PARAM | undefined
  onShowTypeChange?: (type: COMMODITY_SHOW_TYPE) => void
  onCheckPriceChange?: (state: boolean) => void
  onPageChange?: (page: number) => void
  onFilterChange?: (values: FILTER_PARAM | undefined) => void
}

const SortBar: React.FC<SortBarProps> = (props) => {
  const {
    filterType,
    isMro,
    totalCount,
    current,
    pageSize,
    showType,
    checkPrice,
    filterParam,
    onShowTypeChange,
    onCheckPriceChange,
    onPageChange,
    onFilterChange,
  } = props
  const history = useHistory()
  const { pathname, search } = useLocation()
  const intl = useIntl()

  const judgeIsActive = (type: number) => {
    if (filterParam) {
      if (Number(filterParam?.orderType) === type) {
        return true
      }
    }
    return false
  }

  const changeOrderTypeUrl = (url: string, type: string | null) => {
    let newUrl = url
    if (!type) {
      return removeURLArg(newUrl, 'orderType')
    }
    if (url.indexOf('orderType') > -1) {
      newUrl = changeURLArg(newUrl, 'orderType', type)
    } else {
      newUrl += `${search ? `&` : '?'}orderType=${type}`
    }
    return newUrl
  }

  const handleSort = (type: FILTER_TYPE) => {
    let url = `${pathname}${search}`
    let finalOrderType: string | null = null
    const orderType = getQueryString('orderType', search)
    switch (type) {
      case FILTER_TYPE.priceSort:
        if (search.indexOf('orderType') > -1) {
          if (Number(orderType) === 3) {
            finalOrderType = '4'
          } else {
            finalOrderType = '3'
          }
        } else {
          if (filterType === FILTER_SEARCH_TYPE.url) {
            finalOrderType = '3'
          } else {
            if (Number(filterParam?.orderType) === 3) {
              finalOrderType = '4'
            } else {
              finalOrderType = '3'
            }
          }
        }
        break
      case FILTER_TYPE.soldSort:
        if (Number(orderType) === 1) {
          finalOrderType = null
        } else {
          finalOrderType = '1'
        }
        break
      case FILTER_TYPE.creditSort:
        if (Number(orderType) === 2) {
          finalOrderType = null
        } else {
          finalOrderType = '2'
        }
        break
      default:
        break
    }
    if (filterType === FILTER_SEARCH_TYPE.url) {
      url = changeOrderTypeUrl(url, finalOrderType)
      history.push(url)
    } else {
      onFilterChange &&
        onFilterChange({
          ...filterParam,
          orderType: finalOrderType,
        })
    }
  }

  const handlePageChange = (page: number) => {
    onPageChange && onPageChange(page)
  }

  const setShowType = (type: COMMODITY_SHOW_TYPE) => {
    onShowTypeChange && onShowTypeChange(type)
  }

  const setCheckPrice = (state: boolean) => {
    onCheckPriceChange && onCheckPriceChange(state)
  }

  return (
    <div className="tool_bar">
      <div className="tool_bar_left">
        <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.soldSort)}>
          <span className={judgeIsActive(1) ? 'active' : ''}>{intl.formatMessage({ id: 'sortBar.salesVolume' })}</span>
          <CaretDownOutlined className={cx('arrowIcon', judgeIsActive(1) ? 'active' : '')} />
        </div>
        <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.creditSort)}>
          <span className={judgeIsActive(2) ? 'active' : ''}>{intl.formatMessage({ id: 'sortBar.credit' })}</span>
          <CaretDownOutlined className={cx('arrowIcon', judgeIsActive(2) ? 'active' : '')} />
        </div>
        <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.priceSort)}>
          <span className={judgeIsActive(3) || judgeIsActive(4) ? 'active' : ''}>
            {intl.formatMessage({ id: 'sortBar.price' })}
          </span>
          <div className={'price_filter_box'}>
            <CaretUpOutlined className={cx('icon', judgeIsActive(4) ? 'active' : '')} />
            <CaretDownOutlined className={cx('icon', judgeIsActive(3) ? 'active' : '')} />
          </div>
        </div>
        {isMro && (
          <Checkbox
            checked={checkPrice}
            onChange={(e) => {
              setCheckPrice(e.target.checked)
            }}
          >
            {intl.formatMessage({ id: 'sortBar.spotGoods' })}
          </Checkbox>
        )}
      </div>
      <div className="tool_bar_right">
        <div className="count">
          <span>{intl.formatMessage({ id: 'sortBar.common' })}</span>
          <label>{totalCount}</label>
          <span>{intl.formatMessage({ id: 'sortBar.items' })}</span>
        </div>
        {!isMro && (
          <div className="showTypeBox">
            <AppstoreOutlined
              className={cx('icon', showType === COMMODITY_SHOW_TYPE.gird ? 'active' : '')}
              onClick={() => setShowType(COMMODITY_SHOW_TYPE.gird)}
            />
          </div>
        )}
        {!isMro && (
          <div className="showTypeBox">
            <UnorderedListOutlined
              className={cx('icon', showType === COMMODITY_SHOW_TYPE.list ? 'active' : '')}
              onClick={() => setShowType(COMMODITY_SHOW_TYPE.list)}
            />
          </div>
        )}
        <div className="pageBox">
          <LeftOutlined
            className={cx('pageBoxIcon', current === 1 ? 'disabled' : '')}
            onClick={() => {
              if (current > 1) {
                handlePageChange(current - 1)
              }
            }}
          />
          <div className="pageBox_main">
            <span>{current}</span>
            <span>/</span>
            <span>{Math.ceil(totalCount / pageSize) || 1}</span>
          </div>
          <RightOutlined
            className={cx('pageBoxIcon', current >= Math.ceil(totalCount / pageSize) ? 'disabled' : '')}
            onClick={() => {
              if (current < Math.ceil(totalCount / pageSize)) {
                handlePageChange(current + 1)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default SortBar
