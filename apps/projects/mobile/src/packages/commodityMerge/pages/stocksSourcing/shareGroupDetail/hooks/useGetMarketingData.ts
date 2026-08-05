import {
  postMarketingMobileActivityGoodsDetailTag,
  PostMarketingMobileActivityGoodsDetailTagResponse,
} from '@apps/apis'
import { useEffect, useMemo, useState } from 'react'

type OptionsType = {
  productInfo: any
  shopId: number
  skuId?: number
  /** 是否是拼团 */
}

// type MarketingCampaignData = MarketingCampaignType & {
//   /**
//    * 秒杀活动结束时间
//    */
//   seckillEndTime: number,
// };

function useGetMarketingCampaign(options: OptionsType) {
  const { productInfo, shopId } = options
  // const [marketingCampaign, setMarketingCampaign] = useState<MarketingCampaignData | null>(null);
  const [marketingData, setMarketingData] = useState<PostMarketingMobileActivityGoodsDetailTagResponse | null>(null)

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
    commodityType?: string
  }) => {
    const { data, code } = await postMarketingMobileActivityGoodsDetailTag(params)
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
        brandId: productInfo?.brandId,
        productId: productInfo?.id!,
        memberId: productInfo?.memberId!,
        roleId: productInfo?.memberRoleId!,
        skuId: options.skuId || undefined,
        filterGroup: false,
        commodityType: '1',
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
      activityId: marketingData.tagDetailList?.[0].activityId,
      groupPurchasingPrice: marketingData.preferentialPrice,
      groupNum: +(marketingData.tagDetailList?.[0]?.preferentialTagDesc?.match(/(\d+)/)?.[0] || 0),
    }
  }, [marketingData])

  return { getMarketingCampaign, groupPurchasingData, marketingData }
}

export default useGetMarketingCampaign
