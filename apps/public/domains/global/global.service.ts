import { GlobalRepository } from './global.repository'

export class GlobalService {
  repository = new GlobalRepository()

  /**
   * 获取平台logo
   */
  getPlatformLogo() {
    const siteInfo = this.repository.getSiteInfo()
    return siteInfo.logo
  }

  async getAreaCode() {
    try {
      const data = await this.repository.getTelCodes()
      return data
    } catch (err) {
      console.log(err)
      return []
    }
  }
}

const globalServiceInstance = new GlobalService()

export default globalServiceInstance
