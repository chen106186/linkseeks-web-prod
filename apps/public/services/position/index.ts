import { CookieStorageModule } from '@linkseeks/storage'
import { getCookieDomain } from '@apps/utils'
import { getManageAreaFindCityByIp } from '@apps/apis'

/** * 默认省市 */
export const DEFAULT_CITY = {
  provinceCode: '110000',
  provinceName: '北京',
  cityCode: '110100',
  cityName: '北京市',
}

export class PositionService {
  cacheKey = 'position-info'

  PositionCookieStorage = new CookieStorageModule({
    storageKey: 'position',
    servicePrefix: process.env.NODE_ENV + process.env.OUT_SOURCE,
  })

  async initPosition() {
    try {
      const { data, code } = await getManageAreaFindCityByIp()
      if (code === 1000 && data) {
        this.setPostion(data)
        return data
      }
      return DEFAULT_CITY
    } catch (error) {
      return DEFAULT_CITY
    }
  }

  setPostion(postion: any) {
    this.PositionCookieStorage.setItem(postion, { domain: getCookieDomain() })
  }

  getPosition() {
    return this.PositionCookieStorage.getItem()
  }

  removeAuth() {
    this.PositionCookieStorage.removeItem({ domain: getCookieDomain() })
  }
}

export const positionService = new PositionService()
