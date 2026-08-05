import { useEffect, useState } from 'react'
import {
  getProductShopSelfGetBrand,
  getProductShopSelfGetCustomerCategoryTree,
  getProductShopStoreGetBrand,
  getProductShopStoreGetCustomerCategoryTree,
} from '@apps/apis'
import { authService } from '@apps/services'
import { LAYOUT_TYPE } from '@/constants'
import { CategoryItemType } from '../components/CommonFilter/Category'
import { BrandItemType } from '../components/CommonFilter/Brand'
import { FILTER_TYPE } from '../components/CommonFilter/types'

interface UseFilterProps {
  filterTypeList: FILTER_TYPE[]
  mallId: number
  storeId?: number
  layoutType: LAYOUT_TYPE
  initCategoryList?: CategoryItemType[]
  initBrandList?: BrandItemType[]
}

export const initCategoryData = (list: any, parentKey?: string, parentName?: string) => {
  if (!list) {
    return []
  }
  const result: any = list.map((item: any) => {
    let cid = `c${item.id}`
    let treeName = item.name
    if (parentKey) {
      cid = `${parentKey}_${cid}`
      treeName = `${parentName} ${treeName}`
    }

    const newItem: CategoryItemType = {
      title: item.name,
      name: item.name,
      treeName: treeName,
      key: cid,
      id: item.id,
      brandList: item.brandList,
      categoryId: item?.categoryId,
    }
    if (item.children && item.children.length > 0) {
      newItem.children = initCategoryData(item.children, cid, treeName)
    }
    return newItem
  })
  return result
}

const useFilter = (props: UseFilterProps) => {
  const { filterTypeList = [], initCategoryList = [], initBrandList = [], layoutType, mallId, storeId } = props
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>([])
  const [brandList, setBrandList] = useState<BrandItemType[]>(initBrandList)
  const [filterLoading, setFilterLoading] = useState<boolean>(true)
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true)
  const [brandLoading, setBrandLoading] = useState<boolean>(true)
  const userInfo = authService.getAuth()
  /**
   * 获取品类数据
   */
  const fetchCategoryList = async () => {
    let getFn
    const param: any = {}
    const headers = {
      shopId: mallId,
    }
    /**
     * 根据不通过的页面类型，请求不同的品类接口
     */
    switch (layoutType) {
      case LAYOUT_TYPE.mall:
        param.storeId = storeId
        getFn = getProductShopStoreGetCustomerCategoryTree
        break
      case LAYOUT_TYPE.own:
        param.memberId = userInfo.memberId
        getFn = getProductShopSelfGetCustomerCategoryTree
        break
      default:
        break
    }
    if (getFn) {
      const res = await getFn(param, { headers } as any)
      if (res.code === 1000 && res.data) {
        const list = initCategoryData(res.data)
        setCategoryList(list)
      }
    }
    setCategoryLoading(false)
  }

  /**
   * 获取品牌数据
   */
  const fetchBrandList = async () => {
    let getFn
    const param: any = {}
    const headers = {
      shopId: mallId,
    }
    /**
     * 根据不通过的页面类型，请求不同的品类接口
     */
    switch (layoutType) {
      case LAYOUT_TYPE.mall:
        param.storeId = storeId
        getFn = getProductShopStoreGetBrand
        break
      case LAYOUT_TYPE.own:
        param.memberId = userInfo.memberId
        getFn = getProductShopSelfGetBrand
        break
      default:
        break
    }
    if (getFn) {
      const res = await getFn(param, { headers } as any)
      if (res.code === 1000 && res.data) {
        setBrandList(res.data)
      }
    }
    setBrandLoading(false)
  }

  useEffect(() => {
    if (
      filterTypeList.includes(FILTER_TYPE.category) &&
      (!initCategoryList || (initCategoryList && initCategoryList.length === 0))
    ) {
      fetchCategoryList()
    }
    if (
      filterTypeList.includes(FILTER_TYPE.brand) &&
      (!initBrandList || (initBrandList && initBrandList.length === 0))
    ) {
      fetchBrandList()
    }
  }, [])

  useEffect(() => {
    if (!categoryLoading && (filterTypeList.includes(FILTER_TYPE.brand) ? !brandLoading : true)) {
      setFilterLoading(false)
    }
  }, [categoryLoading, brandLoading])

  return {
    categoryList,
    brandList,
    filterLoading,
  }
}

export default useFilter
