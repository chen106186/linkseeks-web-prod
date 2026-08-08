import { useState, useEffect } from 'react'
import { showLoading, hideLoading } from '@apps/mobile-services/utils/taro'
import {
  getProductMobileShopStoreGetCommodityDetail,
  getProductMobileShopStoreGetCommodityDetailBySkuId,
} from '@apps/apis'

/** 企业商城api, 分商品id，和skuid 两种 */
const ENTERPRISE_MAP = {
  commodityId: getProductMobileShopStoreGetCommodityDetail,
  skuId: getProductMobileShopStoreGetCommodityDetailBySkuId,
}

type OptionType = {
  /** 1.企业商城 2.积分商城 3.渠道商城 4.渠道自有商城 5.渠道积分商城 */
  shopType: 1 | 2 | 3 | 4 | 5 | (number & {})
  /** 商品id */
  commodityId: number
  skuId?: number
  /** 渠道会员id */
  currentChannelMemberId?: number
}

const CHANNEL_MALL = 3
const CHANNEL_OWN_MALL = 4

type ProductInfoType = {
  name: string
  slogan: string
  mainPic: string
  max: number
  id: number
}

function useGetProductData(options: OptionType) {
  const [loading, setLoading] = useState<boolean>(false)
  const [productInfo, setProductInfo] = useState<ProductInfoType | null>(null)
  const service = ENTERPRISE_MAP

  useEffect(() => {
    async function getProductInfo() {
      const headers = { type: options.shopType.toString(), method: 'get', shopId: '251' }
      const currentMode = options.skuId ? 'skuId' : 'commodityId'
      const postData = options.skuId ? { commoditySkuId: options.skuId! } : { commodityId: options.commodityId }
      const withChannelData = [CHANNEL_MALL, CHANNEL_OWN_MALL].includes(options.shopType)
        ? { channelMemberId: options.currentChannelMemberId! }
        : {}
      const mergePostData = { ...postData, ...withChannelData }
      console.log(mergePostData)
      try {
        setLoading(true)
        showLoading()
        // const { data, code, message } = await request(service[currentMode], { params: mergePostData, headers })
        const { data, code, message } = await service[currentMode](mergePostData as any, { headers: headers })

        console.log(data)
        if (code === 1000) {
          setProductInfo(data)
        }
        console.log(message)
      } finally {
        hideLoading()
        setLoading(false)
      }
    }
    getProductInfo()
  }, [])

  return { loading, productInfo }
}

export default useGetProductData
