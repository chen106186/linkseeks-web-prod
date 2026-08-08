import { LAYOUT_TYPE, MallInfoType, NavItemType } from '@/types/global'
import {
  GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse,
  GetCommodityWebStoreWebMemberShopMainResponse,
} from '@apps/apis'
import { getUrlMemberId } from '@/utils'
import CacheManager from '@/utils/cache'
import { decodeURLBase64 } from '@linkseeks/crypto'
import {
  fetchShopInfo,
  getAllWebShopList,
  getOwnMallList,
  getDesignConfig,
  getPlatformDesignConfig,
  getMallUrl,
  fetchPurchaseMain,
} from '@/hooks/utils/init'
import { getCookieByKey } from '@/hooks/utils/cookie'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'

export default async ({ params, request }) => {
  const url = new URL(request.url)
  CacheManager.set('initLoading', true)
  // 缓存用户accessToken
  const authKey = import.meta.env.DEV ? 'development1_auth' : 'production1_auth'
  const cookieUserInfo = getCookieByKey(request, authKey)
  let userInfo: any = undefined
  const language = getCookieByKey(request, 'LX_LANG')
  if (cookieUserInfo) {
    userInfo = JSON.parse(decodeURIComponent(cookieUserInfo))
    CacheManager.set('accessToken', userInfo.accessToken)
  } else {
    userInfo = undefined
    CacheManager.set('accessToken', undefined)
  }

  if (language) {
    CacheManager.set('language', decodeURLBase64(language))
  } else {
    CacheManager.set('language', undefined)
  }

  // 当前子域名
  let subDomain = url.host.split('.')[0]
  const shopList = await getAllWebShopList()
  let layoutType = LAYOUT_TYPE.joint
  let mallInfo: MallInfoType | undefined = undefined
  let mallList: MallInfoType[] = []

  const mallUrl = getMallUrl(shopList)

  const isOwnRoute = params?.memberId && getUrlMemberId(url.pathname)

  if (shopList && shopList.length > 0) {
    // 如果有自定义二级域名路由，则使用自定义二级域名路由
    if (params?.subDomain) {
      subDomain = params?.subDomain
    }
    // 根据子域名匹配商城
    const matchSubDomainShopList = shopList.filter(
      (item) => item.url && item.url.toLocaleLowerCase() === subDomain,
    ) as MallInfoType[]

    if (matchSubDomainShopList && matchSubDomainShopList.length > 0) {
      if (isOwnRoute) {
        // 匹配不到对应的会员自营商城则默认取第一个自营商城
        mallInfo = matchSubDomainShopList.find((item) => String(item.memberId) === String(params?.memberId))
      } else {
        const defaultMall = matchSubDomainShopList.find((item) => item.isDefault) || matchSubDomainShopList[0]
        if (!defaultMall.isSelf) {
          mallInfo = defaultMall
        } else {
          const ownList = matchSubDomainShopList.filter((item) => item.isSelf)
          if (ownList.length > 0) {
            mallInfo = ownList[0]
          }
        }
      }
    } else {
      // 本地用localhost访问的情况下处理
      // ----如果链接中带有memberId则表示是自营商城
      if (isOwnRoute) {
        layoutType = LAYOUT_TYPE.own
        const ownList = shopList.filter((item) => item.isSelf)
        mallInfo = ownList.find((item) => String(item.memberId) === String(params?.memberId))
      } else {
        mallInfo =
          shopList.find((item) => item.isDefault && item.type === 1 && item.environment === 1 && !item.isSelf) ||
          shopList.find((item) => item.type === 1 && item.environment === 1 && !item.isSelf) ||
          shopList[0]
      }
    }
  }

  let navList: NavItemType[] = []
  let designConfig: Record<string, any> | undefined = {}
  let footerDesignConfig: Record<string, any> | undefined = {}
  let shopInfo:
    | GetCommodityWebStoreWebMemberShopMainResponse
    | GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse
    | undefined = undefined

  if (mallInfo) {
    switch (mallInfo.type) {
      // 企业商城
      case 1:
        if (url.pathname.indexOf('shop') > -1) {
          layoutType = LAYOUT_TYPE.shop
          mallList = shopList.filter((item) => item.type === 1 && item.environment === 1 && !item.isSelf)
        } else {
          if (mallInfo.isSelf) {
            layoutType = LAYOUT_TYPE.own

            // 如果链接中带有memberId则表示是自营商城
            if (isOwnRoute) {
              // 自营商城列表
              mallList = await getOwnMallList(params?.memberId)
            }
          } else {
            layoutType = LAYOUT_TYPE.joint
            mallList = shopList.filter((item) => item.type === 1 && item.environment === 1 && !item.isSelf)
          }
        }
        break
      // 企业采购
      case 2:
        if (url.pathname.indexOf('shopIndex') > -1) {
          layoutType = LAYOUT_TYPE.shopIndex
        } else {
          layoutType = LAYOUT_TYPE.srm
        }
        break
      // 物流门户
      case 3:
        layoutType = LAYOUT_TYPE.logistics
        break
      // 加工门户
      case 4:
        layoutType = LAYOUT_TYPE.process
        break
      // 主门户
      case 6:
        layoutType = LAYOUT_TYPE.mainPortal
        break
    }
    // 缓存当前商城信息
    CacheManager.set('mallInfo', mallInfo)

    if (mallInfo.isSelf) {
      // 获取自营商城装修
      if (mallInfo?.memberId && mallInfo?.memberRoleId) {
        const isOwnHome = url.pathname === `/${mallInfo?.memberId}`
        designConfig = await getDesignConfig(
          mallInfo.adornId,
          mallInfo.id,
          isOwnHome,
          mallInfo?.memberId,
          mallInfo?.memberRoleId,
        )
        if (designConfig && designConfig[WEB_DESIGN_COMPONENT.Footer]) {
          footerDesignConfig = designConfig[WEB_DESIGN_COMPONENT.Footer]
        }
      }
    } else {
      if (params?.storeId) {
        const isShopHome = url.hostname.indexOf(`/shop/${params?.storeId}`) > -1
        // 获取联营商城装修
        if (mallInfo.adornId) {
          const jointDesignConfig = await getDesignConfig(mallInfo.adornId, mallInfo.id, false)
          if (jointDesignConfig && jointDesignConfig[WEB_DESIGN_COMPONENT.Footer]) {
            footerDesignConfig = jointDesignConfig[WEB_DESIGN_COMPONENT.Footer]
          }
        }
        // 获取店铺信息
        shopInfo = await fetchShopInfo(params?.storeId, String(mallInfo.id))
        if (shopInfo && shopInfo.adornId && shopInfo.memberId && shopInfo.roleId) {
          // 获取店铺装修
          designConfig = await getDesignConfig(
            shopInfo.adornId,
            mallInfo.id,
            isShopHome,
            shopInfo.memberId,
            shopInfo.roleId,
          )
        }
      } else if (params.purchaserId) {
        // 获取采购门户
        shopInfo = await fetchPurchaseMain(params.purchaserId)
        // 缓存当前采购商主页
        CacheManager.set('purchaseInfo', shopInfo)
      } else {
        // 获取联营商城装修
        if (mallInfo.type === 1 && mallInfo.adornId) {
          designConfig = await getDesignConfig(mallInfo.adornId, mallInfo.id, url.pathname === '/')
          if (designConfig && designConfig[WEB_DESIGN_COMPONENT.Footer]) {
            footerDesignConfig = designConfig[WEB_DESIGN_COMPONENT.Footer]
          }
        } else if (mallInfo.type === 6 && mallInfo.adornId) {
          if (mallUrl && mallUrl.defaultEnterprise) {
            const jointDesignConfig = await getDesignConfig(
              mallUrl.defaultEnterprise.adornId,
              mallUrl.defaultEnterprise.id,
              false,
            )
            if (jointDesignConfig && jointDesignConfig[WEB_DESIGN_COMPONENT.Footer]) {
              footerDesignConfig = jointDesignConfig[WEB_DESIGN_COMPONENT.Footer]
            }
          }
          designConfig = await getPlatformDesignConfig(mallInfo.adornId, mallInfo.id)
        }
      }
    }
  }

  CacheManager.set('initLoading', false)

  return {
    params,
    href: url.href,
    search: url.search,
    pathname: url.pathname,
    layoutType,
    mallInfo,
    mallList,
    userInfo,
    navList,
    designConfig,
    footerDesignConfig,
    shopInfo,
    mallUrl,
    language: language ? decodeURLBase64(language) : undefined,
  }
}
