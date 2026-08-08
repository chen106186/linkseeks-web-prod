import { AttributeType, FilterValueType } from '@/components/CommonFilter/types'
import { initCategoryTreeData } from '@/hooks/useFilter'
import { BrandItemType, CategoryItemType, FILTER_TYPE, MroCategoryItemType } from '@/types/commodity'
import { LAYOUT_TYPE, MallInfoType } from '@/types/global'
import CacheManager from '@/utils/cache'
import { initCategoryData } from '@/utils/category'
import { getQueryString } from '@/utils/getUrlParam'
import {
  getProductCommodityGetBrandListByCategoryId,
  getProductCommodityGetBrandListByCustomerCategoryId,
  getProductCustomerGetMemberCustomerCategoryTree,
  getProductCustomerGetMroCustomerCategoryAttributeList,
  getProductPlatformGetCategoryTree,
  getProductPlatformGetMroCategoryAttributeList,
  getProductShopEnterpriseGetAttributeByCategoryId,
  getProductShopEnterpriseGetBrand,
  getProductShopEnterpriseGetCategoryTree,
  getProductShopScoreGetCategoryTree,
  getProductShopSelfGetBrand,
  getProductShopSelfGetCustomerAttributeByCategoryId,
  getProductShopSelfGetCustomerCategoryTree,
  getProductShopStoreGetBrand,
  getProductShopStoreGetCustomerAttributeByCategoryId,
  getProductShopStoreGetCustomerCategoryTree,
  postProductCustomerGetEffectiveAttribute,
  postProductPlatformGetEffectiveAttribute,
} from '@apps/apis'

/** 判读两个数组缺少的数据，不存在的则补充 */
const replenishData = (list: any[], allList: any[], attributeId: string, attributeValueId: string) => {
  if (Array.isArray(list) && list.length > 0 && Array.isArray(allList) && allList.length > 0) {
    const result: any[] = []
    for (const item of allList) {
      const filterItem = list.find((listItem) => listItem[attributeId] === item.id)
      if (filterItem) {
        result.push(filterItem)
      } else {
        result.push({
          [attributeId]: item.id,
          [attributeValueId]: item[attributeValueId] ?? [],
        })
      }
    }
    return result
  }
  return []
}

const mroBrandForEach = (data: any, mroCategoryTree: any, attrName: string | number, mroFilterSelected?: any) => {
  const _indexBrand = mroCategoryTree.findIndex((item: any) => item.id === 'brand999')

  mroCategoryTree[_indexBrand][attrName]?.forEach((item: any, index: any, arr: any) => {
    if (data.indexOf(item.id) >= 0) {
      arr[index]['able'] = true
    } else {
      arr[index]['able'] = false
      if (mroFilterSelected) {
        const _index = mroFilterSelected['brand']?.['brand999']?.indexOf(item.id)
        if (_index != undefined && _index >= 0) {
          mroFilterSelected['brand']?.['brand999']?.splice(_index, 1)
        }
      }
    }
  })
}

const mroForEach = (
  data: any,
  mroCategoryTree: any[],
  attrName: string | number,
  attributeId: any,
  attributeValueId: any,
  mroFilterSelected?: any,
) => {
  if (data.length > 0) {
    data.forEach((item: any) => {
      const _id = item[attributeId]
      mroCategoryTree?.forEach((item2: any) => {
        if (item2.id === _id && item2[attrName].length > 0) {
          item2[attrName]?.forEach((item3: any, itemIndex3: number, arr3: any) => {
            if (item[attributeValueId].indexOf(item3.id) >= 0) {
              arr3[itemIndex3]['able'] = true
            } else {
              arr3[itemIndex3]['able'] = false
              if (mroFilterSelected) {
                const _index = mroFilterSelected['attr']?.[item2.id]?.indexOf(item3.id)
                if (_index != undefined && _index >= 0) {
                  mroFilterSelected['attr'][item2.id].splice(_index, 1)
                }
              }
            }
          })
        }
      })
    })
  } else {
    mroCategoryTree?.forEach((item2: any) => {
      item2[attrName]?.forEach((item3: any, itemIndex3: number, arr3: any) => {
        arr3[itemIndex3]['able'] = false
        if (mroFilterSelected) {
          const _index = mroFilterSelected['attr']?.[item2.id]?.indexOf(item3.id)
          if (_index != undefined && _index >= 0) {
            mroFilterSelected['attr'][item2.id].splice(_index, 1)
          }
        }
      })
    })
  }
}

/** 获取品类名称 */
const getCategoryInfoByList = (key: string, list: CategoryItemType[]) => {
  let value: any = null

  const recurision = (list: CategoryItemType[], key: string) => {
    if (!list) return null
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === key) {
        value = list[i]
        break
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

/** 获取品牌名称 */
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

/** 获取排序类型 */
const getSoleTypeByNumber = (type: number, layoutType: LAYOUT_TYPE): string => {
  switch (type) {
    case 1:
      return 'soldSort'
    case 2:
      return 'creditSort'
    case 3:
      if (layoutType === LAYOUT_TYPE.ownScore || layoutType === LAYOUT_TYPE.jointScore) {
        return 'pointSortHighToLow'
      }
      return 'priceSortHighToLow'
    case 4:
      if (layoutType === LAYOUT_TYPE.ownScore || layoutType === LAYOUT_TYPE.jointScore) {
        return 'pointSortLowToHigh'
      }
      return 'priceSortLowToHigh'
    case 5:
      return 'dateSort'
    default:
      return ''
  }
}

const getSrmSoleTypeByNumber = (type: number): string => {
  switch (type) {
    case 1:
      return 'creditSortHighToLow'
    case 2:
      return 'creditSortLowToHigh'
    case 3:
      return 'publicTimeSortHighToLow'
    case 4:
      return 'publicTimeSortLowToHigh'
    default:
      return ''
  }
}

/**
 * 获取mro筛选相关信息
 * @returns
 */
const getMroCategoryTree = async (layoutType: LAYOUT_TYPE, search: string, categoryId: number) => {
  let _mroFilterSelected: any = {}
  let mroBrand = false
  const mroFilter = getQueryString('mroFilter', search)
  const _attrName = layoutType === LAYOUT_TYPE.joint ? 'attributeValueList' : 'customerAttributeValueList'
  const _attributeId = layoutType === LAYOUT_TYPE.joint ? 'attributeId' : 'customerAttributeId'
  const _attributeValueId = layoutType === LAYOUT_TYPE.joint ? 'attributeValueId' : 'customerAttributeValueId'
  const _brandCategoryId = layoutType === LAYOUT_TYPE.joint ? 'categoryId' : 'customerCategoryId'
  const _commodityAttributeResponseList =
    layoutType === LAYOUT_TYPE.joint ? 'commodityAttributeRespList' : 'commoditySkuAttributeRespList'

  const _search = mroFilter ? mroFilter.split('_') : []
  const _attrSearch = _search?.filter((item) => item.indexOf('c') >= 0)?.map((item) => item.replace('c', ''))
  const _brandSearch = _search?.filter((item) => item.indexOf('b') >= 0)?.map((item) => item.replace('b', ''))
  const _query: any = { categoryId, name: '', isByCategory: true }

  const productApi = import.meta.env.SSR ? await import('@/service/productApi') : undefined

  /** 属性接口 */
  const _getAttrApi = (layoutType: LAYOUT_TYPE) => {
    if (layoutType === LAYOUT_TYPE.joint) {
      if (import.meta.env.SSR && productApi) {
        return productApi.getProductPlatformGetMroCategoryAttributeList
      } else {
        return getProductPlatformGetMroCategoryAttributeList
      }
    } else {
      if (import.meta.env.SSR && productApi) {
        return productApi.getProductCustomerGetMroCustomerCategoryAttributeList
      } else {
        return getProductCustomerGetMroCustomerCategoryAttributeList
      }
    }
  }

  /** 品牌接口 */
  const _getBrandApi = (layoutType: LAYOUT_TYPE) => {
    if (layoutType === LAYOUT_TYPE.joint) {
      if (import.meta.env.SSR && productApi) {
        return productApi.getProductCommodityGetBrandListByCategoryId
      } else {
        return getProductCommodityGetBrandListByCategoryId
      }
    } else {
      if (import.meta.env.SSR && productApi) {
        return productApi.getProductCommodityGetBrandListByCustomerCategoryId
      } else {
        return getProductCommodityGetBrandListByCustomerCategoryId
      }
    }
  }

  const res = await _getAttrApi(layoutType)(_query)
  const brandRes = await _getBrandApi(layoutType)({ [_brandCategoryId]: categoryId } as any)
  if (res.code !== 1000) {
    return
  }

  let _mroCategoryTree: any = res.data || []
  if (brandRes.data && brandRes.data.length > 0) {
    mroBrand = true
    _mroCategoryTree = [
      {
        id: 'brand999',
        name: '',
        [_attrName]: brandRes.data?.map((item: any) => {
          return { ...item, value: item.name }
        }),
      },
    ].concat(_mroCategoryTree)
  }

  _mroCategoryTree?.forEach((item: any) => {
    if (item.id === 'brand999') {
      item[_attrName]?.forEach((item2: any) => {
        if (_brandSearch.indexOf(String(item2.id)) >= 0) {
          if (!_mroFilterSelected['brand']) {
            _mroFilterSelected['brand'] = {}
          }

          if (_mroFilterSelected['brand'][item.id]) {
            _mroFilterSelected['brand'][item.id].push(item2.id)
          } else {
            _mroFilterSelected['brand'][item.id] = [item2.id]
          }
        }
      })
    } else {
      item[_attrName]?.forEach((item2: any) => {
        if (_attrSearch.indexOf(String(item2.id)) >= 0) {
          if (!_mroFilterSelected['attr']) {
            _mroFilterSelected['attr'] = {}
          }
          if (_mroFilterSelected['attr'][item.id]) {
            _mroFilterSelected['attr'][item.id].push(item2.id)
          } else {
            _mroFilterSelected['attr'][item.id] = [item2.id]
          }
        }
      })
    }
  })

  let _attributeIdList: any = []
  let _attributeValueIdList: any = []
  for (let key in _mroFilterSelected['attr']) {
    if (_mroFilterSelected['attr'][key] && _mroFilterSelected['attr'][key].length > 0) {
      _attributeIdList.push(key)
      _attributeValueIdList = _attributeValueIdList.concat(_mroFilterSelected['attr'][key])
    }
  }

  const _effectiveAttrApi = (layoutType: LAYOUT_TYPE) => {
    if (layoutType === LAYOUT_TYPE.joint) {
      if (import.meta.env.SSR && productApi) {
        return productApi.postProductPlatformGetEffectiveAttribute
      } else {
        return postProductPlatformGetEffectiveAttribute
      }
    } else {
      if (import.meta.env.SSR && productApi) {
        return productApi.postProductCustomerGetEffectiveAttribute
      } else {
        return postProductCustomerGetEffectiveAttribute
      }
    }
  }

  const { data } = await _effectiveAttrApi(layoutType)(
    {
      attributeIdList: _attributeIdList,
      attributeValueIdList: _attributeValueIdList,
      brandIdList: _mroFilterSelected?.['brand']?.['brand999'] || [],
      categoryId,
    },
    { ctlType: 'none' },
  )

  mroForEach(
    replenishData(data ? data[_commodityAttributeResponseList] : [], _mroCategoryTree, _attributeId, _attributeValueId),
    _mroCategoryTree,
    _attrName,
    _attributeId,
    _attributeValueId,
    _mroFilterSelected,
  )

  mroBrand && mroBrandForEach(data['brandIdList'], _mroCategoryTree, _attrName, _mroFilterSelected)

  return {
    mroCategoryTree: _mroCategoryTree,
    mroFilterSelected: _mroFilterSelected,
  }
}

/**
 * 获取品类数据
 * @param mallInfo
 * @param layoutType
 * @param params
 */
const fetchCategoryList = async (
  mallInfo: MallInfoType,
  layoutType: LAYOUT_TYPE,
  pathname: string,
  filter: string,
  search: string,
  storeId?: number,
) => {
  const productApi = import.meta.env.SSR ? await import('@/service/productApi') : undefined
  /** 品类接口 */
  const CATEGORY_API = {
    /** 联营现货商品列表 */
    [LAYOUT_TYPE.joint]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopEnterpriseGetCategoryTree
        : getProductShopEnterpriseGetCategoryTree,
    /** 联营商城店铺商品列表 */
    [LAYOUT_TYPE.shop]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopStoreGetCustomerCategoryTree
        : getProductShopStoreGetCustomerCategoryTree,
    /** 联营商城店铺商品列表 */
    [LAYOUT_TYPE.shopScoreMall]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopScoreGetCategoryTree
        : getProductShopScoreGetCategoryTree,
    /** 联营积分兑换商品列表 */
    [LAYOUT_TYPE.jointScore]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopScoreGetCategoryTree
        : getProductShopScoreGetCategoryTree,
    /** 联营优选店铺列表 */
    [LAYOUT_TYPE.shopList]:
      import.meta.env.SSR && productApi
        ? productApi.getProductPlatformGetCategoryTree
        : getProductPlatformGetCategoryTree,
    /** 自营商城商品列表 */
    [LAYOUT_TYPE.own]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopSelfGetCustomerCategoryTree
        : getProductShopSelfGetCustomerCategoryTree,
    /** 自营积分兑换商品列表 */
    [LAYOUT_TYPE.ownScore]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopSelfGetCustomerCategoryTree
        : getProductShopSelfGetCustomerCategoryTree,
    [LAYOUT_TYPE.srm]:
      import.meta.env.SSR && productApi
        ? productApi.getProductPlatformGetCategoryTree
        : getProductPlatformGetCategoryTree,
    [LAYOUT_TYPE.shopIndex]:
      import.meta.env.SSR && productApi
        ? productApi.getProductCustomerGetMemberCustomerCategoryTree
        : getProductCustomerGetMemberCustomerCategoryTree,
  }
  try {
    if (!mallInfo || !CATEGORY_API[layoutType]) return []
    const params: Record<string, any> = {}
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
      case LAYOUT_TYPE.shopScoreMall:
        params.storeId = storeId
        break
      case LAYOUT_TYPE.own:
      case LAYOUT_TYPE.ownScore:
        params.memberId = mallInfo.memberId
        break
      case LAYOUT_TYPE.shopIndex:
        const purchaseInfo = CacheManager.get('purchaseInfo')
        if (purchaseInfo) {
          params.memberId = purchaseInfo.memberId
          params.memberRoleId = purchaseInfo.roleId
        }
        break
      default:
        break
    }
    const { data } = await CATEGORY_API[layoutType]?.(
      { ...params },
      {
        headers: {
          shopId: mallInfo.id,
        },
      },
    )

    const list = initCategoryData(data)

    return initCategoryTreeData(list, pathname, filter, search)
  } catch (error) {
    return []
  }
}

const fetchBrandList = async (mallInfo: MallInfoType, layoutType: LAYOUT_TYPE, storeId?: number) => {
  const productApi = import.meta.env.SSR ? await import('@/service/productApi') : undefined
  /** 品牌接口 */
  const BRAND_API = {
    /** 联营现货商品列表 */
    [LAYOUT_TYPE.joint]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopEnterpriseGetBrand
        : getProductShopEnterpriseGetBrand,
    /** 联营商城店铺商品列表 */
    [LAYOUT_TYPE.shop]:
      import.meta.env.SSR && productApi ? productApi.getProductShopStoreGetBrand : getProductShopStoreGetBrand,
    /** 自营商城商品列表 */
    [LAYOUT_TYPE.own]:
      import.meta.env.SSR && productApi ? productApi.getProductShopSelfGetBrand : getProductShopSelfGetBrand,
  }
  try {
    if (!mallInfo || !BRAND_API[layoutType]) return []
    const params: Record<string, any> = {}
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
        params.storeId = storeId
        break
      case LAYOUT_TYPE.own:
      case LAYOUT_TYPE.ownScore:
        params.memberId = mallInfo.memberId
        break
      default:
        break
    }
    const { data } = await BRAND_API[layoutType]?.(
      { ...params },
      {
        headers: {
          shopId: mallInfo.id,
        },
      },
    )

    return data || []
  } catch (error) {
    return []
  }
}

/**
 * 获取品类属性
 * @param mallInfo
 * @param layoutType
 * @param categoryId
 */
const fetchAttributeList = async (
  mallInfo: MallInfoType,
  layoutType: LAYOUT_TYPE,
  categoryId: string,
  storeId?: number,
) => {
  const productApi = import.meta.env.SSR ? await import('@/service/productApi') : undefined
  /** 属性接口 */
  const ATTRIBUTE_API = {
    /** 联营现货商品列表 */
    [LAYOUT_TYPE.joint]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopEnterpriseGetAttributeByCategoryId
        : getProductShopEnterpriseGetAttributeByCategoryId,
    /** 联营商城店铺商品列表 */
    [LAYOUT_TYPE.shop]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopStoreGetCustomerAttributeByCategoryId
        : getProductShopStoreGetCustomerAttributeByCategoryId,
    /** 自营商城商品列表 */
    [LAYOUT_TYPE.own]:
      import.meta.env.SSR && productApi
        ? productApi.getProductShopSelfGetCustomerAttributeByCategoryId
        : getProductShopSelfGetCustomerAttributeByCategoryId,
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

const initFilterList = (
  layoutType: LAYOUT_TYPE,
  filter: string,
  search: string,
  categoryList: CategoryItemType[],
  brandList: BrandItemType[],
) => {
  const filterList: FilterValueType[] = []
  let hasLastCategory = false
  if (filter) {
    const filterIds: string[] = filter.split('_')
    // 判断搜索参数中是否有品类的筛选
    if (filter.indexOf('c') > -1) {
      if (categoryList && categoryList.length > 0) {
        const categoryIds: string[] = []
        for (const filterItem of filterIds) {
          if (filterItem.indexOf('c') > -1) {
            categoryIds.push(filterItem)
          }
        }
        const categoryId = categoryIds.join('_')
        const categoryInfo = getCategoryInfoByList(categoryId, categoryList)
        if (categoryInfo) {
          hasLastCategory = categoryInfo.children === undefined
          const title =
            categoryInfo.treeName && typeof categoryInfo.treeName === 'string'
              ? categoryInfo.treeName.split(' ').join(' > ')
              : ''
          if (layoutType === LAYOUT_TYPE.joint || layoutType === LAYOUT_TYPE.shopList) {
            filterList.push({
              type: FILTER_TYPE.category,
              title: title,
              filter: categoryInfo.key,
              key: categoryInfo.id,
              isLast: hasLastCategory,
            })
          } else {
            filterList.push({
              type: FILTER_TYPE.customerCategory,
              title: title,
              filter: categoryInfo.key,
              key: categoryInfo.id,
              isLast: hasLastCategory,
            })
          }
        } else {
          filterList.push({
            type: FILTER_TYPE.category,
            title: categoryId,
            filter: categoryId,
            key: 99999,
          })
        }
      }
    }

    // 判断搜索参数中是否有品牌的筛选
    if (filter.indexOf('b') > -1) {
      if (brandList && brandList.length > 0) {
        const brandIds: string[] = []
        for (const filterItem of filterIds) {
          if (filterItem.indexOf('b') > -1) {
            brandIds.push(filterItem.replace('b', ''))
          }
        }

        const brandInfo = getBrandInfoByList(Number(brandIds[0]), brandList)

        if (brandInfo) {
          filterList.push({
            type: FILTER_TYPE.brand,
            title: brandInfo.name,
            key: brandInfo.id,
          })
        } else {
          filterList.push({
            type: FILTER_TYPE.brand,
            title: brandIds[0],
            key: Number(brandIds[0]),
          })
        }
      }
    }
  }

  if (search) {
    /**
     * 当url含有关键词搜索
     */
    const keyword = getQueryString('keyword', search)
    if (keyword) {
      if (layoutType === LAYOUT_TYPE.shopList) {
        filterList.push({
          type: FILTER_TYPE.shopKeyword,
          title: decodeURIComponent(keyword),
          key: decodeURIComponent(keyword),
        })
      } else {
        filterList.push({
          type: FILTER_TYPE.keyword,
          title: decodeURIComponent(keyword),
          key: decodeURIComponent(keyword),
        })
      }
    }

    /**
     * 当url含有商品类型搜索时
     */
    const carriageType = getQueryString('carriageType', search)
    if (carriageType) {
      filterList.push({
        type: FILTER_TYPE.carriageType,
        key: carriageType,
      })
    }

    /**
     * 当url含有最低和最高价个搜索时
     */
    const min = getQueryString('min', search)
    const max = getQueryString('max', search)

    if (min) {
      filterList.push({
        type: FILTER_TYPE.minPrice,
        key: min,
      })
    }

    if (max) {
      filterList.push({
        type: FILTER_TYPE.maxPrice,
        key: max,
      })
    }

    /**
     * 当url含有最低和最高价个搜索时
     */
    const minPoint = getQueryString('minPoint', search)
    const maxPoint = getQueryString('maxPoint', search)

    if (minPoint) {
      filterList.push({
        type: FILTER_TYPE.minPoints,
        key: minPoint,
      })
    }

    if (maxPoint) {
      filterList.push({
        type: FILTER_TYPE.maxPoints,
        key: maxPoint,
      })
    }

    /**
     * 当url含有排序类型搜索
     */
    const orderType = getQueryString('orderType', search)
    if (orderType) {
      filterList.push({
        type: FILTER_TYPE.sort,
        key: getSoleTypeByNumber(Number(orderType), layoutType),
      })
    }

    /**
     * 当url含有排序类型搜索
     */
    const srmOrderType = getQueryString('srmOrderType', search)
    if (srmOrderType) {
      filterList.push({
        type: FILTER_TYPE.sort,
        key: getSrmSoleTypeByNumber(Number(srmOrderType)),
      })
    }

    /** 信用积分排序 */
    const sortCreditPoint = getQueryString('sortCreditPoint', search)
    if (sortCreditPoint) {
      if (sortCreditPoint === 'ASC') {
        filterList.push({
          type: FILTER_TYPE.shopCreditSortLowToHigh,
          key: 'ASC',
        })
      } else if (sortCreditPoint === 'DESC') {
        filterList.push({
          type: FILTER_TYPE.shopCreditSortHighToLow,
          key: 'DESC',
        })
      }
    }

    /** 开始时间 */
    const startTime = getQueryString('startTime', search)
    if (startTime) {
      filterList.push({
        type: FILTER_TYPE.publicStartTime,
        key: startTime,
      })
    }

    /** 结束时间 */
    const endTime = getQueryString('endTime', search)
    if (endTime) {
      filterList.push({
        type: FILTER_TYPE.publicEndTime,
        key: endTime,
      })
    }

    /** 结束时间 */
    const name = getQueryString('name', search)
    if (name) {
      filterList.push({
        type: FILTER_TYPE.projectKeyword,
        key: name,
      })
    }

    /** 属性搜索 */
    const attr = getQueryString('attr', search)
    if (attr) {
      const attrList = attr.split(';').filter((item) => item)
      const list: any[] = []

      for (let i = 0; i < attrList.length; i++) {
        const attrId = attrList[i].split('-')[0]
        const tempList = attrList[i].split('-')[1]
        const selectAttrList = tempList.split(',')

        if (selectAttrList[0]) {
          const tempItem = {
            customerAttributeId: Number(attrId),
            customerAttributeValueList: selectAttrList.map((item: any) => {
              return {
                id: item,
              }
            }),
          }
          list.push(tempItem)
        }
      }

      if (list.length > 0) {
        filterList.push({
          type: FILTER_TYPE.attribute,
          key: list,
        })
      }
    }

    /** mro筛选 */
    const mroFilter = getQueryString('mroFilter', search)
    if (mroFilter) {
      const _mroFilter = mroFilter.split('_')
      _mroFilter?.forEach((_mroKey) => {
        filterList.push({
          type: FILTER_TYPE.mroFilter,
          key: _mroKey,
        })
      })
    }

    /** srm 寻源类型 */
    const type = getQueryString('type', search)
    if (type) {
      filterList.push({
        type: FILTER_TYPE.sourceType,
        key: type,
      })
    }

    /** srm 只看与我相关 */
    const aboutUs = getQueryString('aboutUs', search)
    if (aboutUs) {
      filterList.push({
        type: FILTER_TYPE.aboutUs,
        key: aboutUs,
      })
    }
  }

  return filterList
}

export interface CommodityLoaderReturn {
  categoryList: CategoryItemType[]
  brandList: BrandItemType[]
  filterList: FilterValueType[]
  attributeList: AttributeType[]
  initMroCategoryTree: MroCategoryItemType[]
  initMroFilterSelected: Record<string, any>
}

export default async ({ params, request, layoutType }) => {
  const url = new URL(request.url)
  // 等待initLoader执行完成
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      const initLoading = CacheManager.get('initLoading') as boolean
      if (initLoading === false) {
        clearInterval(timer)
        resolve(true)
      }
    }, 300)
  })
  // 获取缓存中的商城信息
  const mallInfo = CacheManager.get('mallInfo') as MallInfoType

  const [categoryList, brandList] = await Promise.all([
    fetchCategoryList(mallInfo, layoutType, url.pathname, params?.filter, url.search, params?.storeId),
    fetchBrandList(mallInfo, layoutType, params?.storeId),
  ])

  const filterList = initFilterList(layoutType, params?.filter, url.search, categoryList, brandList)

  let attributeList: AttributeType[] = []
  let initMroCategoryTree: MroCategoryItemType[] = []
  let initMroFilterSelected: Record<string, any> = {}
  // 如果是最后一级品类则显示查询属性
  if (filterList && filterList.length > 0) {
    const categoryFilter = filterList.filter(
      (item) => item.type === FILTER_TYPE.category || item.type === FILTER_TYPE.customerCategory,
    )[0]
    // const hasAttrFilter = filterList.filter((item) => item.type === FILTER_TYPE.attribute)[0]
    const state = categoryFilter && categoryFilter.isLast

    // 如果是最后一级品类则显示属性
    if (state && !mallInfo.isOpenMro) {
      attributeList = await fetchAttributeList(mallInfo, layoutType, categoryFilter.key, params?.storeId)
    }

    // 判断是否开启了mro模式和有品类筛选
    if (mallInfo.isOpenMro && categoryFilter) {
      const mroRes = await getMroCategoryTree(layoutType, url.search, categoryFilter.key)
      initMroCategoryTree = mroRes?.mroCategoryTree
      initMroFilterSelected = mroRes?.mroFilterSelected
    }
  }
  return {
    categoryList,
    attributeList,
    brandList,
    filterList,
    initMroCategoryTree,
    initMroFilterSelected,
  }
}
