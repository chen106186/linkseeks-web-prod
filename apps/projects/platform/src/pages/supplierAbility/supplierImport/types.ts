export interface InvoiceDetailType {
  /**
   * 开票id
   */
  id: number
  /**
   * 对账单id
   */
  reconciliationId: number
  /**
   * 对账单号
   */
  reconciliationNo: string
  /**
   * 对账单摘要
   */
  reconciliationAbstract: string
  /**
   * 对账单类型
   */
  reconciliationType: number
  /**
   * 对账单类型名称
   */
  reconciliationTypeName: string
  /**
   * 单据时间
   */
  createTime: string
  /**
   * 付款方
   */
  payer: string
  /**
   * 发票种类:1.增值税普通发票（默认）2.增值税专用发票
   */
  kind: number
  /**
   * 发票类型:1.企业（默认）2.个人
   */
  type: number
  /**
   * 发票抬头
   */
  invoiceTitle: string
  /**
   * 纳税号
   */
  taxNo: string
  /**
   * 开户行
   */
  bankOfDeposit: string
  /**
   * 账号
   */
  account: string
  /**
   * 地址
   */
  address: string
  /**
   * 电话
   */
  tel: string
  /**
   * 发票号码
   */
  number: string
  /**
   * 发票代码
   */
  code: string
  /**
   * 开票日期
   */
  invoiceDate: string
  /**
   * 备注
   */
  remark: string
  /**
   * 发票图片 ,String
   */
  urlImgs: string[]
  /**
   * 退回原因
   */
  returnResource: string
}

export interface InvoiceRowsType {
  /**
   * 开票明细id(新增为空,修改不为空)
   */
  id?: number
  /**
   * 开票id
   */
  invoiceProveId: number
  /**
   * 对账单id
   */
  reconciliationId: number
  /**
   * 对账单明细id
   */
  reconciliationRowId: number
  /**
   * 订单编号
   */
  orderNo: string
  /**
   * 发货单号
   */
  deliveryNo: string
  /**
   * 收货单号
   */
  receiveNo: string
  /**
   * 物料编码
   */
  productNo: string
  /**
   * 物料名称
   */
  name: string
  productName: string
  /**
   * 商品规格
   */
  spec?: string
  /**
   * 商品品类
   */
  category?: string
  /**
   * 商品品牌
   */
  brand?: string
  /**
   * 单位
   */
  unit?: string
  /**
   * 税率（百分比的分子部分）
   */
  taxRate: number
  /**
   * 单价（含税）
   */
  price: number
  /**
   * 单价（不含税）
   */
  priceNoTax: number
  /**
   * 税额
   */
  taxMoneyAmount: number
  /**
   * 本次对账数量
   */
  currentQuantity: number
  currentReconciliationQuantity: number
  /**
   * 本次对账金额（含税）
   */
  currentMoney: number
  /**
   * 本次开票数量
   */
  currentNumber: number
  /**
   * 本次开票金额(含税)
   */
  currentMoneyAmount: number
  /**
   * 本次开票金额（不含税）
   */
  currentMoneyNoTax: number
  treatReconciliationQuantity?: number
  treatMoney?: number
}

/**
 * 新增开票表单类型
 */
export interface InvoiceFromValuesType {
  /**
   * 对账单开票明细列表 ,InvoiceReconciliationRowVO
   */
  rows: InvoiceRowsType[]
  /**
   * 开票id
   */
  id?: number
  /**
   * 对账单id
   */
  reconciliationId: number
  /**
   * 对账单号
   */
  reconciliationNo: string
  /**
   * 对账单摘要
   */
  reconciliationAbstract?: string
  /**
   * 对账单类型
   */
  reconciliationType: number
  /**
   * 对账单类型名称
   */
  reconciliationTypeName?: string
  /**
   * 单据时间
   */
  createTime: string
  /**
   * 付款方
   */
  payer?: string
  /**
   * 发票种类:1.增值税普通发票（默认）2.增值税专用发票
   */
  kind?: number
  /**
   * 发票类型:1.企业（默认）2.个人
   */
  type?: number
  /**
   * 发票抬头
   */
  invoiceTitle?: string
  /**
   * 纳税号
   */
  taxNo?: string
  /**
   * 开户行
   */
  bankOfDeposit?: string
  /**
   * 账号
   */
  account?: string
  /**
   * 地址
   */
  address?: string
  /**
   * 电话
   */
  tel?: string
  /**
   * 发票号码
   */
  number: string
  /**
   * 发票代码
   */
  code: string
  /**
   * 开票日期
   */
  invoiceDate: string
  /**
   * 备注
   */
  remark?: string
  /**
   * 发票图片 ,String
   */
  urlImgs?: string[]
  /**
   * 退回原因
   */
  returnResource?: string
}
