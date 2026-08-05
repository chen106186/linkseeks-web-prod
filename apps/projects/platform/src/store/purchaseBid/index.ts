import { action, observable } from 'mobx'
import { IPurchaseBidModule } from '@/module/purchaseBidModule'

class PurchaseBidStore implements IPurchaseBidModule {
  @observable public purchaseBiddingMessage: any = ''
  @observable public purchaseBiddingMessageSupplier: any = ''

  @action.bound
  public setPurchaseBiddingMessage(data: any) {
    this.purchaseBiddingMessage = data
  }

  @action.bound
  public setPurchaseBiddingMessageSupplier(data: any) {
    this.purchaseBiddingMessageSupplier = data
  }
}

export default PurchaseBidStore
