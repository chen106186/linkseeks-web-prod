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

export interface RootStoreModel {
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
}
