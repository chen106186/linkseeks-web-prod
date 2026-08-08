import React, { Fragment, useState } from 'react'
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import cx from 'classnames'
import { useLocation } from 'react-router-dom'
import { Checkbox } from 'antd'
import { COMMODITY_SHOW_TYPE } from '@/constants'
import { LAYOUT_TYPE } from '@/types/global'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { FILTER_PARAM, FILTER_TYPE } from '../CommonFilter/types'
import './index.less'

interface SortBarProps {
  isMro?: boolean
  isIntegral?: boolean
  checkPrice?: boolean
  current: number
  pageSize: number
  totalCount: number
  showType?: COMMODITY_SHOW_TYPE
  filterParam: FILTER_PARAM | undefined
  layoutType?: LAYOUT_TYPE
  onShowTypeChange?: (type: COMMODITY_SHOW_TYPE) => void
  onCheckPriceChange?: (state: boolean) => void
  onPageChange?: (page: number) => void
  onFilterChange?: (values: FILTER_PARAM | undefined) => void
}

const SortBar: React.FC<SortBarProps> = (props) => {
  const {
    isMro = false,
    isIntegral = false,
    totalCount,
    current,
    pageSize,
    showType = COMMODITY_SHOW_TYPE.gird,
    checkPrice,
    filterParam,
    layoutType,
    onShowTypeChange,
    onCheckPriceChange,
    onPageChange,
  } = props
  const { pathname, search } = useLocation()
  const overdue = getQueryString('overdue', search)
  const aboutUs = getQueryString('aboutUs', search)
  const [overdueChecked, setOverdueChecked] = useState<boolean>(!!overdue)
  const [aboutUsChecked, setAboutsUsChecked] = useState<boolean>(!!aboutUs)
  const translate = getWebIntl()
  const isSRM =
    layoutType === LAYOUT_TYPE.srm ||
    layoutType === LAYOUT_TYPE.srmEnterprise ||
    layoutType === LAYOUT_TYPE.srmPublicity

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
    const key = isSRM ? 'srmOrderType' : 'orderType'
    if (!type) {
      return removeURLArg(newUrl, key)
    }
    if (url.indexOf(key) > -1) {
      newUrl = changeURLArg(newUrl, key, type)
    } else {
      newUrl += `${search ? `&` : '?'}${key}=${type}`
    }
    return newUrl
  }

  /** 只看未过期采购商机:1.是 0.否 */
  const handleOverdue = (checked: boolean) => {
    const url = `${pathname}${search}`
    let newUrl = url
    setOverdueChecked(checked)
    if (overdue) {
      newUrl = removeURLArg(newUrl, 'overdue')
    } else {
      newUrl = changeURLArg(newUrl, 'overdue', '1')
    }

    LinkTo(newUrl)
  }

  /** 只看与我相关:1.是 0.否 */
  const handleAboutUs = (checked: boolean) => {
    const url = `${pathname}${search}`
    let newUrl = url
    setAboutsUsChecked(checked)
    if (aboutUs) {
      newUrl = removeURLArg(newUrl, 'aboutUs')
    } else {
      newUrl = changeURLArg(newUrl, 'aboutUs', '1')
    }

    LinkTo(newUrl)
  }

  const handleSort = (type: FILTER_TYPE) => {
    let url = `${pathname}${search}`
    let finalOrderType: string | null = null
    const key = isSRM ? 'srmOrderType' : 'orderType'
    const orderType = getQueryString(key, search)
    switch (type) {
      case FILTER_TYPE.priceSort:
        if (search.indexOf(key) > -1) {
          if (Number(orderType) === 3) {
            finalOrderType = '4'
          } else {
            finalOrderType = '3'
          }
        } else {
          finalOrderType = '3'
        }
        break
      case FILTER_TYPE.publicTimeSort:
        if (search.indexOf(key) > -1) {
          if (Number(orderType) === 3) {
            finalOrderType = '4'
          } else {
            finalOrderType = '3'
          }
        } else {
          finalOrderType = '3'
        }
        break
      case FILTER_TYPE.srmCreditSort:
        if (search.indexOf(key) > -1) {
          if (Number(orderType) === 1) {
            finalOrderType = '2'
          } else {
            finalOrderType = '1'
          }
        } else {
          finalOrderType = '1'
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
      case FILTER_TYPE.points:
        if (search.indexOf(key) > -1) {
          if (Number(orderType) === 3) {
            finalOrderType = '4'
          } else {
            finalOrderType = '3'
          }
        } else {
          finalOrderType = '3'
        }
        break
      case FILTER_TYPE.dateSort:
        if (Number(orderType) === 5) {
          finalOrderType = null
        } else {
          finalOrderType = '5'
        }
        break
      default:
        break
    }
    url = changeOrderTypeUrl(url, finalOrderType)
    LinkTo(url)
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

  /** 是否显示切换布局按钮 */
  const showSwitchTypeButton =
    !isMro &&
    !isIntegral &&
    layoutType !== LAYOUT_TYPE.srm &&
    layoutType !== LAYOUT_TYPE.srmEnterprise &&
    layoutType !== LAYOUT_TYPE.srmPublicity

  const renderSortItems = () => {
    if (isIntegral) {
      return (
        <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.points)}>
          <span className={judgeIsActive(3) || judgeIsActive(4) ? 'active' : ''}>
            {translate('web.resource.mall.integral')}
          </span>
          <div className={'price_filter_box'}>
            <CaretUpOutlined className={cx('icon', judgeIsActive(4) ? 'active' : '')} />
            <CaretDownOutlined className={cx('icon', judgeIsActive(3) ? 'active' : '')} />
          </div>
        </div>
      )
    }

    if (layoutType === LAYOUT_TYPE.srm) {
      return (
        <Fragment>
          <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.publicTimeSort)}>
            <span className={judgeIsActive(3) || judgeIsActive(4) ? 'active' : ''}>
              {translate('web.resource.mall.fabushijian')}
            </span>
            <div className={'price_filter_box'}>
              <CaretUpOutlined className={cx('icon', judgeIsActive(4) ? 'active' : '')} />
              <CaretDownOutlined className={cx('icon', judgeIsActive(3) ? 'active' : '')} />
            </div>
          </div>
          <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.srmCreditSort)}>
            <span className={judgeIsActive(1) || judgeIsActive(2) ? 'active' : ''}>
              {translate('web.resource.mall.xinyong')}
            </span>
            <div className={'price_filter_box'}>
              <CaretUpOutlined className={cx('icon', judgeIsActive(2) ? 'active' : '')} />
              <CaretDownOutlined className={cx('icon', judgeIsActive(1) ? 'active' : '')} />
            </div>
          </div>
          <div className={'tool_bar_filter_item'}>
            <Checkbox
              checked={overdueChecked}
              onChange={(e) => {
                handleOverdue(e.target.checked)
              }}
            >
              {translate('web.resource.mall.zhikanweiguoqi')}
            </Checkbox>
          </div>
        </Fragment>
      )
    }

    if (layoutType === LAYOUT_TYPE.srmEnterprise) {
      return (
        <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.srmCreditSort)}>
          <span className={judgeIsActive(1) || judgeIsActive(2) ? 'active' : ''}>
            {translate('web.resource.mall.xinyong')}
          </span>
          <div className={'price_filter_box'}>
            <CaretUpOutlined className={cx('icon', judgeIsActive(2) ? 'active' : '')} />
            <CaretDownOutlined className={cx('icon', judgeIsActive(1) ? 'active' : '')} />
          </div>
        </div>
      )
    }

    if (layoutType === LAYOUT_TYPE.srmPublicity) {
      return (
        <Fragment>
          <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.publicTimeSort)}>
            <span className={judgeIsActive(3) || judgeIsActive(4) ? 'active' : ''}>
              {translate('web.resource.mall.fabushijian')}
            </span>
            <div className={'price_filter_box'}>
              <CaretUpOutlined className={cx('icon', judgeIsActive(4) ? 'active' : '')} />
              <CaretDownOutlined className={cx('icon', judgeIsActive(3) ? 'active' : '')} />
            </div>
          </div>
          <div className={'tool_bar_filter_item'}>
            <Checkbox
              checked={aboutUsChecked}
              onChange={(e) => {
                handleAboutUs(e.target.checked)
              }}
            >
              {translate('web.resource.mall.zhikanyuwoxiangguan')}
            </Checkbox>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.soldSort)}>
          <span className={judgeIsActive(1) ? 'active' : ''}>{translate('web.resource.mall.xiaoliang')}</span>
          <CaretDownOutlined className={cx('arrowIcon', judgeIsActive(1) ? 'active' : '')} />
        </div>
        {layoutType !== LAYOUT_TYPE.shop && layoutType !== LAYOUT_TYPE.own && !isIntegral ? (
          <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.creditSort)}>
            <span className={judgeIsActive(2) ? 'active' : ''}>{translate('web.resource.mall.xinyong')}</span>
            <CaretDownOutlined className={cx('arrowIcon', judgeIsActive(2) ? 'active' : '')} />
          </div>
        ) : null}
        <div className={'tool_bar_filter_item'} onClick={() => handleSort(FILTER_TYPE.priceSort)}>
          <span className={judgeIsActive(3) || judgeIsActive(4) ? 'active' : ''}>
            {translate('web.resource.mall.price')}
          </span>
          <div className={'price_filter_box'}>
            <CaretUpOutlined className={cx('icon', judgeIsActive(4) ? 'active' : '')} />
            <CaretDownOutlined className={cx('icon', judgeIsActive(3) ? 'active' : '')} />
          </div>
        </div>
        <div className="tool_bar_filter_item" onClick={() => handleSort(FILTER_TYPE.dateSort)}>
          <span className={judgeIsActive(5) ? 'active' : ''}>{translate('web.resource.mall.shangjiashijian')}</span>
          <CaretDownOutlined className={cx('arrowIcon', judgeIsActive(5) ? 'active' : '')} />
        </div>
      </Fragment>
    )
  }

  const renderCount = () => {
    if (layoutType === LAYOUT_TYPE.srm) {
      return (
        <span>
          {translate('web.resource.mall.gongcounttiaoxinxi', {
            count: totalCount,
          })}
        </span>
      )
    }

    if (layoutType === LAYOUT_TYPE.srmEnterprise) {
      return (
        <span>
          {translate('web.resource.mall.gongcounttiaocaigoushang', {
            count: totalCount,
          })}
        </span>
      )
    }

    return (
      <span>
        {translate('web.resource.mall.gongjigeshangpin', {
          defaultMessage: '共{{count}}个商品',
          count: totalCount,
        })}
      </span>
    )
  }

  return (
    <div className="tool_bar">
      <div className="tool_bar_left">
        {renderSortItems()}
        {isMro && (
          <Checkbox
            checked={checkPrice}
            onChange={(e) => {
              setCheckPrice(e.target.checked)
            }}
          >
            {translate('web.resource.mall.spotCommodity')}
          </Checkbox>
        )}
      </div>
      <div className="tool_bar_right">
        <div className="count">{renderCount()}</div>
        {showSwitchTypeButton && (
          <div className="showTypeBox">
            <AppstoreOutlined
              className={cx('icon', showType === COMMODITY_SHOW_TYPE.gird ? 'active' : '')}
              onClick={() => setShowType(COMMODITY_SHOW_TYPE.gird)}
            />
          </div>
        )}
        {showSwitchTypeButton && (
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
