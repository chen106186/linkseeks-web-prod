import { getOrderVendorLogisticsProductPage } from '@apps/apis'

export const fetchOrderApi = {
  /** 弹窗获取 发货单 商品明细 */
  async getProductList(params) {
    const { data } = await getOrderVendorLogisticsProductPage(params, { useCache: true, ttl: 10 * 1000 })
    return data
  },
}
