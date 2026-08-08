import { CookieStorageModule } from '@linkseeks/storage'
import { getCookieDomain } from '@apps/utils'

export class DeliveryService {
  cacheKey = 'delivery-info'

  DeliveryCookieStorage = new CookieStorageModule({
    storageKey: 'delivery',
    servicePrefix: process.env.NODE_ENV + process.env.OUT_SOURCE,
  })

  setDelivery(postion: any) {
    this.DeliveryCookieStorage.setItem(postion, { domain: getCookieDomain() })
  }

  getDelivery() {
    return this.DeliveryCookieStorage.getItem()
  }

  removeItem() {
    this.DeliveryCookieStorage.removeItem({ domain: getCookieDomain() })
  }
}

export const deliveryService = new DeliveryService()
