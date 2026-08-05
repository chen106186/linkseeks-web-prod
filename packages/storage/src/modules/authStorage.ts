import { CookieStorage } from '../adapter'
import { CookieStorageModule } from '../storageModules/CookieStorageModule'

export interface AuthStorageProps {
  setItem(value: any, options?: any): void
  getItem(options?: any): string | object | null
  removeItem(options?: any): void
}

export interface AuthOptionsProps {
  /**
   * 储存的服务前缀， 避免多环境信息错乱，将使用这个前缀作为应用前缀
   */
  servicePrefix?: string

  /**
   * 唯一的权限校验key，用于储存
   */
  authKey?: string
}

export const authStorage = new CookieStorageModule({
  servicePrefix: 'Linkseeks',
  storageKey: 'AUTH',
  cryptoType: 'base64',
  storageInstance: new CookieStorage(),
})

export class AuthFactory {
  storage: AuthStorageProps
  constructor() {
    this.storage = authStorage
  }

  setAuth<T extends object>(authInfo: T, domain?: string) {
    this.storage.setItem(authInfo, { domain })
  }

  getAuth() {
    try {
      const auth = this.storage.getItem()
      return auth || null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  removeAuth(domain: string) {
    this.storage.removeItem({ path: '/', domain })
  }
}
