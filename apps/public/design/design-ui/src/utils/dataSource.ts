import {
  getMarketingAdornGoodsListAdorn,
  GetMarketingAdornGoodsListAdornResponseDetail,
  postProductCommodityGetCommodityByCommoditySkuIdList,
  PostProductCommodityGetCommodityByCommoditySkuIdListResponse,
} from '@apps/apis'

const normalizeSkuList = (
  list: PostProductCommodityGetCommodityByCommoditySkuIdListResponse,
  commodityList: any,
) => {
  console.log('list1111111222222', list, commodityList)
  return list.map((item, index) => ({
    id: item.id,
    sort: index + 1,
    commodityId: item.commodityId,
    skuId: item.id,
    name: item.name,
    mainPic: item.mainPic,
    price: item.min,
    priceType: item.priceType || 1,
    activityPrice: item.min,
    unitName: item.unitName,
    memberId: item.memberId,
    groupPurchase: item.groupPurchase,
    sold: 0,
    tags:
      item.tagList ||
      commodityList.find((listItem: any) => listItem.id === item.id)?.tags ||
      [],
    storeId: item.storeId,
    minOrder: item.minOrder,
    stockCount: item.stockCount,
    min: item.min,
    max: item.max,
    tagList: item.tagList || [],
  }))
}

const normalizeCommodityList = (
  list: GetMarketingAdornGoodsListAdornResponseDetail[],
  commodityList: any,
) => {
  console.log('list11111113333', list, commodityList)
  return list.map((item, index) => ({
    id: item.id,
    sort: index + 1,
    commodityId: item.id,
    name: item.name,
    mainPic: item.mainPic,
    price: item.min,
    priceType: item.priceType || 1,
    activityPrice: item.min,
    unitName: item.unitName,
    memberId: item.memberId,
    sold: item.sold || 0,
    groupPurchase: item.groupPurchase,
    tags:
      item.tagList ||
      commodityList.find((listItem: any) => listItem.id === item.id)?.tags ||
      [],
    storeId: item.storeId,
    minOrder: item.minOrder,
    stockCount: item.stockCount,
    min: item.min,
    max: item.max,
    tagList: item.tagList || [],
  }))
}

/**
 * 重新请求数据源
 */
export const reloadDataSourceFn = async (params: any, oldDataSource: any[]) => {
  try {
    const ids = params?.idInList || []
    if (ids.length === 0) {
      return []
    }
    const { code, data } = await getMarketingAdornGoodsListAdorn(params)
    if (code === 1000 && data && data.data.length > 0) {
      const result = data.data
        .map((item: any, index) => ({
          ...item,
          sort: index + 1,
          priceType: item.priceType,
          commodityId: item.id,
          commodityName: item.name,
          commodityPicUrl: item.mainPic,
          commodityPrice: item.min,
          commodityCategory: item.customerCategoryName,
        }))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      return result
    }
    return oldDataSource
  } catch (error) {
    return oldDataSource
  }
}

/**
 * 重新请求数据源
 */
export const reloadRecommendDataSourceFn = async (
  params: any,
  showType: 'normal' | 'marketing',
  oldDataSource: any[],
) => {
  try {
    const ids = params?.idInList || []
    if (ids.length === 0) {
      return []
    }
    if (showType === 'normal') {
      const { code, data } = await getMarketingAdornGoodsListAdorn(params)
      if (code === 1000 && data && data.data.length > 0) {
        const result = normalizeCommodityList(data.data, oldDataSource).sort(
          (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
        )
        return result
      }
    } else if (showType === 'marketing') {
      const { code, data } =
        await postProductCommodityGetCommodityByCommoditySkuIdList(
          {
            idList: ids,
          },
          { ctlType: 'none' },
        )
      if (code === 1000 && data && data.length > 0) {
        const result = normalizeSkuList(data, oldDataSource).sort(
          (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
        )
        return result
      }
    }
    return oldDataSource
  } catch (error) {
    return oldDataSource
  }
}
