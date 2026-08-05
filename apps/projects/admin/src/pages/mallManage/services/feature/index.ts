import {
  getCommodityShopListShopByReq,
  postCommoditySelfShopModelAllocationSelfShop,
  postMemberMaintenanceGetMemberDetail,
} from '@apps/apis'
import type { PostMemberMaintenanceGetMemberDetailResponse } from '@apps/apis'
import { message } from '@linkseeks/ui'
import { MallItemType } from '../types'

export const allocationSelfShop = (params) => {
  return new Promise((resolve, reject) => {
    postCommoditySelfShopModelAllocationSelfShop(params, { penetrateError: true })
      .then((res) => {
        if (res.code === 1000) {
          resolve(res)
        } else {
          message.destroy()
          message.error(res.message)
          reject({ message: res.message })
        }
      })
      .catch(() => {
        reject({ message: '保存失败' })
      })
  })
}

/**
 * 获取归属会员信息
 */
export const getMemberDetail = async (
  memberId: number,
  roleId: number,
): Promise<PostMemberMaintenanceGetMemberDetailResponse | undefined> => {
  const res = await postMemberMaintenanceGetMemberDetail({
    memberId,
    roleId,
  })
  message.destroy()
  if (res.code === 1000) {
    return res.data
  }
  return undefined
}

export interface MallUrl {
  mallItem: MallItemType
  mallUrl: string
  infoUrl: string
  srmUrl: string
  logisticsUrl: string
  processUrl: string
  srmItem: MallItemType
}

/** 获取默认联营商城信息 */
export const getEnterpriseMall = async (): Promise<MallItemType | undefined> => {
  return new Promise((resolve) => {
    getCommodityShopListShopByReq({
      type: '1',
      environment: '1',
      isSelf: 'false',
    })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const defaultEnterprise = res.data.find((item) => item.isDefault)
          if (defaultEnterprise) {
            resolve(defaultEnterprise as unknown as MallItemType)
          } else {
            resolve(res.data[0] as unknown as MallItemType)
          }
        } else {
          resolve(undefined)
        }
      })
      .catch(() => {
        resolve(undefined)
      })
  })
}

/**
 * 获取商城子域名
 * @returns
 */
export const getMallUrlMap = async (): Promise<MallUrl> => {
  const { data: shopInfo } = await getCommodityShopListShopByReq({
    environment: '1',
    isSelf: 'false',
  })
  const webMallList = shopInfo.filter((item) => item.environment === 1 && item.type === 1)
  const defaultMall = webMallList.filter((item) => item.isDefault)[0]
  let mallItem: any = {}
  if (defaultMall) {
    mallItem = defaultMall
  } else {
    if (webMallList && webMallList.length > 0) {
      mallItem = webMallList[0]
    }
  }
  const infoItem = shopInfo.find((item) => item.environment === 1 && item.type === 5) as unknown as MallItemType
  const srmItem = shopInfo.find((item) => item.environment === 1 && item.type === 2) as unknown as MallItemType
  const logisticsItem = shopInfo.find((item) => item.environment === 1 && item.type === 3) as unknown as MallItemType
  const processItem = shopInfo.find((item) => item.environment === 1 && item.type === 4) as unknown as MallItemType
  let mallUrl = 'b2b'
  let infoUrl = 'info'
  let srmUrl = 'srm'
  let logisticsUrl = 'logistics'
  let processUrl = 'process'
  if (mallItem) {
    mallUrl = mallItem.url
  }
  if (logisticsItem) {
    logisticsUrl = logisticsItem.url
  }
  if (processItem) {
    processUrl = processItem.url
  }
  if (infoItem) {
    infoUrl = infoItem.url
  }
  if (srmItem) {
    srmUrl = srmItem.url
  }
  return {
    mallUrl,
    mallItem,
    infoUrl,
    srmUrl,
    logisticsUrl,
    processUrl,
    srmItem,
  }
}
