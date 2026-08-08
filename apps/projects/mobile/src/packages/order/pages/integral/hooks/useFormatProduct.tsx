import React, { useCallback, useEffect, useMemo, useState } from 'react'

export type SkuItem = {
  unitName: string
  count: number
  attributeName: string
  skuid: number
  showPrice: number
  commodityUnitPriceAndPicId: number | null
}

export type OrderDataType = {
  /** 店铺id */
  storeId: number
  /** 店铺图片 */
  storePic: string
  /** 店铺名字 */
  storeName: string
  /** 供应商id */
  supplyMembersId: number
  /** 供应角色id */
  supplyMembersRoleId: number
  /** 供应商名字 */
  supplyMembersName: string
  /** 积分商品 */
  commodity: ProductItemType
}

export interface CommodityAreaItem {
  provinceCode: string
  provinceName: string
  isAllCity: boolean
  cityCode: string
  cityName: string
  isAllRegion: boolean
  regionCode: string
  regionName: string
}

export interface ProductItemType {
  /** 品牌 */
  brand: string
  /** 品类 */
  category: string
  /** 是否是会员价格 */
  isMemberPrice: 1 | 0
  /** 供应商id */
  memberId: number
  /** 供应商角色id */
  memberRoleId: number
  /** 最小起订数量 */
  minOrder: number
  /** 商品名 */
  commodityName: string
  /** 商品id */
  commodityId: number
  commodityLogo: string
  skuItem: SkuItem
  /** 配送， 1：物流， 2：自提， 3： 无需配送 */
  deliveryType: 1 | 2 | 3 | (number & {})
  unit: string
  /** 物流信息 */
  logistics: {
    company: null
    deliveryType: number
    carriageType: number
    weight: number
    useTemplate: null | boolean
    templateId: null | number
    sendAddressId: number
  }
  commodityAreaList: CommodityAreaItem[]
  isAllArea: boolean
}

/**
 * 从 route.params.product 获取立即购买的商品信息，进行格式化
 */
function useFormatProduct(options: { orderData: OrderDataType }) {
  const { orderData } = options
  const cacheOrderData = useMemo<OrderDataType>(() => orderData, [orderData])
  // const [isSetPayCode, setIsSetPayCode] = useState<boolean>(false);

  // useEffect(() => {
  //   async function getIsSetPayCodeStatus() {
  //     const { code, data } = await getMemberMobileSecurityGet();
  //     if (code === 1000) {
  //       setIsSetPayCode(!!data.hasPayPassword)
  //     }
  //   }
  //   getIsSetPayCodeStatus()
  // }, [])

  return { orderInfo: cacheOrderData }
}

export default useFormatProduct
