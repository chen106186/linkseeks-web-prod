/*
 * @Author: GHua
 * @Date: 2022-03-25 16:27:39
 * @LastEditTime: 2022-04-11 10:51:49
 * @LastEditors: GHua
 * @Description:
 */
import { useState } from 'react'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useIntl } from '@linkseeks/i18n'
import { useQuery } from '@linkseeks/router-core'
import { CategoryItemType } from '../components/CommonFilter/Category'
import { BrandItemType } from '../components/CommonFilter/Brand'
import {
  AttributeType,
  FILTER_PARAM,
  FILTER_PARAM_KEY,
  FILTER_SEARCH_TYPE,
  FILTER_TYPE,
  FilterValueType,
} from '../components/CommonFilter/types'
import { LAYOUT_TYPE } from '@/constants'

interface UseFilterParamsProps {
  filterType?: 'url' | 'silence'
  filter?: string
  pathname?: string
  search?: string
  categoryList?: CategoryItemType[]
  brandList?: BrandItemType[]
  attributeList?: AttributeType[]
  mroCategoryTree?: any[]
  layoutType: LAYOUT_TYPE
}

interface UseFilterParamsReturn {
  filterParam: FILTER_PARAM | undefined
  filterList: FilterValueType[]
  dispatchFilterParam: (values: FILTER_PARAM | undefined) => void
  dispatchFilterList: (values: FilterValueType[]) => void
}

const useFilterParams = (props: UseFilterParamsProps): UseFilterParamsReturn => {
  const { filterType, categoryList = [], brandList = [], attributeList = [], layoutType } = props
  const [filterParam, setFilterParam] = useState<FILTER_PARAM>()
  const [filterList, setFilterList] = useState<FilterValueType[]>([])
  const { carriageType } = useQuery()
  const intl = useIntl()

  const getCategoryInfoByList = (key: string, list: CategoryItemType[]) => {
    let value: any = null

    const recurision = (list: CategoryItemType[], key: string) => {
      if (!list) return null
      for (let i = 0; i < list.length; i++) {
        if (filterType === FILTER_SEARCH_TYPE.url) {
          if (list[i].key === key) {
            value = list[i]
            break
          }
        } else {
          if (Number(list[i].id) === Number(key)) {
            value = list[i]
            break
          }
        }

        if (list[i].children) {
          recurision(list[i].children || [], key)
        }
      }
      return value
    }

    let ret = recurision(list, key)
    return ret
  }

  const getBrandInfoByList = (id: number, list: BrandItemType[]) => {
    if (!list) return null
    let value: any = null
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        value = list[i]
        break
      }
    }
    return value
  }

  const getSoleTypeByNumber = (type: number): { sortName: string; sortType: string } => {
    switch (type) {
      case 1:
        return {
          sortName: intl.formatMessage({ id: 'commodity.index.SalesHighLow' }),
          sortType: 'soldSort',
        }
      case 2:
        return {
          sortName: intl.formatMessage({ id: 'pay.purchaseOnline.highToLow' }),
          sortType: 'creditSort',
        }
      case 3:
        return {
          sortName: intl.formatMessage({ id: 'pay.pointsMall.highToLow' }),
          sortType: 'priceSortHighToLow',
        }
      case 4:
        return {
          sortName: intl.formatMessage({ id: 'pay.pointsMall.lowToHigh' }),
          sortType: 'priceSortLowToHigh',
        }
      default:
        return {
          sortName: '',
          sortType: '',
        }
    }
  }

  const getDetailById = (attrId: any, attrValId: any, state = 2) => {
    if (attributeList && attributeList.length > 0) {
      let detail = {}
      for (const item of attributeList) {
        if (item.id === Number(attrId)) {
          if (state === 1) {
            detail = item
            break
          } else {
            for (const childItem of item.attributeValueList) {
              if (childItem.id === Number(attrValId)) {
                detail = childItem
              }
            }
          }
        }
      }
      return detail
    } else {
      return null
    }
  }

  useEffect(() => {
    if (carriageType) {
      setFilterParam({
        ...filterParam,
        carriageType,
      })
    }
  }, [carriageType])

  useEffect(() => {
    if (filterType === FILTER_SEARCH_TYPE.silence) {
      let hasLastCategory = false
      if (filterParam && !isEmpty(filterParam)) {
        const tempFilterList: FilterValueType[] = []
        Object.keys(filterParam).forEach((filterKey) => {
          const filterItem = filterParam[filterKey as FILTER_PARAM_KEY]
          switch (filterKey) {
            case FILTER_PARAM_KEY.categoryId:
            case FILTER_PARAM_KEY.customerCategoryId:
              if (categoryList) {
                const categoryInfo = getCategoryInfoByList(filterItem, categoryList)
                console.log(categoryInfo, 'categoryInfo')
                if (categoryInfo) {
                  hasLastCategory = categoryInfo.children === undefined
                  const title =
                    categoryInfo.treeName && typeof categoryInfo.treeName === 'string'
                      ? categoryInfo.treeName.split(' ').join(' > ')
                      : ''
                  if (layoutType === LAYOUT_TYPE.mall || layoutType === LAYOUT_TYPE.shopList) {
                    tempFilterList.push({
                      type: FILTER_TYPE.category,
                      title: title,
                      filter: categoryInfo.key,
                      key: categoryInfo.id,
                      isLast: hasLastCategory,
                    })
                  } else {
                    tempFilterList.push({
                      type: FILTER_TYPE.customerCategory,
                      title: title,
                      filter: categoryInfo.key,
                      key: categoryInfo.id,
                      isLast: hasLastCategory,
                    })
                  }
                }
              }
              break
            case FILTER_PARAM_KEY.customerAttributeList:
              if (attributeList) {
                tempFilterList.push({
                  type: FILTER_TYPE.attribute,
                  key: filterItem,
                  title: `${filterItem
                    .map((tsItem: any) => {
                      return `${tsItem.customerAttributeName}：${tsItem.customerAttributeValueList.map(
                        (cabItem: { name: any }) => cabItem.name,
                      )}`
                    })
                    .join('；')}`,
                })
              }
            case FILTER_PARAM_KEY.brandId:
              if (brandList) {
                const brandInfo = getBrandInfoByList(Number(filterItem), brandList)
                brandInfo &&
                  tempFilterList.push({
                    type: FILTER_TYPE.brand,
                    title: brandInfo.name,
                    key: brandInfo.id,
                  })
              }
              break
            case FILTER_PARAM_KEY.min:
              tempFilterList.push({
                type: FILTER_TYPE.minPrice,
                title: (
                  <span className="price_text">
                    {intl.formatMessage({ id: 'filterBar.index.minimum' })} {intl.formatMessage({ id: 'common.money' })}
                    {filterItem}
                  </span>
                ),
                key: filterItem,
              })
              break
            case FILTER_PARAM_KEY.max:
              tempFilterList.push({
                type: FILTER_TYPE.maxPrice,
                title: (
                  <span className="price_text">
                    {intl.formatMessage({ id: 'filterBar.index.highest' })} {intl.formatMessage({ id: 'common.money' })}
                    {filterItem}
                  </span>
                ),
                key: filterItem,
              })
              break
            case FILTER_PARAM_KEY.carriageType:
              tempFilterList.push({
                type: FILTER_TYPE.carriageType,
                key: filterItem,
                title:
                  String(filterItem) === '1'
                    ? intl.formatMessage({ id: 'filter.index.carriageType_1' })
                    : intl.formatMessage({ id: 'filter.index.carriageType_2' }),
              })
              break
            case FILTER_PARAM_KEY.orderType:
              tempFilterList.push({
                type: FILTER_TYPE.sort,
                title: getSoleTypeByNumber(Number(filterItem)).sortName,
                key: getSoleTypeByNumber(Number(filterItem)).sortType,
              })
              break
            case FILTER_PARAM_KEY.name:
              tempFilterList.push({
                type: FILTER_TYPE.keyword,
                title: decodeURIComponent(filterItem),
                key: decodeURIComponent(filterItem),
              })
              break
            case FILTER_PARAM_KEY.memberName:
              tempFilterList.push({
                type: FILTER_TYPE.shopKeyword,
                title: decodeURIComponent(filterItem),
                key: decodeURIComponent(filterItem),
              })
              break
            default:
              break
          }
        })
        setFilterList(tempFilterList)
      } else {
        setFilterList([])
      }
    }
  }, [filterParam])

  const dispatchFilterParam = (values: FILTER_PARAM | undefined) => {
    setFilterParam(values)
  }

  const dispatchFilterList = (values: FilterValueType[]) => {
    setFilterList(values)
  }

  return {
    filterParam,
    filterList,
    dispatchFilterParam,
    dispatchFilterList,
  }
}

export default useFilterParams
