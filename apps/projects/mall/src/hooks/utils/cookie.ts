import { getRequestCookie } from '@/utils/cache'

/**
 * 根据request中cookie获取对应cookie值
 * @param request
 * @param key
 */
export const getCookieByKey = (request: any, key: string) => {
  const cookie = request.headers.get('cookie')
  if (cookie) {
    return getRequestCookie(key, cookie)
  }
  return undefined
}
