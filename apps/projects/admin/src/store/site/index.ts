import { action, computed, observable, runInAction, autorun } from 'mobx'

class SiteStore {
  @observable public siteId: number = Number(1) || 0
}

export default SiteStore
