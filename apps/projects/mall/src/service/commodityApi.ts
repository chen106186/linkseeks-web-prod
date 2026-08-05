import { IApiRequest, get } from '@/utils/request'
import {
  GetCommodityAdornManageFindRequest,
  GetCommodityAdornManageFindResponse,
  GetCommodityAdornTopicPageFindRequest,
  GetCommodityAdornTopicPageFindResponse,
  GetCommodityAdornWebPlatformFindRequest,
  GetCommodityAdornWebPlatformFindResponse,
  GetCommodityShopFindSelfListByMemberIdRequest,
  GetCommodityShopFindSelfListByMemberIdResponse,
  GetCommodityShopListShopByReqRequest,
  GetCommodityShopListShopByReqResponse,
  GetCommodityWebMemberPurchaseWebMemberPurchaseMainRequest,
  GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse,
  GetCommodityWebMemberSelfWebMemberSelfMainRequest,
  GetCommodityWebMemberSelfWebMemberSelfMainResponse,
  GetCommodityWebStoreWebMemberShopMainRequest,
  GetCommodityWebStoreWebMemberShopMainResponse,
  GetMarketingAdornActivityGoodsAdornRequest,
  GetMarketingAdornActivityGoodsAdornResponse,
  GetMarketingAdornGoodsListAdornRequest,
  GetMarketingAdornGoodsListAdornResponse,
} from '@apps/apis'

/**
 * 接口 [根据查询条件获取商城↗](http://47.115.168.121:3000/project/1523/interface/api/183658) 的 **请求函数**
 *
 * @分类 [商城↗](http://47.115.168.121:3000/project/1523/interface/api/cat_23845)
 * @请求头 `GET /commodity/shop/listShopByReq`
 */
export const getCommodityShopListShopByReq = async (
  params?: GetCommodityShopListShopByReqRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityShopListShopByReqResponse>('/commodity/shop/listShopByReq', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [根据会员ID获取自营商城列表↗](http://47.115.168.121:3000/project/1523/interface/api/183602) 的 **请求函数**
 *
 * @分类 [商城↗](http://47.115.168.121:3000/project/1523/interface/api/cat_23845)
 * @请求头 `GET /commodity/shop/findSelfListByMemberId`
 */
export const getCommodityShopFindSelfListByMemberId = async (
  params?: GetCommodityShopFindSelfListByMemberIdRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityShopFindSelfListByMemberIdResponse>('/commodity/shop/findSelfListByMemberId', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [自营门户主页↗](http://47.115.168.121:3000/project/1523/interface/api/183842) 的 **请求函数**
 *
 * @分类 [web - 会员自营门户↗](http://47.115.168.121:3000/project/1523/interface/api/cat_23852)
 * @请求头 `GET /commodity/web/memberSelfWeb/memberSelfMain`
 */
export const getCommodityWebMemberSelfWebMemberSelfMain = async (
  params?: GetCommodityWebMemberSelfWebMemberSelfMainRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityWebMemberSelfWebMemberSelfMainResponse>('/commodity/web/memberSelfWeb/memberSelfMain', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [店铺门户主页↗](http://47.115.168.121:3000/project/1523/interface/api/183766) 的 **请求函数**
 *
 * @分类 [web - 会员店铺门户↗](http://47.115.168.121:3000/project/1523/interface/api/cat_23850)
 * @请求头 `GET /commodity/web/storeWeb/memberShopMain`
 */
export const getCommodityWebStoreWebMemberShopMain = async (
  params?: GetCommodityWebStoreWebMemberShopMainRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityWebStoreWebMemberShopMainResponse>('/commodity/web/storeWeb/memberShopMain', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [采购门户主页↗](http://47.115.168.121:3000/project/5944/interface/api/840147) 的 **请求函数**
 *
 * @分类 [web - 会员采购门户↗](http://47.115.168.121:3000/project/5944/interface/api/cat_44681)
 * @请求头 `GET /commodity/web/memberPurchaseWeb/memberPurchaseMain`
 */
export const getCommodityWebMemberPurchaseWebMemberPurchaseMain = async (
  params?: GetCommodityWebMemberPurchaseWebMemberPurchaseMainRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse>(
    '/commodity/web/memberPurchaseWeb/memberPurchaseMain',
    {
      params,
      method: 'GET',
      ctlType: 'none',
      ...config,
    },
  )
}

/**
 * 接口 [回显活动商品（装修）↗](http://47.115.168.121:3000/project/3816/interface/api/468181) 的 **请求函数**
 *
 * @分类 [装修↗](http://47.115.168.121:3000/project/3816/interface/api/cat_32791)
 * @请求头 `GET /marketing/adorn/activityGoodsAdorn`
 */
export const getMarketingAdornActivityGoodsAdorn = async (
  params?: GetMarketingAdornActivityGoodsAdornRequest,
  config?: IApiRequest,
) => {
  return get<GetMarketingAdornActivityGoodsAdornResponse>('/marketing/adorn/activityGoodsAdorn', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [商品列表（装修）↗](http://47.115.168.121:3000/project/3816/interface/api/468209) 的 **请求函数**
 *
 * @分类 [装修↗](http://47.115.168.121:3000/project/3816/interface/api/cat_32791)
 * @请求头 `GET /marketing/adorn/goodsListAdorn`
 */
export const getMarketingAdornGoodsListAdorn = async (
  params?: GetMarketingAdornGoodsListAdornRequest,
  config?: IApiRequest,
) => {
  return get<GetMarketingAdornGoodsListAdornResponse>('/marketing/adorn/goodsListAdorn', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [获取↗](http://47.115.168.121:3000/project/3774/interface/api/713594) 的 **请求函数**
 *
 * @分类 [装修管理↗](http://47.115.168.121:3000/project/3774/interface/api/cat_32349)
 * @请求头 `GET /commodity/adorn/manage/find`
 */
export const getCommodityAdornManageFind = async (
  params?: GetCommodityAdornManageFindRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityAdornManageFindResponse>('/commodity/adorn/manage/find', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [获取↗](http://47.115.168.121:3000/project/3774/interface/api/763945) 的 **请求函数**
 *
 * @分类 [装修专题页管理↗](http://47.115.168.121:3000/project/3774/interface/api/cat_42209)
 * @请求头 `GET /commodity/adorn/topicPage/find`
 */
export const getCommodityAdornTopicPageFind = async (
  params?: GetCommodityAdornTopicPageFindRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityAdornTopicPageFindResponse>('/commodity/adorn/topicPage/find', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

/**
 * 接口 [获取WEB平台首页装修↗](http://47.115.168.121:3000/project/5818/interface/api/804195) 的 **请求函数**
 *
 * @分类 [装修 - WEB平台首页装修↗](http://47.115.168.121:3000/project/5818/interface/api/cat_43645)
 * @请求头 `GET /commodity/adorn/webPlatform/find`
 */
export const getCommodityAdornWebPlatformFind = async (
  params?: GetCommodityAdornWebPlatformFindRequest,
  config?: IApiRequest,
) => {
  return get<GetCommodityAdornWebPlatformFindResponse>('/commodity/adorn/webPlatform/find', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
}

export default {
  getCommodityShopListShopByReq,
  getCommodityShopFindSelfListByMemberId,
  getCommodityWebMemberSelfWebMemberSelfMain,
  getCommodityWebStoreWebMemberShopMain,
  getMarketingAdornActivityGoodsAdorn,
  getCommodityAdornManageFind,
  getMarketingAdornGoodsListAdorn,
}
