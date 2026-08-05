import { SessionStorage } from '../adapter'
import { SessionStorageModule } from '../storageModules/SessionStorageModule'

export interface AuthSessionStorageProps {
  setItem(value: any, options?: any): void
  getItem(options?: any): string | object | null
  removeItem(options?: any): void
}

export interface AuthSessionOptionsProps {
  /**
   * 储存的服务前缀， 避免多环境信息错乱，将使用这个前缀作为应用前缀
   */
  servicePrefix?: string

  /**
   * 唯一的权限校验key，用于储存
   */
  authKey?: string
}

export const authSessionStorage = new SessionStorageModule({
  servicePrefix: 'Linkseeks',
  storageKey: 'AUTH',
  cryptoType: 'base64',
  storageInstance: new SessionStorage(),
})

export class AuthSessionFactory {
  storage: AuthSessionStorageProps
  constructor() {
    this.storage = authSessionStorage
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
