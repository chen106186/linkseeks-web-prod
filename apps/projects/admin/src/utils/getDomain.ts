import { GlobalConfig } from '../global/config'
import { getEnv } from '@apps/utils'

/**
 * 请求头
 */
export const REQUEST_HEADER = location.protocol + '//'

/**
 * 获取以及域名
 * @param url 域名
 * @param includePort 若域名中有端口号，返回是否带上端口
 */
export const getTopDomainByHost = (url: string | undefined, includePort = false): string => {
  if (!url) return ''
  // 使用正则表达式匹配域名部分（包括可能的端口）
  const domainMatch = url.match(/^(?:https?:\/\/)?([^/:]+)(?::(\d+))?/i)

  if (domainMatch) {
    const domain = domainMatch[1] // 不带端口的域名
    const port = domainMatch[2] // 端口号

    if (includePort && port) {
      return `${domain}:${port}`
    } else {
      return domain
    }
  }

  return '' // 如果没有匹配到域名，返回空字符
}

/**
 * 获取顶域
 */
export const getTopDomain = (
  env: string = 'production',
  defaultTopDomain: string = 'lingxidev.com',
  isPort: boolean = false,
) => {
  return env !== 'development' ? getTopDomainByHost(getEnv('SITE_URL'), isPort) : defaultTopDomain
}

/**
 * 获取平台首页子域名
 */
const getPlatformSubDomain = (defaultSubDomian: string) => {
  const siteUrl = getEnv('SITE_URL') || ''
  return siteUrl.split('.')[0] || defaultSubDomian
}

/**
 * 获取平台首页域名
 */
export const getPlatformDomain = (topDomain: string, defaultSubDomian: string = 'lx-www') => {
  return `${REQUEST_HEADER}${getPlatformSubDomain(defaultSubDomian)}.${topDomain}`
}

/**
 * 会员中心域名
 */
export const getMemberCenterUrl = (topDomain: string, defaultSubDomian: string = 'lx-member') => {
  return `${REQUEST_HEADER}${defaultSubDomian}.${topDomain}`
}

export const getDefaultEnterprise = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number; property?: any }) =>
      item.environment === 1 && item.type === 1 && item.property === 1,
  )
  const defaultMall = webMallList.filter((item: any) => item.isDefault === 1)[0]
  let result: any = undefined
  if (defaultMall) {
    result = defaultMall
  } else {
    if (webMallList && webMallList.length > 0) {
      result = webMallList[0]
    }
  }
  return result
}

const enterpriseInfo = getDefaultEnterprise()
/**
 * 企业商城域名
 */
export const getEnterpriseCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${enterpriseInfo ? enterpriseInfo.url : 'lx-b2b'}.${topDomain}`
}

export const getChannelInfo = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 3,
  )
  return webMallList[0]
}

export const getIChannelInfo = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 4,
  )
  return webMallList[0]
}

const channelInfo = getChannelInfo()
const iChannelInfo = getIChannelInfo()
/**
 * 渠道商城子域名
 */
export const getChannelCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${channelInfo ? channelInfo.url : 'lx-channel'}.${topDomain}`
}

/**
 * 自有渠道商城子域名
 */
export const getIChannelCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${iChannelInfo ? iChannelInfo.url : 'lx-ichannel'}.${topDomain}`
}

const getShopInfoByType = (type: number) => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter((item: any) => item.type === type)
  return webMallList[0]
}

const infoDetail = getShopInfoByType(9)
const srmDetail = getShopInfoByType(6)
const logisticsDetail = getShopInfoByType(7)
const manufactureDetail = getShopInfoByType(8)

/**
 * 行情资讯域名
 */
export const getInfoCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${infoDetail ? infoDetail.url : 'lx-info'}.${topDomain}`
}

/**
 * 企业采购域名
 */
export const getSrmCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${srmDetail ? srmDetail.url : 'lx-srm'}.${topDomain}`
}

/**
 * 物流服务域名
 */
export const getlogisticsCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${logisticsDetail ? logisticsDetail.url : 'lx-logistics'}.${topDomain}`
}

/**
 * 加工服务域名
 */
export const getManufactureCenterUrl = (topDomain: string) => {
  return `${REQUEST_HEADER}${manufactureDetail ? manufactureDetail.url : 'lx-manufacture'}.${topDomain}`
}
