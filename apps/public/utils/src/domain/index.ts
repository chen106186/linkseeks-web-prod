import { getEnv } from '../env'
/**
 * 获取一级域名
 * @param url 域名
 * @param includePort 若域名中有端口号，返回是否带上端口
 */
export const getTopDomainByHost = (url: string | undefined, includePort = false): string => {
  if (!url) return ''
  // 使用 URL 构造函数来解析 URL
  const parsedUrl = new URL(url)

  // 获取主域名部分，不包括子域名
  const domainParts = parsedUrl.hostname.split('.')

  // 如果主域名部分有两个以上的部分，取子域名后面的部分
  const mainDomain = domainParts.slice(-(domainParts.length - 1)).join('.')

  // 获取端口号
  const port = parsedUrl.port

  if (includePort && port) {
    return `${mainDomain}:${port}`
  } else {
    return mainDomain
  }
}

/**
 * 通过截取域名获取主域名
 */
export const getTopDomain = (url: string | undefined, includePort = false): string => {
  if (!url) return ''
  return getTopDomainByHost(url, includePort)
}

export const getCookieDomain = () => {
  if (import.meta.env.SSR) {
    return ''
  }
  const hostname = window.location.hostname

  if (hostname === 'localhost' || /^127(?:\.[0-9]+){0,2}\.[0-9]+$/.test(hostname)) {
    return 'localhost'
  }

  // IP 地址直接返回，不做子域名截取
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return hostname
  }

  const parts = hostname.split('.')
  // 两段域名（如 yunjinglian.com）直接返回本身，不能 shift 成 TLD "com"，
  // 否则浏览器拒绝给顶级域名设 cookie，导致登录态存不下来。
  // 三段及以上（sub.example.com）去掉最左边子域名，返回上一级 example.com。
  if (parts.length <= 2) {
    return hostname
  }
  parts.shift()
  return parts.join('.')
}

/**
 * 获取商城访问链接
 * @param url 商城子域名
 * @param memberId 可选参数，如果是自营商城，则传入会员id
 */
export const getMallLink = (url: string, memberId?: number) => {
  if (!url) return ''

  return `${location.protocol + '//'}${url}.${getTopDomainByHost(getEnv('SITE_URL'), true)}${
    memberId ? `/${memberId}` : ''
  }`
}
