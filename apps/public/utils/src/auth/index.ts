import { authService } from '@apps/services'

type authType = 'add' | 'edit' | 'detail' | 'custom'

/**
 * 根据pathname，
 * @param pathname 路由地址
 * @param type 'add' | 'edit' | 'detail' | 'custom'
 * @param code 组件权限code， 当type为custom时，该属性生效
 */
export const authUrl = (pathname: string, type: authType, code?: string) => {
  const { auth } = authService.getAuth()
  return auth.includes(`${pathname}/${type === 'custom' ? code : type}`)
}
