import { getLogisticsSelectListReceiverAddress } from '@apps/apis'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { getProductCommodityCommonGetCommodityListByBuyer } from '@apps/apis'
import { getPurchaseRequisitionPurchaseOrderMaterialPage } from '@apps/apis'
import { getSettlementInvoiceMessageList } from '@apps/apis'

export const fetchOrderApi = {
  /** 弹窗获取商品列表 */
  async getProductList(params) {
    const { data } = await getProductCommodityCommonGetCommodityListByBuyer(params, { useCache: true, ttl: 10 * 1000 })
    return data
  },

  /** 获取会员列表 */
  async getMemberListByModelType(params) {
    const { data } = await postMemberManageLowerProviderPage(params, { ctlType: 'none' })
    return data
  },

  /** 获取所有商品收货地址 */
  async getProductAddressAll() {
    const { data } = await getLogisticsSelectListReceiverAddress()
    return data
  },
  /** 获取发票列表 */
  async getInvoicesList() {
    const { data } = await getSettlementInvoiceMessageList()
    return data
  },

  /** 请购单下单 获取请购单物料 */
  async getRequisitionPurchaseMaterielList(params) {
    const { data } = await getPurchaseRequisitionPurchaseOrderMaterialPage(params)
    return data
  },
}
