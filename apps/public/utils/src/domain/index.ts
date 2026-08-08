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
  // 获取当前页面的主机名，包括可能的端口号
  const hostname = window.location.hostname

  // 如果主机名是 localhost，则返回 localhost
  if (hostname === 'localhost' || /^127(?:\.[0-9]+){0,2}\.[0-9]+$/.test(hostname)) {
    return 'localhost'
  }

  // 分割主机名为子域和顶级域名
  const parts = hostname.split('.')

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
