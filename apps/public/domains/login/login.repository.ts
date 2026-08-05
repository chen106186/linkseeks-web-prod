import {
  getManageContentImageFindAllByUseSceneAndPosition,
  GetManageContentImageFindAllByUseSceneAndPositionResponse,
} from '@apps/apis'
import { BaseRepository } from '../BaseRepository'

export class LoginRepository extends BaseRepository {
  bannerList: GetManageContentImageFindAllByUseSceneAndPositionResponse

  /**
   * 在登录页获取广告投放的图片列表
   */
  async getBannerList() {
    const param = {
      useScene: '1',
      position: '1',
    }

    const { data } = await this.getData('getBannerList', async () =>
      getManageContentImageFindAllByUseSceneAndPosition(param),
    )
    this.bannerList = data
    return this.bannerList
  }
}
