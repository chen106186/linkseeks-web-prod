import { getUrlMemberId } from '@/utils'
import { redirect } from 'react-router-dom'
import {
  getCommodityWebMemberSelfWebMemberSelfMain,
  GetCommodityWebMemberSelfWebMemberSelfMainResponse,
} from '@apps/apis'

export interface OwnHomeLoaderReturn {
  ownInfo: GetCommodityWebMemberSelfWebMemberSelfMainResponse | undefined
  categoryList: any[]
}

/** 获取自营商家信息 */
const getOwnInfo = async (
  memberId: number | undefined,
): Promise<GetCommodityWebMemberSelfWebMemberSelfMainResponse | undefined> => {
  try {
    if (!memberId) return undefined
    if (import.meta.env.SSR) {
      const commodityApi = await import('@/service/commodityApi')
      const { data } = await commodityApi.getCommodityWebMemberSelfWebMemberSelfMain({ memberId: String(memberId) })
      return data
    } else {
      const { data } = await getCommodityWebMemberSelfWebMemberSelfMain({ memberId: String(memberId) })
      return data
    }
  } catch (error) {
    return undefined
  }
}

export default async ({ request }) => {
  const url = new URL(request.url)
  const memberId = getUrlMemberId(url.pathname)

  if (!memberId) {
    // 返回错误信息或重定向到 NotFoundPage
    throw new Response('Not Found', { status: 404 })
  }
  const ownInfo = await getOwnInfo(memberId)

  return {
    ownInfo,
  }
}
