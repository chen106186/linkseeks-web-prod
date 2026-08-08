/**
 * 设置samesite的cookie， 达到多个域名登录信息共享
 */
import { getEnv } from '@apps/utils'
import Cookie from 'js-cookie'

const USER_KEY = 'AUTH'

const DOMAIN_REGXP = /(?<=\.)\w+\.(com|net|cn)$/

// pass平台设置的域名
const DOMAIN = getEnv('SITE_URL')

export const setUserCookie = (data: any) => {
  Cookie.set(USER_KEY, JSON.stringify(data), { domain: getDomainUrl(DOMAIN) })
}

export const getUserCookie = () => {
  try {
    return JSON.parse(Cookie.get(USER_KEY))
  } catch (err) {
    return {}
  }
}

export const removeUserCoookie = () => {
  Cookie.remove(USER_KEY)
}

/**
 * 从域名中获取主域名， 只能获取常用的几种, 如需扩展 可在上方正则加入
 */
function getDomainUrl(url: string) {
  const result = url.match(DOMAIN_REGXP)
  if (result.length > 0) {
    return result[0]
  } else {
    return ''
  }
}
