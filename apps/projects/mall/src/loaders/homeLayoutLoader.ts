import { GetManageSeoByTypeResponse, getManageSeoByType } from '@apps/apis'
import CacheManager from '@/utils/cache'
import { MallInfoType } from '@/types/global'

export interface HomeLayoutLoaderReturn {
  seoInfo: GetManageSeoByTypeResponse | undefined
}

/**
 * 根据类型获取获取seo配置
 * @param type 1：平台首页；2：企业商城；4：积分商城；5：企业直采；6：物流服务；7：加工服务；8：行情资讯；
 * @returns
 */
const getMallSeo = async (type: string | undefined): Promise<GetManageSeoByTypeResponse | undefined> => {
  try {
    if (type) {
      if (import.meta.env.SSR) {
        const manageApi = await import('@/service/manageApi')
        const { data } = await manageApi.getManageSeoByType({ type })
        return data
      } else {
        const { data } = await getManageSeoByType({ type })
        return data
      }
    } else {
      return undefined
    }
  } catch (error) {
    return undefined
  }
}

/**
 * 根据商城类型获取seo配置类型
 * @param mallType 1: 企业商城；2：企业采购；3：物流门户 4：加工门户；6：平台首页
 */
const getSeoParamTypeByMallType = (mallType: number) => {
  switch (mallType) {
    case 1:
      return '2'
    case 2:
      return '5'
    case 3:
      return '6'
    case 4:
      return '7'
    case 6:
      return '1'
    default:
      return undefined
  }
}

export default async () => {
  // 等待initLoader执行完成
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      const initLoading = CacheManager.get('initLoading') as boolean
      if (initLoading === false) {
        clearInterval(timer)
        resolve(true)
      }
    }, 300)
  })
  // 获取缓存中的商城信息
  const mallInfo = CacheManager.get('mallInfo') as MallInfoType
  const seoInfo = await getMallSeo(getSeoParamTypeByMallType(mallInfo?.type))

  return {
    seoInfo,
  }
}
