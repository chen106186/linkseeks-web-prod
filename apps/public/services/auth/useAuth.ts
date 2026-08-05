import { authService } from './index.service'

export interface AuthInfo {
  accessToken: string
  refreshToken: string
  userId: number
  memberId: number
  memberRoleId: number
  token: string
  account: string
  name: string
  /** 会员名称 */
  memberName: string
  /** 角色名称 */
  roleName: string
  /** 用户名称 */
  userName: string
  /** 手机号码 */
  phone: string
  /**
   * token过期时间，单位是分钟
   */
  tokenExpireMinutes: number

  memberType: number

  [key: string]: any
}

const useAuth = () => {
  const setAuth = (auth: AuthInfo) => {
    authService.setAuth(auth)
  }

  const removeAuth = () => {
    authService.removeAuth()
    authService.removeAuthRouteCache()
  }

  const getAuth = (): AuthInfo | null => {
    return authService.getAuth()
  }

  return {
    getAuth,
    setAuth,
    removeAuth,
  }
}

export default useAuth
