import { MALL_TYPE, MallInfoType, MallUrl } from '@/types/global'
import {
  getCommodityAdornManageFind,
  getCommodityAdornTopicPageFind,
  getCommodityShopFindSelfListByMemberId,
  getCommodityShopListShopByReq,
  getCommodityWebStoreWebMemberShopMain,
  getMarketingAdornGoodsListAdorn,
  GetMarketingAdornGoodsListAdornResponseDetail,
  postProductCommodityGetCommodityByCommoditySkuIdList,
  PostProductCommodityGetCommodityByCommoditySkuIdListResponse,
  getCommodityAdornWebPlatformFind,
  getCommodityWebMemberPurchaseWebMemberPurchaseMain,
} from '@apps/apis'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants/domain'

/**
 * 获取所有web商城
 * @returns
 */
export const getAllWebShopList = async (): Promise<MallInfoType[]> => {
  try {
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { data: shopList } = await commodityApi.getCommodityShopListShopByReq({
        environment: '1',
      })
      return shopList?.filter((item) => item.enabled) || []
    } else {
      const { data: shopList } = await getCommodityShopListShopByReq({
        environment: '1',
      })
      return shopList?.filter((item) => item.enabled) || []
    }
  } catch (error) {
    console.log(error, 'error')
    return []
  }
}

/**
 * 获取自营商城列表
 * @param memberId
 * @returns
 */
export const getOwnMallList = async (memberId: string): Promise<MallInfoType[]> => {
  try {
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { data: shopList } = await commodityApi.getCommodityShopFindSelfListByMemberId({ memberId })
      return shopList?.filter((item: any) => item.type === 1 && item.environment === 1) as unknown as MallInfoType[]
    } else {
      const { data: shopList } = await getCommodityShopFindSelfListByMemberId({ memberId })
      return shopList?.filter((item: any) => item.type === 1 && item.environment === 1) as unknown as MallInfoType[]
    }
  } catch (error) {
    return []
  }
}

/** 获取店铺信息 */
export const fetchShopInfo = async (storeId: string, mallId: string) => {
  try {
    const param = {
      storeId,
      shopId: mallId,
    }

    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { data } = await commodityApi.getCommodityWebStoreWebMemberShopMain(param)
      return data
    } else {
      const { data } = await getCommodityWebStoreWebMemberShopMain(param)
      return data
    }
  } catch (error) {
    return undefined
  }
}

/** 获取会员采购门户主页信息 */
export const fetchPurchaseMain = async (id: string) => {
  try {
    const param = {
      id,
    }

    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { data } = await commodityApi.getCommodityWebMemberPurchaseWebMemberPurchaseMain(param)

      return {
        ...data,
        workshopPics: data.companyPics || [],
      }
    } else {
      const { data } = await getCommodityWebMemberPurchaseWebMemberPurchaseMain(param)
      return {
        ...data,
        workshopPics: data.companyPics || [],
      }
    }
  } catch (error) {
    return undefined
  }
}

const normalizeSkuList = (
  list: PostProductCommodityGetCommodityByCommoditySkuIdListResponse,
  componentItem: any,
  ids: number[],
) => {
  return list
    .map((item, index) => ({
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
      sold: 0,
      tags: componentItem.commodityList.find((commodityItem) => commodityItem.id === item.id)?.tags || [],
      storeId: item.storeId,
    }))
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
}

const normalizeCommodityList = (
  list: GetMarketingAdornGoodsListAdornResponseDetail[],
  componentItem: any,
  ids: number[],
) => {
  return list
    .map((item, index) => ({
      id: item.id,
      sort: index + 1,
      commodityId: item.id,
      name: item.name,
      mainPic: item.mainPic,
      price: item.min,
      activityPrice: item.min,
      unitName: item.unitName,
      memberId: item.memberId,
      priceType: item.priceType || 1,
      sold: item.sold || 0,
      tags: componentItem.commodityList.find((commodityItem) => commodityItem.id === item.id)?.tags || [],
      storeId: item.storeId,
    }))
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
}

/**
 * 补充装修数据中需要重新请求数据的组件
 */
const normalizeAdornContent = async (
  adornContent: Record<string, any>,
  shopId: number,
  memberId: number | undefined,
  memberRoleId: number | undefined,
) => {
  const newAdornContent: Record<string, any> = {}
  if (adornContent && Object.keys(adornContent).length > 0) {
    const keys = Object.keys(adornContent)
    for (const key of keys) {
      const componentItem = adornContent[key]
      const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
      if (componentName === WEB_DESIGN_COMPONENT.CommodityFloor) {
        if (componentItem.commodityList && componentItem.commodityList.length > 0) {
          const ids = componentItem.commodityList.map((item) => item.commodityId)
          const param: any = {
            shopId,
            idInList: ids.join(','),
            current: '1',
            pageSize: '100',
          }
          if (memberId || memberRoleId) {
            param.memberId = memberId
            param.memberRoleId = memberRoleId
          }
          if (import.meta.env.SSR) {
            const commodityApi = await import('@/service/commodityApi')
            const { code, data } = await commodityApi.getMarketingAdornGoodsListAdorn(param)

            if (code === 1000) {
              if (data && data.data.length > 0) {
                newAdornContent[key] = {
                  ...componentItem,
                  commodityList: data.data
                    .map((item, index) => ({
                      ...item,
                      sort: index + 1,
                      priceType: item.priceType,
                      commodityId: item.id,
                      commodityName: item.name,
                      commodityPicUrl: item.mainPic,
                      commodityPrice: item.min,
                      commodityCategory: item.customerCategoryName,
                    }))
                    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
                }
              }
            } else {
              newAdornContent[key] = componentItem
            }
          } else {
            const { code, data } = await getMarketingAdornGoodsListAdorn(param)
            if (code === 1000) {
              if (data && data.data.length > 0) {
                newAdornContent[key] = {
                  ...componentItem,
                  commodityList: data.data
                    .map((item, index) => ({
                      ...item,
                      sort: index + 1,
                      priceType: item.priceType,
                      commodityId: item.id,
                      commodityName: item.name,
                      commodityPicUrl: item.mainPic,
                      commodityPrice: item.min,
                      commodityCategory: item.customerCategoryName,
                    }))
                    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
                }
              }
            } else {
              newAdornContent[key] = componentItem
            }
          }
        } else {
          newAdornContent[key] = componentItem
        }
      } else if (
        componentName === WEB_DESIGN_COMPONENT.HorizontalCommodity ||
        componentName === WEB_DESIGN_COMPONENT.VerticalCommodity
      ) {
        if (componentItem.commodityList && componentItem.commodityList.length > 0) {
          const ids = componentItem.commodityList.map((item) => item.id).join(',')
          const param: any = {
            shopId,
            idInList: ids,
            current: '1',
            pageSize: '100',
          }
          if (memberId || memberRoleId) {
            param.memberId = memberId
            param.memberRoleId = memberRoleId
          }
          if (import.meta.env.SSR) {
            if (componentItem.showType === 'normal') {
              const commodityApi = await import('@/service/commodityApi')
              const { code, data } = await commodityApi.getMarketingAdornGoodsListAdorn(param)
              if (code === 1000) {
                if (data && data.data.length > 0) {
                  newAdornContent[key] = {
                    ...componentItem,
                    commodityList: normalizeCommodityList(data.data, componentItem, ids),
                  }
                }
              } else {
                newAdornContent[key] = componentItem
              }
            } else if (componentItem.showType === 'marketing') {
              const productApi = await import('@/service/productApi')
              const idList = componentItem.commodityList.map((item) => item.id)
              const { code, data } = await productApi.postProductCommodityGetCommodityByCommoditySkuIdList(
                {
                  idList,
                },
                { ctlType: 'none' },
              )
              if (code === 1000) {
                if (data && data.length > 0) {
                  newAdornContent[key] = {
                    ...componentItem,
                    commodityList: normalizeSkuList(data, componentItem, idList),
                  }
                }
              } else {
                newAdornContent[key] = componentItem
              }
            }
          } else {
            if (componentItem.showType === 'normal') {
              const { code, data } = await getMarketingAdornGoodsListAdorn(param)
              if (code === 1000) {
                if (data && data.data.length > 0) {
                  newAdornContent[key] = {
                    ...componentItem,
                    commodityList: normalizeCommodityList(data.data, componentItem, ids),
                  }
                }
              } else {
                newAdornContent[key] = componentItem
              }
            } else if (componentItem.showType === 'marketing') {
              const idList = componentItem.commodityList.map((item) => item.id)
              const { code, data } = await postProductCommodityGetCommodityByCommoditySkuIdList(
                {
                  idList,
                },
                { ctlType: 'none' },
              )
              if (code === 1000) {
                if (data && data.length > 0) {
                  newAdornContent[key] = {
                    ...componentItem,
                    commodityList: normalizeSkuList(data, componentItem, idList),
                  }
                }
              } else {
                newAdornContent[key] = componentItem
              }
            }
          }
        } else {
          newAdornContent[key] = componentItem
        }
      } else {
        newAdornContent[key] = componentItem
      }
    }
  }
  return newAdornContent
}

/**
 * 获取商城装修
 * @param adornId
 * @returns
 */
export const getDesignConfig = async (
  adornId: number,
  shopId?: number,
  isHome?: boolean,
  memberId?: number,
  memberRoleId?: number,
) => {
  try {
    if (!adornId) {
      return []
    }
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { code, data } = await commodityApi.getCommodityAdornManageFind({
        adornId: String(adornId),
      })
      if (code === 1000 && data && data.adornContent) {
        return data.adornContent
      }
    } else {
      const { code, data } = await getCommodityAdornManageFind({
        adornId: String(adornId),
      })

      if (code === 1000 && data && data.adornContent) {
        return data.adornContent
      }
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

/**
 * 获取主门户装修
 * @param adornId
 * @returns
 */
export const getPlatformDesignConfig = async (
  adornId: number,
  shopId: number,
  memberId?: number,
  memberRoleId?: number,
) => {
  try {
    if (!adornId) {
      return []
    }
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { code, data } = await commodityApi.getCommodityAdornWebPlatformFind({
        adornId: String(adornId),
      })
      if (code === 1000 && data && data) {
        return data
      }
    } else {
      const { code, data } = await getCommodityAdornWebPlatformFind({
        adornId: String(adornId),
      })

      if (code === 1000 && data) {
        return data
      }
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

/**
 * 获取专题页装修
 * @param adornId
 * @returns
 */
export const getCpecialDesignConfig = async (
  adornId: number,
  shopId: number,
  memberId?: number,
  memberRoleId?: number,
) => {
  try {
    if (!adornId) {
      return []
    }
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { code, data } = await commodityApi.getCommodityAdornTopicPageFind({
        id: String(adornId),
      })
      if (code === 1000 && data && data.adornContent) {
        const params = await normalizeAdornContent(data.adornContent, shopId, memberId, memberRoleId)
        return { ...params, name: data.name }
      }
    } else {
      const { code, data } = await getCommodityAdornTopicPageFind({
        id: String(adornId),
      })

      if (code === 1000 && data && data.adornContent) {
        const params = await normalizeAdornContent(data.adornContent, shopId, memberId, memberRoleId)
        return {
          ...params,
          name: data.name,
        }
      }
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

/**
 * 获取商城和门户链接
 */
export const getMallUrl = (shopList: MallInfoType[]): MallUrl => {
  const enterpriseList = shopList.filter((item) => item.type === MALL_TYPE.ENTERPRISE && item.environment === 1)
  const defaultEnterprise = enterpriseList.find((item) => item.isDefault) || enterpriseList[0]
  const defaultEnterpriseUrl = defaultEnterprise
    ? `${REQUEST_HEADER}${defaultEnterprise.url}.${TOP_DOMAIN}${
        defaultEnterprise.isSelf ? `/${defaultEnterprise.memberId}` : ''
      }`
    : ''

  // 资讯门户
  const infoPortal = shopList.find(
    (item) => item.environment === 1 && item.type === MALL_TYPE.INFORMATION,
  ) as unknown as MallInfoType
  const infoUrl = infoPortal ? `${REQUEST_HEADER}${infoPortal.url}.${TOP_DOMAIN}` : ''
  // 采购门户
  const srmPortal = shopList.find(
    (item) => item.environment === 1 && item.type === MALL_TYPE.PURCHASE,
  ) as unknown as MallInfoType
  const srmUrl = srmPortal ? `${REQUEST_HEADER}${srmPortal.url}.${TOP_DOMAIN}` : ''
  // 主门户
  const mainPortal = shopList.find(
    (item) => item.environment === 1 && item.type === MALL_TYPE.MAIN_PORTAL,
  ) as unknown as MallInfoType
  const mainPortalUrl = mainPortal ? `${REQUEST_HEADER}${mainPortal.url}.${TOP_DOMAIN}` : ''
  // 物流门户
  const logisticsPortal = shopList.find(
    (item) => item.environment === 1 && item.type === MALL_TYPE.LOGISTICS,
  ) as unknown as MallInfoType
  const logisticslUrl = logisticsPortal ? `${REQUEST_HEADER}${logisticsPortal.url}.${TOP_DOMAIN}` : ''
  // 加工门户
  const processPortal = shopList.find(
    (item) => item.environment === 1 && item.type === MALL_TYPE.PROCESS,
  ) as unknown as MallInfoType
  const processlUrl = processPortal ? `${REQUEST_HEADER}${processPortal.url}.${TOP_DOMAIN}` : ''

  return {
    defaultEnterprise,
    defaultEnterpriseUrl,
    infoPortal,
    infoUrl,
    srmPortal,
    srmUrl,
    mainPortal,
    mainPortalUrl,
    logisticsPortal,
    logisticslUrl,
    processPortal,
    processlUrl,
  }
}
