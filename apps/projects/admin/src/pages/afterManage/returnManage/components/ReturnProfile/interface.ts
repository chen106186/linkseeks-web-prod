import { ReturnProductListItemType } from '../ReturnProductList'
import { ReturnStatisticsListItem } from '../ReturnAnalysis/interface'

export type ManualReturnGoodsAddressType = {
  /**
   * 售后id
   */
  dataId: number
  /**
   * 发货地址
   */
  deliveryAddress: string
  /**
   * 发货时间
   */
  deliveryTime: number
  /**
   * 物流单号
   */
  logisticsOrderNo: string
  /**
   * 物流公司
   */
  logisticsName: string
  /**
   * 退货商品数量 ,ManualDeliveryGoodsProductVO
   */
  productList: {
    /**
     * 换货详情id
     */
    replaceDetailId: number
    /**
     * 商品id
     */
    productId: string
    /**
     * 退货数量
     */
    returnCount: number
  }[]
}

export type ReturnGoodsAddress = {
  /**
   * 配送方式:1-物流（默认）,2-自提,3-无需配送
   */
  deliveryType: number
  /**
   * 发货地址id
   */
  sendId: number
  /**
   * 发货地址
   */
  sendAddress: string
  /**
   * 发货者名称
   */
  sendUserName: string
  /**
   * 发货者电话
   */
  sendUserTel: string
  /**
   * 收货地址id
   */
  receiveId: number
  /**
   * 收货地址
   */
  receiveAddress: string
  /**
   * 收货者名称
   */
  receiveUserName: string
  /**
   * 收货者电话
   */
  receiveUserTel: string
}

export type EvaluateType = {
  /**
   * 评价等级（5个级别）
   */
  level: number
  /**
   * 评价内容
   */
  content: string
}

export type TaskListItem = {
  /**
   * 任务步骤
   */
  step: number
  /**
   * 任务名称
   */
  taskName: string
  /**
   * 执行当前任务的角色名称,@return
   */
  roleName: string
  /**
   * 是否执行0-否1-是
   */
  isExecute: number
}

export type RefundDetailListItem = {
  /**
   * 退款id
   */
  refundId?: number
  /**
   * 支付id
   */
  payId?: number
  /**
   * 支付外部状态：1.待支付2.待确认支付结果3.确认到账4.确认未到账
   */
  externalState?: number
  /**
   * 支付次数
   */
  payCount?: number
  /**
   * 支付环节
   */
  payNode?: string
  /**
   * 支付比例
   */
  payRatio?: number
  /**
   * 支付金额
   */
  payAmount?: number
  /**
   * 支付方式：1.线上支付2.线下支付3.授信额度支付4.货到付款支付
   */
  payWay?: number
  /**
   * 支付方式名称
   */
  payWayName?: string
  /**
   * 支付渠道：0.积分支付1.支付宝2.微信3.银联4.余额支付5.线下支付线上确认6.授信额度支付7.货到付款
   */
  channel?: number
  /**
   * 支付渠道名称
   */
  channelName?: string
  /**
   * 退款金额
   */
  refundAmount?: number
  /**
   * 外部状态:0.所有1.待退款2.待确认退款3.退款未到账4.退款到账5.无需退款
   */
  outerStatus?: number
  /**
   * 外部状态名称
   */
  outerStatusName?: string
  /**
   * 内部状态:0.所有1.未退款2.退款失败3.退款成功4.无需退款
   */
  innerStatus?: number
  /**
   * 内部状态名称
   */
  innerStatusName?: string
  /**
   * 退款时间（yyyy-MM-ddHH:mm）
   */
  refundTime?: string
  /**
   * 支付凭证 ,PayProveBO
   */
  payProve?: {
    /**
     * 账户名称
     */
    name?: string
    /**
     * 银行账号
     */
    bankAccount?: string
    /**
     * 开户行
     */
    bankDeposit?: string
    /**
     * 支付凭证文件 ,PayProveFileBO
     */
    fileList?: {
      /**
       * 证明名称
       */
      name: string
      /**
       * 证明地址
       */
      proveUrl: string
    }[]
  }
  /**
   * 是否允许退款：0-否，1-是
   */
  canRefund?: number
}

export type RefundListItem = {
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
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 支付金额
   */
  payAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 退款明细 ,ReturnGoodsRefundDetailVO
   */
  detailList: []
}

export type DetailType = {
  /**
   * 退货id
   */
  returnId: number
  /**
   * 申请单号
   */
  applyNo: string
  /**
   * 申请摘要
   */
  applyAbstract: string
  /**
   * 采购商会员名称
   */
  consumerName: string
  /**
   * 采购商会员id
   */
  memberId: number
  /**
   * 采购商会员角色id
   */
  roleId: number
  /**
   * 供应商名称
   */
  supplierName: string
  /**
   * 供应商会员id
   */
  parentMemberId: number
  /**
   * 供应商会员角色id
   */
  parentMemberRoleId: number
  /**
   * 单据时间
   */
  applyTime: string
  /**
   * 内部状态,待提交退货申请单-1,审核通过(提交)-2,审核不通过(提交)-24,审核通过(一级)-3,审核不通过(一级)-25,审核通过(二级)-4,审核不通过(二级)-5,审核通过(确认)-6,审核不通过(确认)-7,待新增退货发货单-8,待审核退货发货单-9,采购商待新增物流单-10,采购商待确认物流单-11,待确认退货发货-12,待新增退货入库单-13,待审核退货入库单-14,待确认退货收货-15,待确认退货回单-16,待退款-17,待确认退款-18,退款失败-19,退款成功-20,待确认售后完成-21,确认售后完成-22,不接受物流单-23
   */
  innerStatus: number
  /**
   * 内部状态名称
   */
  innerStatusName: string
  /**
   * 外部状态,待提交申请单-1,待确认申请单（已提交申请单）-2,待平台确认申请单-21,不接受申请（确认申请单）-3,接受申请（确认申请单）-4,待新增退货发货单（确认申请单后）-5,采购商待新增物流单（新增换货发货单审核通过）-6,待退货发货（新增物流单审核通过）-7,待新增退货入库单（已退货发货）-8,待退货收货（已新增换货入库单）-9,待确认退货回单（已换货收货）-10,待退款(确认退货回单)-11,待确认退款(退款)-12,确认退款未到账-13,待确认售后完成(确认退款)-14,售后完成-15
   */
  outerStatus: number
  /**
   * 外部状态名称
   */
  outerStatusName: string
  /**
   * 任务类型:18：默认，31：手工发货:,43：合同,44：合同手工发货
   */
  taskType: number
  /**
   * 任务key.
   */
  taskTypeKey: string
  /**
   * 手工退货发货地址
   */
  manualReturnGoodsAddress: ManualReturnGoodsAddressType
  /**
   * 相关故障文件 ,ProofFileBO
   */
  faultFileList: FaultFileListItem[]
  /**
   * 退货地址 ,ReceiveGoodsBO
   */
  returnGoodsAddress: ReturnGoodsAddress
  /**
   * 评价 ,EvaluateBO
   */
  evaluate: EvaluateType
  /**
   * 外部流转 ,TaskStepVO
   */
  outerTaskList: TaskListItem[]
  /**
   * 内部流转 ,TaskStepVO
   */
  innerTaskList: TaskListItem[]
  /**
   * 外部单据流转记录 ,ReturnOuterWorkflowRecordVO
   */
  outerRecordList: {
    /**
     * 步骤
     */
    step: number
    /**
     * 角色名称
     */
    roleName: string
    /**
     * 状态
     */
    status: string
    /**
     * 状态编码,待提交申请单-1,待确认申请单（已提交申请单）-2,不接受申请（确认申请单）-3,接受申请（确认申请单）-4,待新增退货发货单（确认申请单后）-5,采购商待新增物流单（新增换货发货单审核通过）-6,待退货发货（新增物流单审核通过）-7,待新增退货入库单（已退货发货）-8,待退货收货（已新增换货入库单）-9,待确认退货回单（已换货收货）-10,待退款(确认退货回单)-11,待确认退款(退款)-12,确认退款未到账-13,待确认售后完成(确认退款)-14,售后完成-15
     */
    statusCode: number
    /**
     * 操作
     */
    operate: string
    /**
     * 操作时间
     */
    operateTime: string
    /**
     * 审核意见
     */
    opinion: string
  }[]
  /**
   * 内部单据流转记录 ,ReturnInnerWorkflowRecordVO
   */
  innerRecordList: {
    /**
     * 步骤
     */
    step: number
    /**
     * 操作者
     */
    operator: string
    /**
     * 部门
     */
    department: string
    /**
     * 职位
     */
    jobTitle: string
    /**
     * 状态
     */
    status: string
    /**
     * 状态编码,待提交退货申请单-1,审核通过(提交)-2,审核不通过(提交)-24,审核通过(一级)-3,审核不通过(一级)-25,审核通过(二级)-4,审核不通过(二级)-5,审核通过(确认)-6,审核不通过(确认)-7,待新增退货发货单-8,待审核退货发货单-9,采购商待新增物流单-10,采购商待确认物流单-11,待确认退货发货-12,待新增退货入库单-13,待审核退货入库单-14,待确认退货收货-15,待确认退货回单-16,待退款-17,待确认退款-18,退款失败-19,退款成功-20,待确认售后完成-21,确认售后完成-22,不接受物流单-23
     */
    statusCode: number
    /**
     * 操作
     */
    operate: string
    /**
     * 操作时间
     */
    operateTime: string
    /**
     * 审核意见
     */
    opinion: string
  }[]
  /**
   * 退货批次
   */
  returnBatch: number
  /**
   * 退货商品明细 ,ReturnGoodsDetailQueryVO
   */
  goodsDetailList: ReturnProductListItemType[]
  /**
   * 退货统计 ,ReturnGoodsStatisticsVO
   */
  returnStatisticsList: ReturnStatisticsListItem[]
  /**
   * 退货明细 ,DeliveryGoodsVO
   */
  returnDeliveryGoodsList: []
  /**
   * 退款明细 ,ReturnGoodsRefundVO
   */
  refundList: RefundListItem[]
  /**
   * 订单类型
   */
  orderType: number
  /**
   * 退货原因
   */
  returnReason: string
  /**
   * 店铺名称
   */
  shopName: string
  /**
   * 店铺Id
   */
  shopId: number
  /**
   * 店铺Logo
   */
  shopLogo: string
  /**
   * AgentFlagEnum,代客标识:0-非代客；1-代客
   */
  agentFlag: number
}
