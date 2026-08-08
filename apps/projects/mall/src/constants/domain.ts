import { encodeURLBase64 } from '@linkseeks/crypto/src/Crypto'
import { getEnv } from '@apps/utils/src/env'

/**
 * 会员中心域名
 */
export const MEMBER_CENTER_URL = import.meta.env.PROD ? getEnv('MEMBER_URL') : 'http://lx-platform.lingxidev.com:4396'

/**
 * 获取登录域名
 */
export const getLoginDomain = (memberCenterUrl: string, redirectUrl: string) => {
  return `${memberCenterUrl}/user/login?redirect=${encodeURLBase64(redirectUrl)}`
}

/**
 * 获取注册域名
 */
export const getRegisterDomain = (memberCenterUrl: string, redirectUrl: string) => {
  return `${memberCenterUrl}/user/register?redirect=${encodeURLBase64(redirectUrl)}`
}

/**
 * 登录域名
 */
export const getLoginDomainFn = (url: string) => {
  return getLoginDomain(MEMBER_CENTER_URL, url)
}

/**
 * 注册域名
 */
export const getRegisterDomainFn = (url: string) => {
  return getRegisterDomain(MEMBER_CENTER_URL, url)
}
