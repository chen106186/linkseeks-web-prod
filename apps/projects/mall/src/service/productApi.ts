import { IApiRequest, get, post } from '@/utils/request'
import {
  GetProductCommodityGetBrandListByCategoryIdRequest,
  GetProductCommodityGetBrandListByCategoryIdResponse,
  GetProductCommodityGetBrandListByCustomerCategoryIdRequest,
  GetProductCommodityGetBrandListByCustomerCategoryIdResponse,
  GetProductCustomerGetMemberCustomerCategoryTreeRequest,
  GetProductCustomerGetMemberCustomerCategoryTreeResponse,
  GetProductCustomerGetMroCustomerCategoryAttributeListRequest,
  GetProductCustomerGetMroCustomerCategoryAttributeListResponse,
  GetProductPlatformGetCategoryTreeRequest,
  GetProductPlatformGetCategoryTreeResponse,
  GetProductPlatformGetMroCategoryAttributeListRequest,
  GetProductPlatformGetMroCategoryAttributeListResponse,
  GetProductShopEnterpriseGetAttributeByCategoryIdRequest,
  GetProductShopEnterpriseGetAttributeByCategoryIdResponse,
  GetProductShopEnterpriseGetBrandRequest,
  GetProductShopEnterpriseGetBrandResponse,
  GetProductShopEnterpriseGetCategoryTreeRequest,
  GetProductShopEnterpriseGetCategoryTreeResponse,
  GetProductShopScoreGetCategoryTreeRequest,
  GetProductShopScoreGetCategoryTreeResponse,
  GetProductShopSelfGetBrandRequest,
  GetProductShopSelfGetBrandResponse,
  GetProductShopSelfGetCustomerAttributeByCategoryIdRequest,
  GetProductShopSelfGetCustomerAttributeByCategoryIdResponse,
  GetProductShopSelfGetCustomerCategoryTreeRequest,
  GetProductShopSelfGetCustomerCategoryTreeResponse,
  GetProductShopStoreGetBrandRequest,
  GetProductShopStoreGetBrandResponse,
  GetProductShopStoreGetCommodityDetailRequest,
  GetProductShopStoreGetCommodityDetailResponse,
  GetProductShopStoreGetCustomerAttributeByCategoryIdRequest,
  GetProductShopStoreGetCustomerAttributeByCategoryIdResponse,
  GetProductShopStoreGetCustomerCategoryTreeRequest,
  GetProductShopStoreGetCustomerCategoryTreeResponse,
  PostProductCommodityGetCommodityByCommoditySkuIdListRequest,
  PostProductCommodityGetCommodityByCommoditySkuIdListResponse,
  PostProductCustomerGetEffectiveAttributeRequest,
  PostProductCustomerGetEffectiveAttributeResponse,
  PostProductPlatformGetEffectiveAttributeRequest,
  PostProductPlatformGetEffectiveAttributeResponse,
} from '@apps/apis'

/**
 * 接口 [查询商品品类树↗](http://47.115.168.121:3000/project/1503/interface/api/188358) 的 **请求函数**
 *
 * @分类 [企业商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23995)
 * @请求头 `GET /product/shop/enterprise/getCategoryTree`
 */
export const getProductShopEnterpriseGetCategoryTree = async (
  params?: GetProductShopEnterpriseGetCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopEnterpriseGetCategoryTreeResponse>('/product/shop/enterprise/getCategoryTree', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品会员品类树↗](http://47.115.168.121:3000/project/1503/interface/api/188262) 的 **请求函数**
 *
 * @分类 [店铺商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23989)
 * @请求头 `GET /product/shop/store/getCustomerCategoryTree`
 */
export const getProductShopStoreGetCustomerCategoryTree = async (
  params?: GetProductShopStoreGetCustomerCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopStoreGetCustomerCategoryTreeResponse>('/product/shop/store/getCustomerCategoryTree', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品品类树↗](http://47.115.168.121:3000/project/1503/interface/api/188254) 的 **请求函数**
 *
 * @分类 [积分兑换-企业商城和店铺商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23991)
 * @请求头 `GET /product/shop/score/getCategoryTree`
 */
export const getProductShopScoreGetCategoryTree = async (
  params?: GetProductShopScoreGetCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopScoreGetCategoryTreeResponse>('/product/shop/score/getCategoryTree', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询品类树↗](http://47.115.168.121:3000/project/1483/interface/api/187398) 的 **请求函数**
 *
 * @分类 [平台后台--品类管理↗](http://47.115.168.121:3000/project/1483/interface/api/cat_23951)
 * @请求头 `GET /product/platform/getCategoryTree`
 */
export const getProductPlatformGetCategoryTree = async (
  params?: GetProductPlatformGetCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductPlatformGetCategoryTreeResponse>('/product/platform/getCategoryTree', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询品类树--供应商↗](http://47.115.168.121:3000/project/6014/interface/api/851228) 的 **请求函数**
 *
 * @分类 [商品能力--品类管理↗](http://47.115.168.121:3000/project/6014/interface/api/cat_45011)
 * @请求头 `GET /product/customer/getMemberCustomerCategoryTree`
 */
export const getProductCustomerGetMemberCustomerCategoryTree = async (
  params?: GetProductCustomerGetMemberCustomerCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductCustomerGetMemberCustomerCategoryTreeResponse>(
    '/product/customer/getMemberCustomerCategoryTree',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [查询商品会员品类树↗](http://47.115.168.121:3000/project/1503/interface/api/188218) 的 **请求函数**
 *
 * @分类 [自营商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23990)
 * @请求头 `GET /product/shop/self/getCustomerCategoryTree`
 */
export const getProductShopSelfGetCustomerCategoryTree = async (
  params?: GetProductShopSelfGetCustomerCategoryTreeRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopSelfGetCustomerCategoryTreeResponse>('/product/shop/self/getCustomerCategoryTree', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品品牌↗](http://47.115.168.121:3000/project/1503/interface/api/188366) 的 **请求函数**
 *
 * @分类 [企业商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23995)
 * @请求头 `GET /product/shop/enterprise/getBrand`
 */
export const getProductShopEnterpriseGetBrand = async (
  params?: GetProductShopEnterpriseGetBrandRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopEnterpriseGetBrandResponse>('/product/shop/enterprise/getBrand', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品品牌↗](http://47.115.168.121:3000/project/1503/interface/api/188270) 的 **请求函数**
 *
 * @分类 [店铺商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23989)
 * @请求头 `GET /product/shop/store/getBrand`
 */
export const getProductShopStoreGetBrand = async (
  params?: GetProductShopStoreGetBrandRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopStoreGetBrandResponse>('/product/shop/store/getBrand', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品品牌↗](http://47.115.168.121:3000/project/1503/interface/api/188226) 的 **请求函数**
 *
 * @分类 [自营商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23990)
 * @请求头 `GET /product/shop/self/getBrand`
 */
export const getProductShopSelfGetBrand = async (params?: GetProductShopSelfGetBrandRequest, config?: IApiRequest) => {
  return get<GetProductShopSelfGetBrandResponse>('/product/shop/self/getBrand', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询商品属性↗](http://47.115.168.121:3000/project/1503/interface/api/188362) 的 **请求函数**
 *
 * @分类 [企业商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23995)
 * @请求头 `GET /product/shop/enterprise/getAttributeByCategoryId`
 */
export const getProductShopEnterpriseGetAttributeByCategoryId = async (
  params?: GetProductShopEnterpriseGetAttributeByCategoryIdRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopEnterpriseGetAttributeByCategoryIdResponse>(
    '/product/shop/enterprise/getAttributeByCategoryId',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [查询商品属性↗](http://47.115.168.121:3000/project/1503/interface/api/188266) 的 **请求函数**
 *
 * @分类 [店铺商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23989)
 * @请求头 `GET /product/shop/store/getCustomerAttributeByCategoryId`
 */
export const getProductShopStoreGetCustomerAttributeByCategoryId = async (
  params?: GetProductShopStoreGetCustomerAttributeByCategoryIdRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopStoreGetCustomerAttributeByCategoryIdResponse>(
    '/product/shop/store/getCustomerAttributeByCategoryId',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [查询商品属性↗](http://47.115.168.121:3000/project/1503/interface/api/188222) 的 **请求函数**
 *
 * @分类 [自营商城↗](http://47.115.168.121:3000/project/1503/interface/api/cat_23990)
 * @请求头 `GET /product/shop/self/getCustomerAttributeByCategoryId`
 */
export const getProductShopSelfGetCustomerAttributeByCategoryId = async (
  params?: GetProductShopSelfGetCustomerAttributeByCategoryIdRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopSelfGetCustomerAttributeByCategoryIdResponse>(
    '/product/shop/self/getCustomerAttributeByCategoryId',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [查询商品详情↗](http://47.115.168.121:3000/project/3844/interface/api/483084) 的 **请求函数**
 *
 * @分类 [店铺商城↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33187)
 * @请求头 `GET /product/shop/store/getCommodityDetail`
 */
export const getProductShopStoreGetCommodityDetail = async (
  params?: GetProductShopStoreGetCommodityDetailRequest,
  config?: IApiRequest,
) => {
  return get<GetProductShopStoreGetCommodityDetailResponse>('/product/shop/store/getCommodityDetail', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [根据会员品类获取品牌↗](http://47.115.168.121:3000/project/3844/interface/api/516236) 的 **请求函数**
 *
 * @分类 [商品管理↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33009)
 * @请求头 `GET /product/commodity/getBrandListByCustomerCategoryId`
 */
export const getProductCommodityGetBrandListByCustomerCategoryId = async (
  params?: GetProductCommodityGetBrandListByCustomerCategoryIdRequest,
  config?: IApiRequest,
) => {
  return get<GetProductCommodityGetBrandListByCustomerCategoryIdResponse>(
    '/product/commodity/getBrandListByCustomerCategoryId',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [根据平台品类获取品牌↗](http://47.115.168.121:3000/project/3844/interface/api/516243) 的 **请求函数**
 *
 * @分类 [商品管理↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33009)
 * @请求头 `GET /product/commodity/getBrandListByCategoryId`
 */
export const getProductCommodityGetBrandListByCategoryId = async (
  params?: GetProductCommodityGetBrandListByCategoryIdRequest,
  config?: IApiRequest,
) => {
  return get<GetProductCommodityGetBrandListByCategoryIdResponse>('/product/commodity/getBrandListByCategoryId', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [查询品类下的属性列表-MRO模式 按照特定的排序返回结果↗](http://47.115.168.121:3000/project/3844/interface/api/482307) 的 **请求函数**
 *
 * @分类 [商品能力--品类关联属性↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33163)
 * @请求头 `GET /product/customer/getMroCustomerCategoryAttributeList`
 */
export const getProductCustomerGetMroCustomerCategoryAttributeList = async (
  params?: GetProductCustomerGetMroCustomerCategoryAttributeListRequest,
  config?: IApiRequest,
) => {
  return get<GetProductCustomerGetMroCustomerCategoryAttributeListResponse>(
    '/product/customer/getMroCustomerCategoryAttributeList',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [查询品类下的属性列表-MRO模式 按照特定的排序返回结果↗](http://47.115.168.121:3000/project/3844/interface/api/479332) 的 **请求函数**
 *
 * @分类 [平台后台--品类关联属性↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33081)
 * @请求头 `GET /product/platform/getMroCategoryAttributeList`
 */
export const getProductPlatformGetMroCategoryAttributeList = async (
  params?: GetProductPlatformGetMroCategoryAttributeListRequest,
  config?: IApiRequest,
) => {
  return get<GetProductPlatformGetMroCategoryAttributeListResponse>('/product/platform/getMroCategoryAttributeList', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [获取可选的属性↗](http://47.115.168.121:3000/project/3844/interface/api/481859) 的 **请求函数**
 *
 * @分类 [商品能力--属性管理↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33147)
 * @请求头 `POST /product/customer/getEffectiveAttribute`
 */
export const postProductCustomerGetEffectiveAttribute = async (
  params?: PostProductCustomerGetEffectiveAttributeRequest,
  config?: IApiRequest,
) => {
  return post<PostProductCustomerGetEffectiveAttributeResponse>('/product/customer/getEffectiveAttribute', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })
}

/**
 * 接口 [获取可选的属性↗](http://47.115.168.121:3000/project/3844/interface/api/478779) 的 **请求函数**
 *
 * @分类 [平台后台--属性管理↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33067)
 * @请求头 `POST /product/platform/getEffectiveAttribute`
 */
export const postProductPlatformGetEffectiveAttribute = async (
  params?: PostProductPlatformGetEffectiveAttributeRequest,
  config?: IApiRequest,
) => {
  return post<PostProductPlatformGetEffectiveAttributeResponse>('/product/platform/getEffectiveAttribute', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })
}

/**
 * 接口 [查询商品列表--通过会员商品sku集合↗](http://47.115.168.121:3000/project/3844/interface/api/477008) 的 **请求函数**
 *
 * @分类 [商品管理↗](http://47.115.168.121:3000/project/3844/interface/api/cat_33009)
 * @请求头 `POST /product/commodity/getCommodityByCommoditySkuIdList`
 */
export const postProductCommodityGetCommodityByCommoditySkuIdList = async (
  params?: PostProductCommodityGetCommodityByCommoditySkuIdListRequest,
  config?: IApiRequest,
) => {
  return post<PostProductCommodityGetCommodityByCommoditySkuIdListResponse>(
    '/product/commodity/getCommodityByCommoditySkuIdList',
    {
      data: params,
      method: 'POST',
      ctlType: 'message',
      ...config,
    },
  )
}

export default {
  getProductShopEnterpriseGetCategoryTree,
  getProductShopStoreGetCustomerCategoryTree,
  getProductShopScoreGetCategoryTree,
  getProductShopSelfGetCustomerCategoryTree,
  getProductPlatformGetCategoryTree,
  getProductShopEnterpriseGetBrand,
  getProductShopStoreGetBrand,
  getProductShopEnterpriseGetAttributeByCategoryId,
  getProductShopStoreGetCustomerAttributeByCategoryId,
  getProductShopSelfGetCustomerAttributeByCategoryId,
  getProductShopStoreGetCommodityDetail,
}
