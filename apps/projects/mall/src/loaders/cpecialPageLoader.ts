import { MallInfoType } from '@/types/global'
import CacheManager from '@/utils/cache'
import { getCpecialDesignConfig } from '@/hooks/utils/init'

export interface CpecialPageLoaderReturn {
  designConfig: Record<string, any> | undefined
}

export default async ({ params, request }) => {
  const url = new URL(request.url)
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
  let designConfig: Record<string, any> | undefined = {}
  if (mallInfo && params.id) {
    designConfig = await getCpecialDesignConfig(params.id, mallInfo.id, mallInfo?.memberId, mallInfo?.memberRoleId)
  }

  return {
    designConfig,
  }
}
