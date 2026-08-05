import { UserStoreModel } from '../userStore/model'
import { CreateStoreModel } from '../createStore/model'
import { PreviewStoreModel } from '../previewStore/model'

export interface RootStoreModel {
  userStore: UserStoreModel
  createStore: CreateStoreModel
  previewStore: PreviewStoreModel
}
