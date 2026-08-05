import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LAYOUT_TYPE } from '@/types/global'
import CommonlyUsed from './CommonlyUsed'
import Category from './Category'
import Brand from './Brand'
import PriceRange from './PriceRange'
import PointRange from './PointRange'
import ActiveStores from './ActiveStores'
import NewJoin from './NewJoin'
import CarriageType from './CarriageType'
import TimeRange from './TimeRange'
import SourceType from './SourceType'
import PorjectKeyword from './PorjectKeyword'
import ActivePurchase from './ActivePurchase'
import NewJoinPurchase from './NewJoinPurchase'
import { AttributeType, FILTER_PARAM, FILTER_PARAM_KEY, FILTER_TYPE } from './types'
import './index.less'

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
  layoutType?: LAYOUT_TYPE
  filter?: string
  filterParam?: FILTER_PARAM
  filterConfig: filterConfigItemType[]
  onFilter?: (values: FILTER_PARAM | undefined) => void
}

const CommonFilter: React.FC<CommonFilterProps> = (props) => {
  const { style, filterParam, filterConfig, onFilter } = props
  const [innerValue, setInnerValue] = useState<FILTER_PARAM>()
  const { pathname, search } = useLocation()

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

  const renderFilterItem = () => {
    if (filterConfig && filterConfig.length > 0) {
      const mergeProps = { ...props, pathname, search }
      return filterConfig.map((filterItem) => {
        switch (filterItem.type) {
          // 常用筛选
          case FILTER_TYPE.commonlyUsed:
            return (
              <CommonlyUsed
                key={filterItem.type}
                source={filterItem.source}
                onClick={filterItem.onClick}
                onDelete={filterItem.onDelete}
                {...mergeProps}
              />
            )
          // 品类
          case FILTER_TYPE.category:
            return <Category key={filterItem.type} innerValue={innerValue} source={filterItem.source} {...mergeProps} />
          case FILTER_TYPE.categoryAndAttr:
            return (
              <Category
                key={filterItem.type}
                innerValue={innerValue}
                source={filterItem.source}
                showAttrFilter
                attributeList={filterItem.attributeList}
                {...mergeProps}
              />
            )
          // 品牌
          case FILTER_TYPE.brand:
            return <Brand key={filterItem.type} innerValue={innerValue} source={filterItem.source} {...mergeProps} />
          // 价格
          case FILTER_TYPE.price:
            return <PriceRange key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          // 积分
          case FILTER_TYPE.points:
            return <PointRange key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          case FILTER_TYPE.activeStores:
            return <ActiveStores key={filterItem.type} source={filterItem.source} {...mergeProps} />
          case FILTER_TYPE.newJoin:
            return <NewJoin key={filterItem.type} source={filterItem.source} {...mergeProps} />
          case FILTER_TYPE.carriageType:
            return <CarriageType key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          case FILTER_TYPE.publicTimeSort:
            return <TimeRange key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          case FILTER_TYPE.sourceType:
            return <SourceType key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          case FILTER_TYPE.projectKeyword:
            return <PorjectKeyword key={filterItem.type} innerValue={innerValue} {...mergeProps} />
          case FILTER_TYPE.activePurchase:
            return <ActivePurchase key={filterItem.type} source={filterItem.source} {...mergeProps} />
          case FILTER_TYPE.newJoinPurchase:
            return <NewJoinPurchase key={filterItem.type} source={filterItem.source} {...mergeProps} />
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
    <div className="filter" style={style}>
      {renderFilterItem()}
    </div>
  )
}

export default CommonFilter
