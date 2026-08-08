import useStores from '@/store/useStores'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { RouterKeys } from '@/routes'
import Router from '@/utils/router'
import { getMarketingAdornGoodsListAdorn } from '@apps/apis'

/**
 * 商品id必传，因为 获取交易记录、交易评价接口是根据商品id去查的
 */
type ParamsType = {
  commodityId?: number
  shopId?: number
  provinceCode?: string
  cityCode?: string
} & { [key: string]: any }

const useProductDetailJump = () => {
  const {
    userStore: { shopAndSite },
    locationStore: { currentCity },
  } = useStores()
  // 跳转页面默认传入作为兜底shopId
  const routerShopId = shopAndSite?.id
  // 跳转页面默认传入作为兜底shopType
  const routerShopType = 1

  const DETAIL_MAP: { [key: number]: any } = {
    [PRICE_TYPE_ENUM.SPOT]: 'commodityMerge/stocksSourcing/detail',
    [PRICE_TYPE_ENUM.CONSULTING]: 'commodityMerge/soleSourcing/detail',
    [PRICE_TYPE_ENUM.INTEGRAL]: 'commodityMerge/pointsSourcing/detail',
  }

  const jmpProductDetail = (priceType: number, params: ParamsType) => {
    switch (priceType) {
      case PRICE_TYPE_ENUM.SPOT:
      case PRICE_TYPE_ENUM.GIFT:
        Router.navigateTo(DETAIL_MAP[PRICE_TYPE_ENUM.SPOT], { ...params, routerShopId, routerShopType })
        break
      case PRICE_TYPE_ENUM.CONSULTING:
        Router.navigateTo(DETAIL_MAP[PRICE_TYPE_ENUM.CONSULTING], { ...params, routerShopId, routerShopType })
        break
      case PRICE_TYPE_ENUM.INTEGRAL:
        Router.navigateTo(DETAIL_MAP[PRICE_TYPE_ENUM.INTEGRAL], { ...params, routerShopId, routerShopType })
        break
      default:
        break
    }
  }

  const jmpProductDetailByUrl = (url: RouterKeys, params: ParamsType) => {
    Router.navigateTo(url, { ...params, routerShopId, routerShopType })
  }

  const jmpProductDetailGroup = (params) => {
    Router.navigateTo('commodityMerge/stocksSourcing/detailGroup', { ...params, routerShopId, routerShopType })
  }

  const isGroupPurchaseCommodity = (target: any) => {
    if (!target) return false

    const activityTypeList = Array.isArray(target.activityTypeList) ? target.activityTypeList : []
    const tagList = Array.isArray(target.tagList) ? target.tagList : []
    const activityList = Array.isArray(target.activityList) ? target.activityList : []

    return (
      target.groupPurchase === true ||
      activityTypeList.includes(9) ||
      tagList.includes('拼团') ||
      activityList.some((item) => item?.activityType === 9 || item?.type === '拼团')
    )
  }

  const jmpSpotDetailByCommodity = async (params: ParamsType) => {
    if (!params?.commodityId) {
      return
    }

    const targetShopId = params.shopId || shopAndSite?.id
    const targetProvinceCode = params.provinceCode ?? currentCity?.provinceCode
    const targetCityCode = params.cityCode ?? currentCity?.cityCode

    if (!targetShopId) {
      jmpProductDetail(PRICE_TYPE_ENUM.SPOT, params)
      return
    }

    try {
      const res = await getMarketingAdornGoodsListAdorn({
        idInList: String(params.commodityId),
        shopId: targetShopId,
        current: 1,
        pageSize: 1,
        provinceCode: targetProvinceCode,
        cityCode: targetCityCode,
      } as any)
      const target = res?.data?.data?.[0]

      if (res.code === 1000 && isGroupPurchaseCommodity(target)) {
        jmpProductDetailGroup(params)
        return
      }
    } catch (error) {
      // ignore and fallback to normal detail
    }

    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, params)
  }

  return {
    jmpProductDetail,
    jmpProductDetailByUrl,
    jmpProductDetailGroup,
    jmpSpotDetailByCommodity,
  }
}

export default useProductDetailJump
