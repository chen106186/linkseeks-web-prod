import { GetCommodityMobileShopMobileAppShopTypeSelectResponse } from '@apps/apis'

type ShopInfoType = GetCommodityMobileShopMobileAppShopTypeSelectResponse[0]['shopVOS'][0]

/**
 * combinationAddress 地址组装
 * @param { String[] } arr 省市区街道字符串数组
 */
export const combinationAddress = (arr) => {
  return arr.filter(Boolean).reduce((prev, curr) => prev + (curr || ''), '')
}

/**
 * combinationAddress 地址组装
 * @param { ShopInfoType } shopData 省市区街道字符串数组
 */
export const mergeSiteAndShopInfo = (shopData) => ({
  id: shopData.id as number,
  adornId: shopData?.adornId,
  shopId: shopData.id as number,
  shopLogo: shopData?.logoUrl,
  shopName: shopData.name!,
  shopType: shopData.type!,
  property: shopData?.property || 1,
  self: shopData?.self || 0,
  isMemberOperate: shopData?.isMemberOperate,
})
