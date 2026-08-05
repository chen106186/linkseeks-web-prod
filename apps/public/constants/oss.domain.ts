import { authUrl } from '@@/utils/src/auth'

/**
 * 将 apps/projects 下面的oss域名统一成配置文件
 * 2025-05-27
 * likai
 */
export const LINGXI_SAAS_OSS_DOMAIN = 'https://lingxi-saas-b2b.oss-cn-shenzhen.aliyuncs.com'
export const SSY_O1_OSS_DOMAIN = 'https://shushangyun01.oss-cn-shenzhen.aliyuncs.com'
export const SSY_OSS_DOMAIN = 'https://shushangyun-lingxi.oss-cn-shenzhen.aliyuncs.com'
export const LINKSEEKS_OSS_DOMAIN = 'http://linkseeks.oss-cn-hangzhou.aliyuncs.com'

// OSS 文件的统一域名
export const LINGXI_MINI_OSS_DOMAIN = 'https://lingxi-mini.oss-cn-hangzhou.aliyuncs.com'
// 获取OSS域名的路径
const ossConfigs: any = {
  ssyOne: SSY_O1_OSS_DOMAIN,
  linkseeks: LINKSEEKS_OSS_DOMAIN,
  lingxi: LINGXI_MINI_OSS_DOMAIN,
}
export const getOssUrlPath = (path: string, url: string = LINGXI_MINI_OSS_DOMAIN) => {
  return `${url}${path}`
}
