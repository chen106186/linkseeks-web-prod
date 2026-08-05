import { CookieStorageModule, LocalStorageModule } from '@linkseeks/storage'

/**
 * 所有平台的权限控制
 * 会存一份cookie，同时也会存一份本地
 * key会有前缀，前缀是当前环境，避免测试环境和uat环境混乱
 */
export class AuthService {
  AuthLocalStorage = new LocalStorageModule({
    storageKey: 'auth',
    servicePrefix: process.env.NODE_ENV,
  })

  AuthCookieStorage = new CookieStorageModule({
    storageKey: 'auth',
    servicePrefix: process.env.NODE_ENV,
  })

  routeAuthList: string[]

  /**
   * 用户信息
   */
  setAuth(authInfo: any) {
    this.AuthLocalStorage.setItem({
      ...authInfo,
    })
  }

  getAuth() {
    return this.AuthLocalStorage.getItem()
  }

  /**
   * 路由权限和，用户权限信息分开
   */
  setRouteAuth(authList: string[]) {
    const result = this.getAuth()
    this.AuthLocalStorage.setItem({
      ...result,
      routeAuthList: authList,
    })
  }

  getRouteAuth() {
    return this.getAuth().routeAuthList
  }

  validateRouteAuth(path: string, currentRouter: any) {
    // 内页校验
    // 是通过按钮权限来区分的
    // @todo 如何区分 按钮权限

    // 临时逻辑，如果本地按钮配置了，则默认认为有该权限
    if (currentRouter && currentRouter.menuMeta === false) {
      return true
    }
    // 普通路径校验
    return !!this.getRouteAuth().includes(path)
  }

  removeAuth() {
    this.AuthLocalStorage.removeItem()
  }
}

export const authService = new AuthService()
