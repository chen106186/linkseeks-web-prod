import { getUrlMemberId } from '@/utils'
import {
  GetCommodityWebMemberSelfWebMemberSelfMainResponse,
  GetManageSeoByTypeResponse,
  getCommodityWebMemberSelfWebMemberSelfMain,
  getManageSeoByType,
} from '@apps/apis'

export interface InfoHomeLoaderReturn {
  seoInfo: GetManageSeoByTypeResponse | undefined
  ownInfo: GetCommodityWebMemberSelfWebMemberSelfMainResponse | undefined
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

const getMallSeo = async (): Promise<GetManageSeoByTypeResponse | undefined> => {
  try {
    if (import.meta.env.SSR) {
      const manageApi = await import('@/service/manageApi')
      const { data } = await manageApi.getManageSeoByType({ type: '8' })
      return data
    } else {
      const { data } = await getManageSeoByType({ type: '8' })
      return data
    }
  } catch (error) {
    return undefined
  }
}

export default async ({ request }) => {
  const seoInfo = await getMallSeo()
  const url = new URL(request.url)
  const memberId = getUrlMemberId(url.pathname)
  let ownInfo: GetCommodityWebMemberSelfWebMemberSelfMainResponse | undefined = undefined
  if (memberId) {
    ownInfo = await getOwnInfo(memberId)
  }

  return {
    seoInfo,
    ownInfo,
  }
}
