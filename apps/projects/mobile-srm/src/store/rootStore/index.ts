import { makeAutoObservable } from 'mobx'
import UserStore from '../userStore'
import CreateStore from '../createStore'
import PreviewStore from '../previewStore'
import { UserStoreModel } from '../userStore/model'
import { CreateStoreModel } from '../createStore/model'
import { PreviewStoreModel } from '../previewStore/model'

class RootStore {
  userStore: UserStoreModel
  createStore: CreateStoreModel
  previewStore: PreviewStoreModel

  constructor() {
    makeAutoObservable(this)
    this.userStore = new UserStore(this)
    this.createStore = new CreateStore(this)
    this.previewStore = new PreviewStore(this)
  }
}

export default RootStore
