import { action, computed, observable, runInAction } from 'mobx'
import { ILoginModule } from '@/module/userModule'
import { authService } from '@apps/services'

class LoginStore implements ILoginModule {
  @observable public username: string = 'admin'
  @observable public password: string = '123456'
  @observable public res: object = {}
  @observable public userInfo = authService.getAuth()
  @observable public avatar = this.userInfo?.logo

  // 可以改变对应的状态值
  // @todo 接入更新用户信息接口
  @action.bound
  public async updateUserInfo() {
    // try {
    //   const res = await userDetailGet()
    //   runInAction(() => {
    //     this.userInfo = res.data;
    //     localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    //   })
    // } catch (error) {
    //   return error
    // }
  }

  // 当有时需要拼接状态，但又不希望改变原有状态，可以采取如下, 类似vue中的computed
  @computed
  public get printInfo(): string {
    return `hello, ${this.username}, your password is ${this.password}`
  }

  // 可以改变对应的状态值
  @action.bound
  public setUsername(username: string) {
    this.username = username
  }

  @action.bound
  public setPassword(password: string) {
    this.password = password
  }

  // 异步修改数据, 需要使用bound，保持this指向当前store
  @action.bound
  public async handleLogin() {
    try {
      // let params = {
      //   username: this.username,
      //   password: this.password,
      // }
      const result = {}
      runInAction(() => {
        this.res = result
      })

      return result
    } catch (error) {
      return error
    }
  }
  // 改变用户的头像
  @action.bound
  public setUserAvatar(link: string) {
    const _info = authService.getAuth()
    _info.logo = link
    authService.setAuth(_info)
    this.avatar = link
  }
}

export default LoginStore
