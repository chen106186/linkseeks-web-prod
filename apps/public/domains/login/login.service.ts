import { LoginRepository } from './login.repository'

export class LoginService {
  repository = new LoginRepository()

  /**
   * 获取平台logo
   */
  async getBannerList() {
    const bannerList = await this.repository.getBannerList()
    return bannerList
  }
}

const loginServiceInstance = new LoginService()

export default loginServiceInstance
