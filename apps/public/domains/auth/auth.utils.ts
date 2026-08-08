import { authService } from '@apps/services'
import { history } from '@linkseeks/router-manager'
type authType = 'add' | 'edit' | 'detail' | 'custom'

/**
 * 根据pathname，
 * @param pathname 路由地址
 * @param type 'add' | 'edit' | 'detail' | 'custom'
 * @param code 组件权限code， 当type为custom时，该属性生效
 */
export const authUrl = (pathname: string, type: authType, code?: string) => {
  return authService?.validateRouteAuth(`${pathname}/${type === 'custom' ? code : type}`)
}

/**
 * 根据pathname，
 * @param pathname 路由地址
 */
export const authFullUrl = (url: string) => {
  return authService?.validateRouteAuth(url)
}

/**
 * @param code 组件权限code， 当type为custom时，该属性生效
 */
export const customAuthUrl = (code: string) => {
  const { pathname } = new URL(window.location.href)
  const basename = history.basename
  return authUrl(pathname.replace(basename, ''), 'custom', code)
}
