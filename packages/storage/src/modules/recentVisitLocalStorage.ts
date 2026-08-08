import { LocalStorage } from '../adapter'
import { LocalStorageModule } from '../storageModules/LocalStorageModule'

export interface RecentVisitLocalStorageProps {
  setItem(value: any, options?: any): void
  getItem(options?: any): string | object | null
  removeItem(options?: any): void
}

export interface RecentVisitLocalOptionsProps {
  /**
   * 储存的服务前缀， 避免多环境信息错乱，将使用这个前缀作为应用前缀
   */
  servicePrefix?: string

  /**
   * 唯一的权限校验key，用于储存
   */
  authKey?: string
}

export const recentVisitLocalStorage = new LocalStorageModule({
  servicePrefix: 'Linkseeks',
  storageKey: 'RecentVisit',
  cryptoType: 'base64',
  storageInstance: new LocalStorage(),
})

export class RecentVisitLocalFactory {
  storage: RecentVisitLocalStorageProps
  constructor() {
    this.storage = recentVisitLocalStorage
  }

  setRecentVisit<T extends object>(authInfo: T, domain?: string) {
    this.storage.setItem(authInfo, { domain })
  }

  getRecentVisit() {
    try {
      const auth = this.storage.getItem()
      return auth || null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  clearRecentVisit(domain: string) {
    this.storage.removeItem({ path: '/', domain })
  }
}
