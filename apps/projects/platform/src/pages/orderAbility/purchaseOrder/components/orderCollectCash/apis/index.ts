import { getLogisticsSelectListReceiverAddress } from '@apps/apis'
import {
  getMemberManageOrderAgentMembers,
  getMemberManageOrderBuyerMembers,
  getMemberManageUpperProviderMerchantPage,
} from '@apps/apis'
import { getOrderBuyerCreatePurchaseTypes, postOrderBuyerCreatePaymentFind } from '@apps/apis'
import { getProductCommodityCommonGetCommodityListByBuyer } from '@apps/apis'
import { getSettlementInvoiceMessageList } from '@apps/apis'
import { getTradeEnquiryProductAll, getTradeProductQuotationList } from '@apps/apis'

export const fetchOrderApi = {
  /** 弹窗获取商品列表 */
  async getProductList(params) {
    const { data } = await getProductCommodityCommonGetCommodityListByBuyer(params)
    return data
  },

  /** 弹窗获取询价报价单列表 */
  async getQuotationList(params) {
    const { data } = await getTradeProductQuotationList(params)
    return data
  },

  /** 根据询价报价id查询商品列表 */
  async getProductListByQuotationOrderId(params) {
    const { data } = await getTradeEnquiryProductAll(params)
    return data
  },

  /** 获取会员列表 */
  async getMemberListByModelType(params) {
    const { data } = await getMemberManageOrderBuyerMembers(params)
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
  /** 获取支付信息列表 */
  async getPayInfoList(params) {
    const { data } = await postOrderBuyerCreatePaymentFind(params, { ctlType: 'none' })
    return data
  },

  /** 查看状态正常的会员服务消费者列表 */
  async getMemberConsumeLists(params) {
    const { data } = await getMemberManageOrderAgentMembers(params)
    return data
  },

  /** 根据商城类型 获取下单模式和类型 */
  async getOrderModeOrderType(params) {
    const { data } = await getOrderBuyerCreatePurchaseTypes(params)
    return data
  },
}
