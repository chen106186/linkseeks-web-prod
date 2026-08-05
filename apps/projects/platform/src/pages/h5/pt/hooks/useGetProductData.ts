import { useState, useEffect } from 'react'
import {
  getProductMobileShopStoreGetCommodityDetail,
  getProductMobileShopStoreGetCommodityDetailBySkuId,
} from '@apps/apis'

type OptionType = {
  /** 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城 */
  shopType: 1 | 2 | 3 | 4 | 5 | (number & {})
  /** 商品id */
  commodityId: number
  skuId?: number
  shopId: number
  /** 渠道会员id */
  currentChannelMemberId?: number
}

type ProductInfoType = {
  name: string
  slogan: string
  mainPic: string
  max: number
}

function useGetProductData(options: OptionType) {
  const [loading, setLoading] = useState<boolean>(false)
  const [productInfo, setProductInfo] = useState<ProductInfoType | null>(null)
  const service = {
    commodityId: getProductMobileShopStoreGetCommodityDetail,
    skuId: getProductMobileShopStoreGetCommodityDetailBySkuId,
  }

  useEffect(() => {
    async function getProductInfo() {
      const currentMode = options.skuId ? 'skuId' : 'commodityId'
      const postData = options.skuId ? { commoditySkuId: options.skuId! } : { commodityId: options.commodityId }
      try {
        setLoading(true)
        const { data, code, message } = await service[currentMode]?.(postData as any, {
          headers: { shopId: options?.shopId },
        })
        if (code === 1000) {
          setProductInfo(data)
        }
      } finally {
        setLoading(false)
      }
    }
    getProductInfo()
  }, [])

  return { loading, productInfo }
}

export default useGetProductData
