import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { CloseOutlined } from '@ant-design/icons'
import styles from './index.less'
import { AttributeType, FILTER_PARAM, FILTER_TYPE, FilterValueType } from '../CommonFilter/types'
import { CategoryItemType } from '../CommonFilter/Category'

interface FilterBarProps {
  filterList: FilterValueType[]
  categoryList?: CategoryItemType[]
  attributeList?: AttributeType[]
  onFilterChange?: (values: FILTER_PARAM | undefined) => void
}

const FilterBar: React.FC<FilterBarProps> = (props) => {
  const { filterList, onFilterChange } = props
  const intl = useIntl()

  const formatFilterParam = (newFilterList: FilterValueType[]) => {
    const tempFilterParam: any = {}
    for (const filterItem of newFilterList) {
      switch (filterItem.type) {
        case FILTER_TYPE.keyword:
          tempFilterParam.name = filterItem.key
          break
        case FILTER_TYPE.shopKeyword:
          tempFilterParam.memberName = filterItem.key
          break
        case FILTER_TYPE.category:
          tempFilterParam.categoryId = filterItem.key
          tempFilterParam.categoryKey = filterItem.filter
          break
        case FILTER_TYPE.customerCategory:
          tempFilterParam.customerCategoryId = Number(filterItem.key)
          tempFilterParam.categoryKey = filterItem.filter
          break
        case FILTER_TYPE.commodityType:
          tempFilterParam.priceTypeList = [filterItem.key]
          break
        case FILTER_TYPE.carriageType:
          tempFilterParam.carriageType = filterItem.key
          break
        case FILTER_TYPE.minPoints:
        case FILTER_TYPE.minPrice:
          tempFilterParam.min = filterItem.key
          break
        case FILTER_TYPE.maxPoints:
        case FILTER_TYPE.maxPrice:
          tempFilterParam.max = filterItem.key
          break
        case FILTER_TYPE.brand:
          tempFilterParam.brandId = filterItem.key
          break
        case FILTER_TYPE.province:
          tempFilterParam.provinceCode = filterItem.key
          break
        case FILTER_TYPE.city:
          tempFilterParam.cityCode = filterItem.key
          break
        case FILTER_TYPE.sort:
          switch (filterItem.key) {
            case 'soldSort':
              tempFilterParam.orderType = 1
              break
            case 'creditSort':
              tempFilterParam.orderType = 2
              break
            case 'priceSortHighToLow':
              tempFilterParam.orderType = 3
              break
            case 'priceSortLowToHigh':
              tempFilterParam.orderType = 4
              break
          }
          break
        case FILTER_TYPE.soldSort:
          tempFilterParam.orderType = 1
          break
        case FILTER_TYPE.creditSort:
          tempFilterParam.orderType = 2
          break
        case FILTER_TYPE.priceSortHighToLow:
          tempFilterParam.orderType = 3
          break
        case FILTER_TYPE.priceSortLowToHigh:
          tempFilterParam.orderType = 4
          break
        case FILTER_TYPE.attribute:
          // let attributeList = filterItem.key
          // attributeList = changeAttributeDate(attributeList)
          tempFilterParam.customerAttributeList = filterItem.key
          break
        case FILTER_TYPE.shopArea:
          tempFilterParam.areaCode = filterItem.key
          break
        case FILTER_TYPE.creditSortLowToHigh:
          tempFilterParam.sortCredit = 1
          break
        case FILTER_TYPE.creditSortHighToLow:
          tempFilterParam.sortCredit = 2
          break
        case FILTER_TYPE.shopCreditSortLowToHigh:
          tempFilterParam.sortCreditPoint = 'ASC'
          break
        case FILTER_TYPE.shopCreditSortHighToLow:
          tempFilterParam.sortCreditPoint = 'DESC'
          break
        case FILTER_TYPE.dateSortLowToHigh:
          tempFilterParam.sortTime = 1
          break
        case FILTER_TYPE.dateSortHighToLow:
          tempFilterParam.sortTime = 2
          break
        case FILTER_TYPE.categoryName:
          tempFilterParam.category = filterItem.key
          break
        default:
          break
      }
    }

    if (Object.keys(tempFilterParam).length > 0) {
      onFilterChange && onFilterChange(tempFilterParam)
    } else {
      onFilterChange && onFilterChange(undefined)
    }
  }

  const handleDeleteFilterItem = (filterItem: FilterValueType) => {
    let tempFilter = filterList.filter((item) => item.type !== filterItem.type)
    // 如果删除的是品类，则需要判断是否还有属性的筛选，如果有则删除
    if (
      (filterItem.type === FILTER_TYPE.category || filterItem.type === FILTER_TYPE.customerCategory) &&
      filterList.some((item) => item.type === FILTER_TYPE.attribute)
    ) {
      tempFilter = tempFilter.filter((item) => item.type !== FILTER_TYPE.attribute)
    }
    formatFilterParam(tempFilter)
  }

  const handleResetFilter = () => {
    onFilterChange && onFilterChange(undefined)
  }

  return filterList && filterList.length > 0 ? (
    <div className={styles.filter_bar}>
      <div className={styles.filter_bar_list}>
        {filterList.map(
          (item, index) =>
            item.title && (
              <div className={styles.filter_bar_list_item} key={`filter_bar_list_item_${index}`}>
                <span className={styles.filter_bar_list_item_text}>{item.title}</span>
                <div className={styles.filter_bar_close_box}>
                  <CloseOutlined
                    translate={undefined}
                    className={styles.filter_bar_list_item_icon}
                    onClick={() => handleDeleteFilterItem(item)}
                  />
                </div>
              </div>
            ),
        )}
        {filterList.length > 0 && (
          <div className={styles.filter_bar_left}>
            <div className={styles.filter_bar_left_text} onClick={handleResetFilter}>
              {intl.formatMessage({ id: 'agentOrder.text.reset', defaultMessage: '重置' })}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null
}

export default FilterBar
