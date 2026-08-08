import { action, makeObservable, observable, runInAction } from 'mobx'
import { getAsyncStorage, setAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { USER_INFO, TOKEN } from '@/constants'
import { RootStoreModel } from '../rootStore/model'
import { UserStoreModel, userInfoType } from './model'

export default class UserStore implements UserStoreModel {
  private rootStore: RootStoreModel

  username = 'Bob'

  userInfo: userInfoType | null = null

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      username: observable,
      userInfo: observable,
    })
    this.rootStore = rootStore
    this.fetchUserInfo()
  }

  setUserName(name: string) {
    this.username = name
  }

  fetchUserInfo() {
    getAsyncStorage(USER_INFO).then((data) => {
      this.userInfo = data
    })
  }

  // 用户登录时，或者修改用户信息的时候更新UserInfo
  async setUserInfo(data: userInfoType) {
    await setAsyncStorage(USER_INFO, data)
    runInAction(() => {
      this.userInfo = data
    })
  }

  async removeUserInfo() {
    await removeAsyncStorage(TOKEN)
    await removeAsyncStorage(USER_INFO)
    // 商品分享口令生成数字
    await removeAsyncStorage('SHARE_CODE_NUM')
    runInAction(() => {
      this.userInfo = null
    })
  }

  /**
   * 重新获取用户信息
   */
  async refreshUserInfo() {
    // const { code, data } = await PublicApi.getMemberMobileLoginReget({ shopType: this.shopAndSite?.shopType });
    // if (code === 1000) {
    //   await setAsyncStorage(USER_INFO, data);
    //   runInAction(() => {
    //     this.userInfo = data;
    //   });
    // }
  }
}
