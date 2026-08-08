export type ReturnStatisticsListItem = {
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id
   */
  productId: string
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
   * 退货数量
   */
  returnCount: number
  /**
   * 发货数量
   */
  deliveryCount: number
  /**
   * 未退货发货数量,(未退货发货=退货数量-已退货发货)
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

export type ReturnDeliveryGoodsDetailListItem = {
  /**
   * 订单id
   */
  orderId?: number
  /**
   * 订单号
   */
  orderNo?: string
  /**
   * 商品id
   */
  productId?: string
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
  /**
   * 关联商品. ,AssociatedProductVO
   */
  associatedProductVO?: {
    /**
     * id
     */
    id?: number
    /**
     * 商品ID
     */
    productId?: string
    /**
     * 商品名称、规格
     */
    productName?: string
    /**
     * 规格
     */
    type?: string
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
  }
  /**
   * 商品图片.
   */
  skuPic?: string
}

export type ReturnDeliveryGoodsListItem = {
  /**
   * 发货Id
   */
  deliveryId: number
  /**
   * 批次
   */
  batch: number
  /**
   * 发货单Id
   */
  deliveryNoId: number
  /**
   * 发货单号
   */
  deliveryNo: string
  /**
   * 发货时间（yyyy-MM-ddHH:mm）
   */
  deliveryTime: string
  /**
   * 物流id
   */
  logisticsId: number
  /**
   * 物流单号
   */
  logisticsOrderNo: string
  /**
   * 物流公司
   */
  logisticsName: string
  /**
   * 物流收货地址
   */
  logisticsReceiveAddress: string
  /**
   * 物流收货地址id
   */
  logisticsReceiveAddressId: number
  /**
   * 发货方地址id
   */
  shipperAddressId: number
  /**
   * 发货方地址
   */
  shipperFullAddress: string
  /**
   * 入库单号
   */
  storageNo: string
  /**
   * 入库单号
   */
  storageId: number
  /**
   * 入库时间（yyyy-MM-ddHH:mm）
   */
  storageTime: string
  /**
   * 内部状态:未确认发货-1,已确认发货-2,已确认收货-3,确认回单-4
   */
  innerStatus: number
  /**
   * 内部状态名称
   */
  innerStatusName: string
  /**
   * 发货明细 ,DeliveryGoodsDetailVO
   */
  detailList: ReturnDeliveryGoodsDetailListItem[]
}
