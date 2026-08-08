import { getLogisticsReceiverAddressAgentPage } from '@apps/apis'
import { getMemberManageAllPageByordertype, getMemberManageOrderAgentMembers } from '@apps/apis'
import { getOrderVendorGetOrderMode, postOrderVendorCreateAgentPaymentFind } from '@apps/apis'
import { getProductCommodityCommonGetCommodityListByGuest } from '@apps/apis'
import { getSettlementAgentInvoiceMessageList } from '@apps/apis'
import { getTradeEnquiryProductAll, getTradeProductQuotationList } from '@apps/apis'

export const fetchOrderApi = {
  /** 弹窗获取商品列表 */
  async getProductList(params) {
    const { data } = await getProductCommodityCommonGetCommodityListByGuest(params)
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

  /** 根据下单类型获取会员列表 */
  async getMemberListByModelType(params) {
    const { data } = await getMemberManageAllPageByordertype(params)
    return data
  },

  /** 获取代客 采购会员收货地址 */
  async getProductAddressAll(params) {
    const { data } = await getLogisticsReceiverAddressAgentPage(params)
    return data
  },
  /** 获取发票列表 */
  async getInvoicesList(params) {
    const { data } = await getSettlementAgentInvoiceMessageList(params)
    return data
  },
  /** 获取支付信息列表 */
  async getPayInfoList(params) {
    const { data } = await postOrderVendorCreateAgentPaymentFind(params, { ctlType: 'none' })
    return data
  },

  /** 查看状态正常的会员服务消费者列表 */
  async getMemberConsumeLists(params) {
    const { data } = await getMemberManageOrderAgentMembers(params)
    return data
  },

  /** 根据商城类型 获取下单模式和类型 */
  async getOrderModeOrderType(params) {
    const { data } = await getOrderVendorGetOrderMode(params)
    return data
  },
}
