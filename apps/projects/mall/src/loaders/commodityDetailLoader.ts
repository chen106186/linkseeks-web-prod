import { GetProductShopStoreGetCommodityDetailResponse, getProductShopStoreGetCommodityDetail } from '@apps/apis'
import CacheManager from '@/utils/cache'
import { MallInfoType } from '@/types/global'

export interface CommodityDetailLoaderReturn {
  commodityDetail: GetProductShopStoreGetCommodityDetailResponse
  errorMsg: string
}

/**
 * 获取商品详情
 */
const fetchDetail = async (commodityId: string, mallId: number) => {
  try {
    if (!commodityId || !mallId) {
      return {
        data: undefined,
        errorMsg: '',
      }
    }
    const params = {
      commodityId,
    }
    let headers = {
      shopId: String(mallId),
    }

    if (import.meta.env.SSR) {
      const productApi = await import('@/service/productApi')
      const { code, data, message } = await productApi.getProductShopStoreGetCommodityDetail(params, { headers })
      if (code === 1000 && data) {
        return {
          commodityDetail: data,
          errorMsg: '',
        }
      } else {
        return {
          commodityDetail: undefined,
          errorMsg: message,
        }
      }
    } else {
      const { code, data, message } = await getProductShopStoreGetCommodityDetail(params, { headers })
      if (code === 1000 && data) {
        return {
          commodityDetail: data,
          errorMsg: '',
        }
      } else {
        return {
          commodityDetail: undefined,
          errorMsg: message,
        }
      }
    }
  } catch (error) {
    return {
      commodityDetail: undefined,
      errorMsg: '',
    }
  }
}

export default async ({ params }) => {
  const { commodityId } = params
  // 等待initLoader执行完成
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      const initLoading = CacheManager.get('initLoading') as boolean
      if (initLoading === false) {
        clearInterval(timer)
        resolve(true)
      }
    }, 100)
  })
  // 获取缓存中的商城信息
  const mallInfo = CacheManager.get('mallInfo') as MallInfoType
  const { commodityDetail, errorMsg } = await fetchDetail(commodityId, mallInfo?.id)

  return {
    commodityDetail,
    errorMsg,
  }
}
