import { useEffect, useMemo, useState } from 'react'
import { postMarketingWebActivityGoodsDetailTag } from '@apps/apis'

/**
 * 企业商城
 */
const SHOP_TYPE_ENTERPRISE = 1

type OptionsType = {
  productInfo: any
  shopId: number
  skuId?: number
  shopType?: number
}

interface RootObject {
  preferentialSkuId: number
  promotionPrice: number
  preferentialPrice: number
  seckillEndTime?: any
  canUseCoupon: number
  tagList: string[]
  tagDetailList: TagDetailList[]
  couponList: CouponList[]
}

interface CouponList {
  couponId: number
  belongType: number
  name: string
  type: number
  typeName: string
  denomination: number
  useConditionMoney: number
  effectiveType: number
  effectiveTypeName: string
  effectiveTimeStart?: number
  effectiveTimeEnd?: number
  invalidDay?: number
  brandIds?: any
  categoryIds?: any
  productIds?: any
  completeReceive: number
}

interface TagDetailList {
  activityId: number
  belongType: number
  activityType: number
  startTime: number
  endTime: number
  preferentialTag: string
  preferentialTagDesc: string
  jumpToProductPage: number
  canUesCoupon: number
}

function useGetMarketingCampaign(options: OptionsType) {
  const { productInfo, shopId, skuId, shopType } = options
  const [marketingData, setMarketingData] = useState<RootObject | null>(null)

  // 获取商品活动相关
  const getMarketingCampaign = async (params: {
    shopId: number
    categoryId: number
    brandId: number
    productId: number
    memberId: number
    roleId: number
    skuId?: number
    filterGroup: boolean
    commodityType: number
  }) => {
    const { data, code } = await postMarketingWebActivityGoodsDetailTag(params, { ctlType: 'none' })
    if (code === 1000) {
      setMarketingData(data)
      return data
    }
    return data
  }

  useEffect(() => {
    if (!options.productInfo) {
      return
    }
    async function getData() {
      await getMarketingCampaign({
        shopId: shopId!,
        categoryId: productInfo?.customerCategoryId!,
        brandId: productInfo?.brandId!,
        productId: productInfo?.id!,
        memberId: productInfo?.memberId!,
        roleId: productInfo?.memberRoleId!,
        skuId,
        filterGroup: false,
        commodityType: shopType === SHOP_TYPE_ENTERPRISE ? 1 : 2,
      })
    }
    getData()
  }, [productInfo])

  /** 拼团数据 */
  const groupPurchasingData = useMemo(() => {
    if (!marketingData) {
      return null
    }
    return {
      activityId: marketingData.tagDetailList?.[0]?.activityId,
      groupPurchasingPrice: marketingData.preferentialPrice,
      groupNum: +(marketingData.tagDetailList?.[0]?.preferentialTagDesc?.match(/(\d+)/)?.[0] || 0),
    }
  }, [marketingData])

  return { getMarketingCampaign, groupPurchasingData, marketingData }
}

export default useGetMarketingCampaign
