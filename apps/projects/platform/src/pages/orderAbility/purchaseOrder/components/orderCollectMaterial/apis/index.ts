import { getContractContractTemplatePage, getContractSelectCurrencyList } from '@apps/apis'
import { getLogisticsSelectListReceiverAddress } from '@apps/apis'
import { postMemberManageLowerProviderPage } from '@apps/apis'
import { getOrderBuyerPaymentTypeAll } from '@apps/apis'
import {
  getProductCommodityCommonGetCommodityListByBuyer,
  getProductMaterielGetConfirmedMaterielList,
} from '@apps/apis'
import { getSettlementInvoiceMessageList } from '@apps/apis'
import { lifecyclePhaseRules } from '@/constants/order'

export const fetchOrderApi = {
  /** 弹窗获取商品列表 */
  async getProductList(params) {
    const { data } = await getProductCommodityCommonGetCommodityListByBuyer(params, {
      useCache: true,
      ttl: 10 * 1000,
    })
    return data
  },

  /** 获取会员列表 */
  async getMemberListByModelType(params) {
    const { data } = await postMemberManageLowerProviderPage(
      { ...params, lifeCycleStageRuleId: lifecyclePhaseRules.SUPPLIER_ORDER },
      { ctlType: 'none' },
    )
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

  /** 物料下单 获取不冻结物料 */
  async getPurchaseMaterielList(params) {
    const { data } = await getProductMaterielGetConfirmedMaterielList(params)
    return data
  },

  // 获取币别类型
  async fetchCurrencyType() {
    const { data } = await getContractSelectCurrencyList()
    return data
  },

  // 获取付款方式
  async fetchPaymentType() {
    const { data } = await getOrderBuyerPaymentTypeAll()
    return data
  },

  // 获取合同模板
  async fetchTemplateSelectOptions() {
    const { data } = await getContractContractTemplatePage({ current: '1', pageSize: '999' } as any)
    return data.data
  },
}
