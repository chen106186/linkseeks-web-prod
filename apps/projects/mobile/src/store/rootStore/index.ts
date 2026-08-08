import { makeAutoObservable } from 'mobx'
import UserStore from '../userStore'
import TemplateStore from '../templateStore'
import SearchStore from '../searchStore'
import PurchaseOrderStore from '../purchaseOrderStore'
import ProductInfoStore from '../productInfoStore'
import PaymentInfoStore from '../paymentInfoStore'
import ConfirmOrderStore from '../confirmOrderStore'
import LocationStore from '../locationStore'
import GroupBuyStore from '../groupBuyStore'
import { UserStoreModel } from '../userStore/model'
import { TemplateStoreModel } from '../templateStore/model'
import { SearchStoreModel } from '../searchStore/model'
// import { WorkBenchStoreModel } from '../workBenchStore/model'
import { PurchaseOrderStoreModel } from '../purchaseOrderStore/model'
import { PaymentInfoStoreModel } from '../paymentInfoStore/model'
import { ProductInfoStoreModel } from '../productInfoStore/model'
import { ConfirmOrderStoreModel } from '../confirmOrderStore/model'
import { LocationStoreModel } from '../locationStore/model'
import { GroupBuyStoreModel } from '../groupBuyStore/model'

class RootStore {
  userStore: UserStoreModel

  templateStore: TemplateStoreModel

  searchStore: SearchStoreModel

  // workBenchStore: WorkBenchStoreModel

  purchaseOrderStore: PurchaseOrderStoreModel

  paymentInfoStore: PaymentInfoStoreModel

  productInfoStore: ProductInfoStoreModel

  confirmOrderStore: ConfirmOrderStoreModel

  locationStore: LocationStoreModel

  groupBuyStore: GroupBuyStoreModel

  constructor() {
    makeAutoObservable(this)
    this.userStore = new UserStore(this)
    this.templateStore = new TemplateStore(this)
    this.searchStore = new SearchStore(this)
    // this.workBenchStore = new WorkBenchStore(this)
    this.purchaseOrderStore = new PurchaseOrderStore(this)
    this.paymentInfoStore = new PaymentInfoStore(this)
    this.productInfoStore = new ProductInfoStore(this)
    this.confirmOrderStore = new ConfirmOrderStore(this)
    this.locationStore = new LocationStore(this)
    this.groupBuyStore = new GroupBuyStore(this)
  }
}

export default RootStore
