/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-12 16:39:50
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-16 15:46:29
 * @Description:
 */
export type BillDetailsItemType = {
  /**
   * 订单编号
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
   * 商品品类
   */
  category: string
  /**
   * 商品单位
   */
  unit: string
  /**
   * 商品品牌
   */
  brand: string
  /**
   * 商品单价
   */
  price: string | number
  /**
   * 关联的数量，eg：退货发货单则表示 退货数量（申请数）
   */
  relatedCount: string | number
  /**
   * 对应单据数量，比如当前在新增退货入库单，那该字段就表示 退货发货单的 退货发货数量
   */
  billCount?: number
  /**
   * 单据数量
   */
  count?: number
  /**
   * 对应单据数据id
   */
  billDetailId?: number
}

export type BillDetailsItemValueType = BillDetailsItemType & {
  /**
   * 对应单据数量，比如当前在新增退货入库单，那该字段就表示 退货发货单的 退货发货数量
   */
  billCount?: number
  /**
   * 单据数量
   */
  count: number
  /**
   * 单据金额
   */
  amount: number
}

export type RelatedInfoDataType = {
  /**
   * 关联单据编号
   */
  relatedNo: string
  /**
   * 会员名称
   */
  memberName: string
  /**
   * 收货地址 或 发货地址
   */
  address: string
  /**
   * 物流方式
   */
  logisticsType: number
  /**
   * 单据明细数据
   */
  billDetails: BillDetailsItemType[]
  /**
   * 仓库id
   */
  inventoryId?: number | string
  /**
   * 对应仓库名称
   */
  inventoryRole?: string
  /**
   * 单据摘要
   */
  digest?: string
  /**
   * 单据时间
   */
  createTime?: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 订单类型
   */
  orderType: number
}

export type RelatedInfoType = Omit<RelatedInfoDataType, 'billDetails'> & {
  /**
   * 物流方式名称
   */
  logisticsTypeName: string
  /**
   * 单据明细数据
   */
  billDetails: BillDetailsItemValueType[]
  /**
   * 订单类型
   */
  orderType: number
}

export type BillSubmitValuesType = RelatedInfoType & {
  /**
   * 对应仓库id
   */
  inventoryId: number
  /**
   * 申请摘要
   */
  digest: string
  /**
   * 单据时间
   */
  createTime: string
  /**
   * 仓库人员
   */
  inventoryRole: string
  /**
   * 对应仓库名称
   */
  inventoryName: string
  /**
   * 对应单据
   */
  relatedBillType: number
  /**
   * 关联对应单据编号
   */
  relatedNo: string
  /**
   * 关联对应单据会员名称
   */
  memberName: string
  /**
   * 备注
   */
  remark: string
}
