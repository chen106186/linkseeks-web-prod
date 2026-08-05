import { getTopDomain } from '@apps/utils'
import { getEnv } from '@apps/utils/src/env'
/**
 * 请求头
 */
export const REQUEST_HEADER =
  typeof window === 'undefined' ? new URL(getEnv('SITE_URL')).protocol + '//' : window.location.protocol + '//'

/**
 * 一级域名（包含端口）
 */
export const TOP_DOMAIN = getTopDomain(getEnv('SITE_URL'), true)

/**
 * 一级域名（不包含端口）
 */
export const TOP_DOMAIN_NO_PORT = getTopDomain(getEnv('SITE_URL'))
