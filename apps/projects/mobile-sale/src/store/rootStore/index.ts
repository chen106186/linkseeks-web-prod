import { makeAutoObservable } from 'mobx'
import UserStore from '../userStore'
import { UserStoreModel } from '../userStore/model'

class RootStore {
  userStore: UserStoreModel

  constructor() {
    makeAutoObservable(this)
    this.userStore = new UserStore(this)
  }
}

export default RootStore
