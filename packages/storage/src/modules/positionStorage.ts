import { CookieStorage } from '../adapter'
import { CookieStorageModule } from '../storageModules/CookieStorageModule'

export interface PositionStorageProps {
  setItem(value: any, options?: any): void
  getItem(options?: any): string | object | null
  removeItem(options?: any): void
}

export interface PositionOptionsProps {
  /**
   * 储存的服务前缀， 避免多环境信息错乱，将使用这个前缀作为应用前缀
   */
  servicePrefix?: string

  /**
   * 唯一的权限校验key，用于储存
   */
  authKey?: string
}

export const positionStorage = new CookieStorageModule({
  servicePrefix: 'Linkseeks',
  storageKey: 'POSITION_INFO',
  cryptoType: 'base64',
  storageInstance: new CookieStorage(),
})

export class PositionFactory {
  storage: PositionStorageProps
  constructor() {
    this.storage = positionStorage
  }

  setPositionInfo<T extends object>(positionInfo: T, domain?: string) {
    this.storage.setItem(positionInfo, { domain })
  }

  getPositionInfo() {
    try {
      const auth = this.storage.getItem()
      return auth || null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  removePositionInfo(domain: string) {
    this.storage.removeItem({ path: '/', domain })
  }
}
