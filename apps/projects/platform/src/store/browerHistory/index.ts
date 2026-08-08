import { action, observable } from 'mobx'
import { CommodityItemType } from './types'

const localCommodityListHistory = localStorage.getItem("commodityListHistory")

class BrowserHistoryStore {
  @observable public commodityListHistory: CommodityItemType[] = localCommodityListHistory ? JSON.parse(localCommodityListHistory) : []; // 浏览商品记录列表

  /**
   * 更新浏览商品记录
   */
  @action.bound
  public updateCommodityBrowerHistory(commodityItem: CommodityItemType) {
    if(this.commodityListHistory.length === 0 || this.commodityListHistory.every((item) => item.id !== commodityItem.id)) {
      this.commodityListHistory = [commodityItem, ...this.commodityListHistory]
      this.commodityListHistory = this.commodityListHistory.splice(0, 50)
      localStorage.setItem("commodityListHistory", JSON.stringify(this.commodityListHistory))
    }
  }
}

export default BrowserHistoryStore
