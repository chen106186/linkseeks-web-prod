import { CookieStorageModule, LocalStorageModule } from '@linkseeks/storage'
import { getCookieDomain, getTopDomain } from '@apps/utils'
import { clearCache } from '@linkseeks/hooks'
import { getMemberAuthTree, getMemberLogOut, getMemberRefreshToken } from '@apps/apis'
import { message } from '@linkseeks/ui'
import { RouterManager } from '@linkseeks/router-manager'

interface AuthItemType {
  name: string
  path: string
  buttonList?: {
    name: string
    path: string
  }[]
  children?: AuthItemType[]
}

/**
 * 权限会储存两份，一份localeStorage，一份cookie
 */
export class AuthService {
  cacheKey = 'auth-router'

  AuthLocalStorage = new LocalStorageModule({
    storageKey: 'auth',
    servicePrefix: process.env.NODE_ENV + process.env.OUT_SOURCE,
  })

  AuthCookieStorage = new CookieStorageModule({
    storageKey: 'auth',
    servicePrefix: process.env.NODE_ENV + process.env.OUT_SOURCE,
  })

  authList: AuthItemType[] = []

  /**
   * hash值的权限路由表
   */
  hashAuthList: any = {}

  FLATTEN_AUTH_URL_LIST: string[] = []

  homePath: string = '/home'

  setAuth(auth: any) {
    if (process.env.OUT_SOURCE === '1') {
      this.AuthCookieStorage.setItem(auth, { domain: getCookieDomain() })
    } else {
      this.AuthLocalStorage.setItem(auth)
    }
  }

  getAuth() {
    if (process.env.OUT_SOURCE === '1') {
      return this.AuthCookieStorage.getItem()
    } else {
      return this.AuthLocalStorage.getItem()
    }
  }

  removeAuth() {
    this.AuthLocalStorage.removeItem()
    this.AuthCookieStorage.removeItem({ domain: getCookieDomain() })
  }

  /**
   * 刷新用户信息
   */
  async refreshAuth() {
    const { accessToken, refreshToken } = this.getAuth() || {}
    const headers = {
      accessToken,
      refreshToken,
    }
    const { code, data } = await getMemberRefreshToken({}, { headers })

    if (code === 1000) {
      authService.setAuth(data)
    }
  }

  async logOut() {
    await getMemberLogOut()
  }

  removeAuthRouteCache() {
    localStorage.removeItem(this.cacheKey)
    clearCache(this.cacheKey)
  }

  async initAuthList() {
    try {
      const { data, code, message: msg } = await getMemberAuthTree()
      if (code === 1000) {
        this.setAuthList(data as AuthItemType[])
        this.getFirstRoute()
        RouterManager.setHomePath(this.homePath)
        return data
      } else {
        if (msg) {
          message.destroy()
          message.error(msg, 6)
        }
        throw 'get auth list error -> interface is /member/auth/tree'
      }
    } catch (err) {}
  }

  setAuthList(authList: AuthItemType[]) {
    this.authList = authList
    this.FLATTEN_AUTH_URL_LIST = []
    this.connectFlattenAuthUrl(authList)
  }

  getAuthList() {
    return this.authList
  }

  getAuthUrlList(list: AuthItemType[]) {
    const urls: string[] = []
    if (list && list.length > 0) {
      for (const authItem of list) {
        if (authItem.children && authItem.children.length > 0) {
          urls.push(authItem.path)
          urls.push(...this.getAuthUrlList(authItem.children))
        } else {
          urls.push(authItem.path)
        }
      }
    }
    return urls
  }

  validateRouteAuth(path: string, baseRoutePrefix?: string) {
    if (baseRoutePrefix) {
      path = path.replace(baseRoutePrefix, '')
    }
    // 控制权限是否生效
    // return true
    return this.FLATTEN_AUTH_URL_LIST.includes(path)
  }

  /**
   * 获取经过权限过滤之后的第一个路由页面，作为首页
   */
  getFirstRoute() {
    const authList = this.authList
    if (authList.length) {
      const item = authList[0]
      this.homePath = item.path
    } else {
      // 当没有任何权限路由返回时
    }
  }

  private connectFlattenAuthUrl(list: AuthItemType[] | null) {
    if (list) {
      list.forEach((v) => {
        v.children && this.connectFlattenAuthUrl(v.children)
        v.path && this.FLATTEN_AUTH_URL_LIST.push(v.path)
        this.hashAuthList[v.path] = v
        if (v.buttonList) {
          v.buttonList.forEach((btn) => {
            this.FLATTEN_AUTH_URL_LIST.push(btn.path)
            this.hashAuthList[btn.path] = btn
          })
        }
      })
    }
  }
}

export const authService = new AuthService()
