/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-09 16:28:28
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-09 16:28:29
 * @Description:
 */
export interface goodItem {
  /**
   * ID
   */
  id: string
  /**
   * 商品ID
   */
  productId: string
  /**
   * 订单ID
   */
  orderId: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * 价格
   */
  price: number
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 退货数据
   */
  returnCount: number
  /**
   * 换货数量
   */
  replaceCount: number
  /**
   * 维修数量
   */
  repairCount: number
  /**
   * 一加工数量
   */
  processNum: number
  /**
   * 支付信息
   */
  payInfoList: {
    id?: number
    /**
     * 采购单ID
     */
    orderId?: number
    /**
     * 支付次数
     */
    payCount?: number
    /**
     * 支付环节
     */
    payNode?: string
    /**
     * 外部状态：1.待支付2.待确认支付结果3.确认到账4.确认未到账
     */
    externalState?: number
    /**
     * 支付比例
     */
    payRatio?: number
    /**
     * 支付金额
     */
    payPrice?: number
    /**
     * 支付方式：1.线上支付2.线下3.授信4.货到付款
     */
    payWay?: number
    /**
     * 支付渠道
     */
    channel?: number
    /**
     * 支付时间
     */
    payTime?: number
    /**
     * 支付凭证
     */
    payOrderUrls?: string
    /**
     * 支付流水号
     */
    payCode?: string
    /**
     * 支付配置：1.平台代收2.会员直接到账
     */
    ruleConfigurationId?: number
  }[]
}

export interface OrderListParams {
  orderNo: string
  orderThe: string
  startCreateTime: string
  endCreateTime: string
  type: number
}

export interface OrderListRes {
  data: { [key: string]: any }[]
  totalCount: number
}
