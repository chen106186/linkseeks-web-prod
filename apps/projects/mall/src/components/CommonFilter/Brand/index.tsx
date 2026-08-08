import React from 'react'
import ImageBox from '@apps/components/src/web/ImageBox'
import { getWebIntl } from '@/utils/locales'
import FilterBox from '../FilterBox'
import { FILTER_PARAM } from '../types'
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
  filter?: string
  pathname?: string
  search?: string
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FILTER_PARAM) => void
}

const Brand: React.FC<BrandProps> = (props) => {
  const { innerValue, source: brandList, filter, pathname, search, onChange } = props
  const translate = getWebIntl()

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

  const handleLink = (e: any, path: string) => {
    e.preventDefault()
    window.location.href = path
  }

  return brandList && brandList.length > 0 ? (
    <FilterBox title={translate('web.resource.mall.brand')}>
      <div className="filter_brand">
        <ul className="filter_brand_list">
          {brandList.map((item) => (
            <li className="filter_brand_list_item" title={item.name} key={item.id}>
              <a
                href={getLink(item)}
                title={item.name}
                className="brand_img"
                onClick={(e) => handleLink(e, getLink(item))}
              >
                <ImageBox width={80} height={40} src={item.logoUrl} alt={item.name} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </FilterBox>
  ) : null
}

export default Brand
