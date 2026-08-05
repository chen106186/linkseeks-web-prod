/*
 * @Author: GHua
 * @Date: 2022-03-25 20:06:04
 * @LastEditTime: 2022-04-07 09:39:38
 * @LastEditors: GHua
 * @Description:
 */
import React from 'react'
import { ImageBox } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import FilterBox from '../FilterBox'
import { FILTER_PARAM, FILTER_SEARCH_TYPE } from '../types'
import './index.less'

export interface BrandItemType {
  id: number
  /**
   * 品牌名称
   */
  name: string
  /**
   * 品牌logo
   */
  logoUrl: string
}

interface BrandProps {
  innerValue: FILTER_PARAM | undefined
  source: BrandItemType[]
  filterType?: FILTER_SEARCH_TYPE
  filter?: string
  pathname?: string
  search?: string
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FILTER_PARAM) => void
}

const Brand: React.FC<BrandProps> = (props) => {
  const { innerValue, source: brandList, filterType, filter, pathname, search, onChange } = props
  const intl = useIntl()

  const getLink = (item: BrandItemType) => {
    if (pathname) {
      let resultUrl = ''
      if (filter) {
        if (filter.indexOf('b') > -1) {
          const newPathname = `${pathname}`
          resultUrl = newPathname.replace(/b\d*/, `b${item.id}`)
        } else {
          resultUrl = `${pathname}_b${item.id}`
        }
      } else {
        resultUrl = `${pathname}/b${item.id}`
      }
      return `${resultUrl}${search}`
    }
    return '#!'
  }

  const handleLink = (e: any, path: string, item: BrandItemType) => {
    e.preventDefault()
    if (filterType === FILTER_SEARCH_TYPE.url) {
      window.location.href = path
    } else {
      onChange &&
        onChange({
          ...innerValue,
          brandId: item.id,
        })
    }
  }

  return brandList && brandList.length > 0 ? (
    <FilterBox title={intl.formatMessage({ id: 'filter.brand.title' })}>
      <div className="filter_brand">
        <ul className="filter_brand_list">
          {brandList.map((item) => (
            <li className="filter_brand_list_item" title={item.name} key={item.id}>
              <a
                href={getLink(item)}
                title={item.name}
                className="brand_img"
                onClick={(e) => handleLink(e, getLink(item), item)}
              >
                <ImageBox width={80} height={40} src={item.logoUrl} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </FilterBox>
  ) : null
}

export default Brand
