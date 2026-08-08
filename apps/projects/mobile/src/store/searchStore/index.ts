import { makeObservable, observable, action, runInAction } from 'mobx'
import {
  SearchStoreModel,
  SearchHistoryItemType,
  FilterParamType,
  FilterItemType,
  FILTER_TYPE,
  FILTER_CONFIG_TYPE,
} from './model'
import { RootStoreModel } from '../rootStore/model'
import { getAsyncStorage, setAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { priceFormat } from '@/utils/numberFormat'
import { LAYOUT_TYPE } from '@/constants/const/shop'

const getPrice = (list: FilterItemType[], type: FILTER_TYPE): number => {
  if (!list) return 0
  let result = 0
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].type === type) {
      result = Number(list[i].key)
      break
    }
  }
  return result
}

export default class SearchStore implements SearchStoreModel {
  private rootStore: RootStoreModel

  searchKeyword: string = ''

  searchHistory: SearchHistoryItemType[] = []

  channelSearchHistory: SearchHistoryItemType[] = []

  filterParams: FilterParamType = {}

  prevFilterParams: FilterParamType | undefined = undefined

  filterList: FilterItemType[] = []

  filterUpdate: boolean = false

  filterParamUpdate: boolean = false

  filterConfig: FILTER_CONFIG_TYPE[] = []

  tempFilterList: FilterItemType[] = []

  listType: string = 'commodity'

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      searchKeyword: observable,
      searchHistory: observable,
      channelSearchHistory: observable,
      filterParams: observable,
      prevFilterParams: observable,
      filterList: observable,
      filterUpdate: observable,
      filterParamUpdate: observable,
      filterConfig: observable,
      tempFilterList: observable,
      listType: observable,
      changeSearchKeyword: action.bound,
      initSearchHistoryByStorage: action.bound,
      clearSearchHistory: action.bound,
      onFilter: action.bound,
      onFilterParamChange: action.bound,
      updateFilterConfig: action.bound,
      onTempFilter: action.bound,
      updateTempFilter: action.bound,
      updateFilter: action.bound,
      uploadListType: action.bound,
      updatePrevFilterParams: action.bound,
      updateFilterParams: action.bound,
    })
    this.rootStore = rootStore
  }

  updatePrevFilterParams(params: FilterParamType) {
    this.prevFilterParams = params
    this.filterParamUpdate = false
  }

  uploadListType(type: string) {
    this.listType = type
  }

  updateFilterConfig(configList: FILTER_CONFIG_TYPE[]) {
    this.filterConfig = configList
  }

  /**
   * 初始化搜索历史数据
   */
  async initSearchHistoryByStorage(type: LAYOUT_TYPE) {
    const history = (await getAsyncStorage(type)) || []
    runInAction(() => {
      this.searchHistory = history
    })
  }

  /**
   * 新增搜索历史
   * @param keyword
   */
  changeSearchKeyword(keyword: string, type: LAYOUT_TYPE, save: boolean = true) {
    if (keyword) {
      const searchKeyword = keyword.trim()
      if (save) {
        if (this.searchHistory.some((item) => item.name === searchKeyword)) {
          return
        }
        const newSearchHistory: SearchHistoryItemType = {
          name: searchKeyword,
          time: new Date().getTime(),
        }

        this.searchHistory = [newSearchHistory, ...this.searchHistory]

        setAsyncStorage(type, this.searchHistory)
      }
    }
  }

  /**
   * 删除搜索历史
   */
  clearSearchHistory(type: LAYOUT_TYPE) {
    removeAsyncStorage(type)
    this.searchHistory = []
  }

  /**
   * 临时筛选
   * @param filterValue 筛选项
   * @param multiple 是否多选
   */
  onTempFilter(filterValue: FilterItemType, multiple: boolean = false) {
    const filteState = this.tempFilterList.some((item) => item.type === filterValue.type)
    let tempFilterList = [...this.tempFilterList]
    if (filteState) {
      if (!multiple) {
        // 单选
        const isExistKey = this.tempFilterList.some(
          (item) => item.type === filterValue.type && item.key === filterValue.key,
        )
        if (isExistKey) {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key !== filterValue.key
            }
            return true
          })
        } else if (!filterValue.key) {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key === filterValue.key
            }
            return true
          })
        } else {
          tempFilterList = tempFilterList.map((item) => {
            if (item.type === filterValue.type) {
              return filterValue
            }
            return item
          })
        }
      } else {
        // 多选
        const isExistKey = this.tempFilterList.some(
          (item) => item.type === filterValue.type && item.key === filterValue.key,
        )
        if (!isExistKey) {
          tempFilterList = [...tempFilterList, filterValue]
        } else {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key !== filterValue.key
            }
            return true
          })
        }
      }
    } else {
      tempFilterList = [...tempFilterList, filterValue]
    }
    this.tempFilterList = tempFilterList
  }

  updateTempFilter(newFilterList: FilterItemType[]) {
    this.tempFilterList = newFilterList
  }

  updateFilter(newFilterList: FilterItemType[]) {
    this.filterUpdate = true
    let list = [...newFilterList]
    // 如果筛选条件中有最小和最大值，则比较两个的大小。
    if (
      list.some((item) => item.type === FILTER_TYPE.minPrice) ||
      list.some((item) => item.type === FILTER_TYPE.maxPrice)
    ) {
      const minPrice = getPrice(list, FILTER_TYPE.minPrice)
      const maxPrice = getPrice(list, FILTER_TYPE.maxPrice)
      // 如果最大价格小于最小价格，则调换两个
      if (maxPrice !== 0 && maxPrice < minPrice) {
        list = list.map((item) => {
          const newItem = { ...item }
          if (newItem.type === FILTER_TYPE.minPrice) {
            newItem.title = String(priceFormat(maxPrice))
            newItem.key = priceFormat(maxPrice)
          }
          if (newItem.type === FILTER_TYPE.maxPrice) {
            newItem.title = String(priceFormat(minPrice))
            newItem.key = priceFormat(minPrice)
          }
          return newItem
        })
      } else {
        list = list.map((item) => {
          const newItem = { ...item }
          if (newItem.type === FILTER_TYPE.minPrice || newItem.type === FILTER_TYPE.maxPrice) {
            newItem.title = String(priceFormat(newItem.title))
            newItem.key = priceFormat(newItem.key)
          }
          return newItem
        })
      }
    }
    this.filterList = list
    // this.filterParams = {}
  }

  updateFilterParams() {
    this.filterParams = {}
  }

  onFilter(filterValue: FilterItemType, multiple: boolean = true) {
    const filteState = this.filterList.some((item) => item.type === filterValue.type)
    let tempFilterList = [...this.filterList]

    if (filteState) {
      if (!multiple) {
        // 单选
        const isExistKey = this.filterList.some(
          (item) => item.type === filterValue.type && item.key === filterValue.key,
        )
        if (isExistKey) {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key !== filterValue.key
            }
            return true
          })
        } else if (!filterValue.key) {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key === filterValue.key
            }
            return true
          })
        } else {
          tempFilterList = tempFilterList.map((item) => {
            if (item.type === filterValue.type) {
              return filterValue
            }
            return item
          })
        }
      } else {
        // 多选
        const isExistKey = this.filterList.some(
          (item) => item.type === filterValue.type && item.key === filterValue.key,
        )
        if (!isExistKey) {
          tempFilterList = [...tempFilterList, filterValue]
        } else {
          tempFilterList = tempFilterList.filter((item) => {
            if (item.type === filterValue.type) {
              return item.key !== filterValue.key
            }
            return true
          })
        }
      }
    } else {
      tempFilterList = [...tempFilterList, filterValue]
    }

    this.filterUpdate = true
    this.filterList = tempFilterList
    this.updateTempFilter(tempFilterList)
  }

  onFilterParamChange(newFilterList: FilterItemType[]) {
    const tempFilterParam: FilterParamType = {}
    newFilterList.forEach((filterItem) => {
      switch (filterItem.type) {
        case FILTER_TYPE.category:
          if (Number(filterItem.key)) {
            tempFilterParam.categoryId = Number(filterItem.key)
          }
          break
        case FILTER_TYPE.customerCategory:
          if (Number(filterItem.key)) {
            tempFilterParam.customerCategoryId = Number(filterItem.key)
          }
          break
        case FILTER_TYPE.commodityType:
          tempFilterParam.priceTypeList = [filterItem.key]
          break
        // case FILTER_TYPE.minPoints:
        case FILTER_TYPE.minPrice:
          if (filterItem.key) {
            tempFilterParam.min = Number(filterItem.key)
          }
          break
        // case FILTER_TYPE.maxPoints:
        case FILTER_TYPE.maxPrice:
          if (filterItem.key) {
            tempFilterParam.max = Number(filterItem.key)
          }
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
            default:
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
        case FILTER_TYPE.shopCreditSort:
          tempFilterParam.sortCreditPoint = 'DESC'
          break
        // case FILTER_TYPE.attribute:
        //   let attributeList = filterItem.key
        //   attributeList = changeAttributeDate(attributeList)
        //   tempFilterParam.customerAttributeList = attributeList
        //   break
        case FILTER_TYPE.shopArea:
          tempFilterParam.areaCode = filterItem.key
          break
        // case FILTER_TYPE.creditSortLowToHigh:
        //   tempFilterParam.sortCredit = 1
        //   break
        // case FILTER_TYPE.creditSortHighToLow:
        //   tempFilterParam.sortCredit = 2
        //   break
        // case FILTER_TYPE.shopCreditSortLowToHigh:
        //   tempFilterParam.sortCreditPoint = 'ASC'
        //   break
        // case FILTER_TYPE.shopCreditSortHighToLow:
        //   tempFilterParam.sortCreditPoint = 'DESC'
        //   break
        // case FILTER_TYPE.dateSortLowToHigh:
        //   tempFilterParam.sortTime = 1
        //   break
        // case FILTER_TYPE.dateSortHighToLow:
        //   tempFilterParam.sortTime = 2
        //   break
        // case FILTER_TYPE.categoryName:
        //   tempFilterParam.category = filterItem.key
        //   break
        default:
          break
      }
    })

    if (JSON.stringify(this.filterParams) === JSON.stringify(tempFilterParam)) {
      return
    }
    this.filterUpdate = false
    this.filterParamUpdate = true
    this.filterParams = tempFilterParam
  }
}
