import { action, observable } from 'mobx'
import { GlobalModule } from '@/module/globalModule'

/**
 * 存储页面通用的一些状态
 */

class GlobalStore implements GlobalModule {
  @observable public globalCollapsed: boolean = false // 菜单是否折叠

  @action.bound
  public setGlobalCollapsed(data: boolean) {
    this.globalCollapsed = data
  }
}

export default GlobalStore
