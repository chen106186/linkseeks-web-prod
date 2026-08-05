/*
 * @Author: GHua
 * @Date: 2022-03-25 14:20:25
 * @LastEditTime: 2022-03-31 16:44:14
 * @LastEditors: GHua
 * @Description: 商品筛选组件
 */
import React, { useState } from 'react'
import Category from './Category'
import { AttributeType, FILTER_PARAM, FILTER_PARAM_KEY, FILTER_SEARCH_TYPE, FILTER_TYPE } from './types'
import { isEmpty } from 'lodash'
import styles from './index.less'
import { useEffect } from 'react'
import { useLocation, useQuery } from '@linkseeks/router-core'
import { LAYOUT_TYPE } from '@/constants'

interface filterConfigItemType {
  /** 筛选类型 */
  type: FILTER_TYPE
  /** 筛选数据源 */
  source?: any
  attributeList?: AttributeType[]
  onDelete?: (id: number) => void
  onClick?: (values: any) => void
}

interface CommonFilterProps {
  style?: React.CSSProperties
  /** 筛选类型 url: 通过链接跳转； silence：无跳转，通过改变参数筛选  */
  filterType?: FILTER_SEARCH_TYPE
  layoutType?: LAYOUT_TYPE
  filter?: string
  filterParam?: FILTER_PARAM
  filterConfig: filterConfigItemType[]
  onFilter?: (values: FILTER_PARAM | undefined) => void
}

interface ItemsProps {
  Category: typeof Category
}

const CommonFilter: React.FC<CommonFilterProps> & ItemsProps = (props) => {
  const { style, filterParam, filterConfig, filterType, onFilter } = props
  const [innerValue, setInnerValue] = useState<FILTER_PARAM>()
  const search = useQuery()
  const { pathname } = useLocation()

  useEffect(() => {
    if (filterParam) {
      setInnerValue(filterParam)
    } else {
      setInnerValue(undefined)
    }
  }, [filterParam])

  const formatParam = (param: FILTER_PARAM | undefined) => {
    if (!param) return param
    const newParam: FILTER_PARAM = {}
    Object.keys(param).forEach((key) => {
      const item = param[key as FILTER_PARAM_KEY]
      if (item !== undefined) {
        if (Array.isArray(item)) {
          if (item.length > 0) {
            newParam[key as FILTER_PARAM_KEY] = item
          }
        } else {
          newParam[key as FILTER_PARAM_KEY] = item
        }
      }
    })
    return newParam as FILTER_PARAM
  }

  const handleChange = (values: FILTER_PARAM) => {
    if (filterType === 'silence' && onFilter) {
      onFilter(formatParam(values))
    }
  }

  const renderFilterItem = () => {
    if (!isEmpty(filterConfig)) {
      const mergeProps = { ...props, pathname, search }
      return filterConfig.map((filterItem) => {
        switch (filterItem.type) {
          // 品类
          case FILTER_TYPE.category:
            return (
              <Category
                key={filterItem.type}
                innerValue={innerValue}
                source={filterItem.source}
                onChange={handleChange}
                {...mergeProps}
              />
            )
          case FILTER_TYPE.categoryAndAttr:
            return (
              <Category
                key={filterItem.type}
                innerValue={innerValue}
                source={filterItem.source}
                onChange={handleChange}
                showAttrFilter
                attributeList={filterItem.attributeList}
                {...mergeProps}
              />
            )
          case FILTER_TYPE.nullFilter:
            return null
          default:
            break
        }
      })
    } else {
      return null
    }
  }

  return (
    <div className={styles.filter} style={style}>
      {renderFilterItem()}
    </div>
  )
}

CommonFilter.Category = Category

CommonFilter.defaultProps = {
  filterType: FILTER_SEARCH_TYPE.url,
}

export default CommonFilter
