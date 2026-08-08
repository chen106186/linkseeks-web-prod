/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-30 18:19:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-30 18:19:06
 * @Description:
 */
export interface SummaryData {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: number
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
   * 换货数量
   */
  replaceCount: number
  /**
   * 发货数量
   */
  deliveryCount: number
  /**
   * 未退货发货数量,(未退货发货=换货数量-已退货发货)
   */
  unDeliveryCount: number
  /**
   * 收货数量
   */
  receiveCount: number
  /**
   * 差异数量,(差异数量=已退货发货-已退货收货)
   */
  differenceCount: number
}

export interface Detailed {
  /**
   * 发货Id
   */
  deliveryId: number
  /**
   * 批次
   */
  batch: number
  /**
   * 发货单号
   */
  deliveryNo: string
  /**
   * 发货时间（yyyy-MM-ddHH:mm）
   */
  deliveryTime: string
  /**
   * 物流单号
   */
  logisticsOrderNo: string
  /**
   * 物流公司
   */
  logisticsName: string
  /**
   * 入库单号
   */
  storageNo: string
  /**
   * 入库时间（yyyy-MM-ddHH:mm）
   */
  storageTime: string
  /**
   * 内部状态
   */
  innerStatus: number
  /**
   * 内部状态名称
   */
  innerStatusName: string
  /**
   * 发货明细 ,DeliveryGoodsDetailVO
   */
  detailList: {
    /**
     * 订单号
     */
    orderNo?: string
    /**
     * 商品id
     */
    productId?: number
    /**
     * 商品名称
     */
    productName?: string
    /**
     * 品类
     */
    category?: string
    /**
     * 品牌
     */
    brand?: string
    /**
     * 单位
     */
    unit?: string
    /**
     * 数量
     */
    count?: number
    /**
     * 发货数量
     */
    deliveryCount?: number
    /**
     * 入库数量
     */
    storageCount?: number
    /**
     * 差异数量,(差异数量=发货数量-入库数量)
     */
    differenceCount?: number
  }[]
}
