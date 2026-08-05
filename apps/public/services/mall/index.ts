import { CookieStorageModule } from '@linkseeks/storage'
import { getCookieDomain } from '@apps/utils'

export class MallService {
  cacheKey = 'mall-info'

  MallCookieStorage = new CookieStorageModule({
    storageKey: 'mall',
    servicePrefix: 'cache',
  })

  setMall(mallInfo: any) {
    this.MallCookieStorage.setItem(mallInfo, { domain: getCookieDomain() })
  }

  getMall() {
    return this.MallCookieStorage.getItem()
  }

  removeMall() {
    this.MallCookieStorage.removeItem({ domain: getCookieDomain() })
  }
}

export const mallService = new MallService()
