import { useEffect, useState } from 'react'
import {
  getProductShopEnterpriseGetBrand,
  getProductShopEnterpriseGetCategoryTree,
  getProductShopScoreGetCategoryTree,
  getProductShopStoreGetBrand,
  getProductShopStoreGetCustomerCategoryTree,
  getProductPlatformGetCategoryTree,
  getProductShopEnterpriseGetAttributeByCategoryId,
  getProductShopStoreGetCustomerAttributeByCategoryId,
  getProductShopSelfGetCustomerAttributeByCategoryId,
  getProductShopSelfGetBrand,
  getProductShopSelfGetCustomerCategoryTree,
} from '@apps/apis'
import { FILTER_TYPE, FilterValueType } from '@/components/CommonFilter/types'
import { CategoryItemType } from '@/types/commodity'
import { removeURLArg } from '@/utils/getUrlParam'
import { LAYOUT_TYPE } from '@/types/global'
import { BrandItemType } from '@/components/CommonFilter/Brand'
import { initCategoryData } from '@/utils/category'
import { useGlobalConext } from '@/context/globalProvider'
import { useLocation, useParams } from 'react-router-dom'

export const getCategoryLink = (item: CategoryItemType, pathname: string, filter: string, search: string): string => {
  if (pathname) {
    let resultUrl = ''
    if (filter) {
      if (filter.indexOf('b') > -1 && filter.indexOf('c') > -1) {
        const newPathname = `${pathname}${search}`
        resultUrl = newPathname.replace(/(c\d*_){1,}/, `${item.key}_`)
      } else if (filter.indexOf('b') > -1 && filter.indexOf('c') < 0) {
        const newPathname = `${pathname}${search}`
        resultUrl = newPathname.replace(filter, `${item.key}_${filter}`)
      } else {
        const newPathname = `${pathname}${search}`
        resultUrl = newPathname.replace(filter, `${item.key}`)
      }
    } else {
      resultUrl = `${pathname}/${item.key}${search}`
    }
    if (search) {
      if (search.indexOf('attr') > -1) {
        resultUrl = removeURLArg(resultUrl, 'attr')
      }
    }

    return resultUrl
  }
  return '#!'
}

export const initCategoryTreeData = (list: any, pathname: string, filter: string, search: string) => {
  if (!list) {
    return []
  }

  const result: any = list.map((item: CategoryItemType) => {
    const newItem = { ...item }
    newItem.link = getCategoryLink(newItem, pathname, filter, search)
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = initCategoryTreeData(newItem.children, pathname, filter, search)
    } else {
      newItem.link = getCategoryLink(newItem, pathname, filter, search)
    }
    return newItem
  })
  return result
}

interface UseFilterProps {
  initCategoryList?: CategoryItemType[]
  initBrandList?: BrandItemType[]
  filterList: FilterValueType[]
  pathname: string
}

const useFilter = (props: UseFilterProps) => {
  const { initCategoryList = [], initBrandList = [], filterList = [], pathname } = props
  const { mallInfo, layoutType, shopInfo } = useGlobalConext()
  const { filter = '' } = useParams()
  const { search } = useLocation()
  const [categoryList, setCategoryList] = useState<CategoryItemType[]>(
    initCategoryTreeData(initCategoryList, pathname, filter, search),
  )
  const [brandList, setBrandList] = useState<BrandItemType[]>(initBrandList)

  useEffect(() => {
    /**
     * 获取品类属性
     * @param mallInfo
     * @param layoutType
     * @param categoryId
     */
    const fetchAttributeList = async (categoryId: string, storeId?: number) => {
      /** 属性接口 */
      const ATTRIBUTE_API = {
        /** 联营现货商品列表 */
        [LAYOUT_TYPE.joint]: getProductShopEnterpriseGetAttributeByCategoryId,
        /** 联营商城店铺商品列表 */
        [LAYOUT_TYPE.shop]: getProductShopStoreGetCustomerAttributeByCategoryId,
        /** 自营商城商品列表 */
        [LAYOUT_TYPE.own]: getProductShopSelfGetCustomerAttributeByCategoryId,
      }
      if (!mallInfo || !ATTRIBUTE_API[layoutType]) return []
      try {
        const headers = {
          shopId: mallInfo?.id,
        }

        const params: any = {
          categoryId,
        }

        switch (layoutType) {
          case LAYOUT_TYPE.shop:
            params.storeId = storeId
            break
          case LAYOUT_TYPE.own:
            params.memberId = mallInfo.memberId
            break
          default:
            break
        }
        const { data } = await ATTRIBUTE_API[layoutType](params, { headers })
        return data || []
      } catch (error) {
        return []
      }
    }

    // 如果是最后一级品类则显示查询属性
    if (filterList && filterList.length > 0 && !import.meta.env.DEV) {
      const categoryFilter = filterList.filter(
        (item) => item.type === FILTER_TYPE.category || item.type === FILTER_TYPE.customerCategory,
      )[0]
      // const hasAttrFilter = filterList.filter((item) => item.type === FILTER_TYPE.attribute)[0]
      const state = categoryFilter && categoryFilter.isLast
      // 如果是最后一级品类则显示属性
      if (state) {
        fetchAttributeList(categoryFilter.key, shopInfo?.id)
      }
    }
  }, [filterList])

  /**
   * 获取品类数据
   */
  const fetchCategoryList = async () => {
    let getFn
    const param: any = {}
    const headers = {
      shopId: mallInfo?.id,
    }
    /**
     * 根据不通过的页面类型，请求不同的品类接口
     */
    switch (layoutType) {
      case LAYOUT_TYPE.joint:
        getFn = getProductShopEnterpriseGetCategoryTree
        break
      case LAYOUT_TYPE.shop:
        param.storeId = shopInfo?.id
        getFn = getProductShopStoreGetCustomerCategoryTree
        break
      case LAYOUT_TYPE.shopList:
        getFn = getProductPlatformGetCategoryTree
        break
      case LAYOUT_TYPE.scoreMall:
      case LAYOUT_TYPE.shopScoreMall:
        getFn = getProductShopScoreGetCategoryTree
        break
      case LAYOUT_TYPE.own:
        param.memberId = mallInfo?.memberId
        getFn = getProductShopSelfGetCustomerCategoryTree
        break
      default:
        break
    }

    if (getFn) {
      const res = await getFn(param, { headers } as any)
      if (res.code === 1000 && res.data) {
        const list = initCategoryData(res.data)
        setCategoryList(initCategoryTreeData(list, pathname, filter, search))
      }
    }
  }

  /**
   * 获取品牌数据
   */
  const fetchBrandList = async () => {
    let getFn
    const param: any = {}
    const headers = {
      shopId: mallInfo?.id,
    }
    /**
     * 根据不通过的页面类型，请求不同的品类接口
     */
    switch (layoutType) {
      case LAYOUT_TYPE.joint:
        getFn = getProductShopEnterpriseGetBrand
        break
      case LAYOUT_TYPE.shop:
        param.storeId = shopInfo?.id
        getFn = getProductShopStoreGetBrand
        break
      case LAYOUT_TYPE.own:
        param.memberId = mallInfo?.memberId
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
  }

  useEffect(() => {
    if (!import.meta.env.DEV) {
      fetchCategoryList()
      fetchBrandList()
    }
  }, [])

  return {
    categoryList,
    brandList,
  }
}

export default useFilter
