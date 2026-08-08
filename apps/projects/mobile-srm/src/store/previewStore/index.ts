import { action, makeObservable, observable } from 'mobx'
import { RootStoreModel } from '../rootStore/model'
import { PreviewStoreModel } from './model'

export default class PreviewStore implements PreviewStoreModel {
  private rootStore: RootStoreModel

  images: any[] = []
  visible: boolean = false
  current: number = 0

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      images: observable,
      visible: observable,
      current: observable,
      setPreviewImages: action.bound,
      setPreviewCurrent: action.bound,
      setPreviewVisible: action.bound,
    })
    this.rootStore = rootStore
  }

  setPreviewImages(url: string) {
    this.images = [{ src: url }]
    this.current = 0
  }

  setPreviewCurrent(index: number) {
    this.current = index
  }

  setPreviewVisible(flag: boolean) {
    this.visible = flag
  }
}
