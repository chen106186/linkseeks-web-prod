/*
 * @Author: GHua
 * @Date: 2022-02-23 17:53:31
 * @LastEditTime: 2022-04-02 16:36:07
 * @LastEditors: GHua
 * @Description: 订单相关类型
 */

import type { ORDER_TYPE } from '../constants/order'

export interface ShipperAddressType {
  /**
   * 主键id
   */
  id: number
  /**
   * 发货人名称
   */
  shipperName: string
  /**
   * 省编号
   */
  provinceCode: string
  /**
   * 省名称
   */
  provinceName: string
  /**
   * 市编号
   */
  cityCode: string
  /**
   * 市名称
   */
  cityName: string
  /**
   * 区编号
   */
  districtCode: string
  /**
   * 区名称
   */
  districtName: string
  /**
   * 街道编码
   */
  streetCode: string
  /**
   * 街道名称
   */
  streetName: string
  /**
   * 详细地址
   */
  address: string
  /**
   * 邮编
   */
  postalCode: string
  /**
   * 手机区号
   */
  areaCode: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 电话号码
   */
  tel: string
  /**
   * 是否默认0-否1-是
   */
  isDefault: number
}

export interface OrderProductType {
  /**
   * 供应商会员Id
   */
  vendorMemberId: number
  /**
   * 供应商会员角色Id
   */
  vendorRoleId: number
  /**
   * 供应商会员名称
   */
  vendorMemberName: string
  /**
   * 上游供应商会员Id
   */
  supplyMemberId?: number
  /**
   * 上游供应商会员角色Id
   */
  supplyRoleId?: number
  /**
   * 上游供应商会员名称
   */
  supplyMemberName?: string
  /**
   * 商品Id
   */
  productId: number
  /**
   * 商品SkuId
   */
  skuId: number
  /**
   * 渠道商品库存Id
   */
  stockId?: number
  /**
   * 购物车Id
   */
  cartId?: number
  /**
   * 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品。字段值来自于商品服务提供的商品信息
   */
  priceType: number
  /**
   * 商品营销活动类型：0-无营销活动的普通商品，1-套餐主商品，2-套餐中的商品，3-换购的主商品，4-被换购的商品，5-其他营销活动商品
   */
  promotionType?: number
  /**
   * 套餐编号，如果是套餐主商品不能为空或0
   */
  groupNo?: number
  /**
   * 换购商品SkuId，如果是被换购的商品，不能为空，且换购前的商品必须在商品列表中，
   */
  parentSkuId?: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand?: string
  /**
   * 计价单位
   */
  unit: string
  /**
   * 商品LogoUrl
   */
  logo: string
  /**
   * 商品规格
   */
  spec?: string
  /**
   * 商品单价
   */
  price: number
  /**
   * 到手价
   */
  refPrice: number
  /**
   * 会员折扣
   */
  discount?: number
  /**
   * 采购数量
   */
  quantity: number
  /**
   * 供方库存
   */
  stock?: number
  /**
   * 是否含税（true-含税，false-不含税）
   */
  tax?: boolean
  /**
   * 税率（百分比的分子部分）
   */
  taxRate?: number
  /**
   * 商品配送方式：1-物流，2-自提，3-无需配送
   */
  deliveryType: number
  /**
   * 运费类型，1-卖家承担，2-买家承担，当配送方式是物流时必填
   */
  freightType?: number
  /**
   * 商品重量，当配送方式是物流时要非空且大于0
   */
  weight?: number
  /**
   * 物流模板Id，当配送方式是物流时要非空且大于0
   */
  logisticsTemplateId?: number
  /**
   * 自提地址Id（如配送方式为自提，必填）
   */
  addressId?: number
  /**
   * 自提地址
   */
  address?: string
  /**
   * 接收人
   */
  receiver?: string
  /**
   * 接收人电话
   */
  phone?: string
  /**
   * 是否跨境商品，true-是，false-否
   */
  crossBorder: boolean
  /**
   * 商品关联的营销活动列表，如商品没有营销活动则不需要填写此字段 ,OrderPromotionVO
   */
  promotions?: {
    /**
     * （例如拼团订单）营销记录Id，前端从营销服务获得，可为空
     */
    recordId?: number
    /**
     * 营销活动Id
     */
    promotionId: number
    /**
     * 营销活动名称
     */
    name: string
    /**
     * 营销活动类型枚举
     */
    promotionType: number
    /**
     * 营销活动归属类型枚举
     */
    belongType: number
    /**
     * 营销活动起始时间，格式为yyyy-MM-ddHH:mm:ss
     */
    startTime: string
    /**
     * 营销活动结束时间，格式为yyyy-MM-ddHH:mm:ss
     */
    expireTime: string
  }[]
}

export interface CouponItemType {
  vendorMemberId: number
  vendorRoleId: number
  skuId: number
  couponId: number
  name: number
  couponType: number
  belongType: number
  amount: number
  startTime: string
  expireTime: string
}

export interface DeductionsType {
  vendorMemberId: number
  vendorRoleId: number
  vendorName: string
  relType: number
  usedPoint: number
  amount: number
}

export interface OrderParamType {
  orderMode?: number
  orderId?: number
  buyerMemberId: number
  buyerRoleId: number
  buyerMemberName: string
  /** 门店ID(通过收货地址获取) */
  storeId?: number
  /**
   * 订单来源商城Id
   */
  shopId: number
  /**
   * 商城类型，1-企业商城3-渠道商城4-渠道自有商城
   */
  shopType: number
  /**
   * 商城环境，1-Web，2-H5，3-小程序，4-App
   */
  shopEnvironment: number
  /**
   * 订单来源商城名称
   */
  shopName: string
  /**
   * 支付方式，0-无需支付，1-线上支付，2-线下支付，3-授信额度支付，4-货到付款，5-结算支付，10-积分支付
   */
  payType: number
  /**
   * 支付渠道，0-无需支付，1-支付宝，2-微信，3-银联，4-余额支付，5-线下支付线上确认，6-授信额度支付，7-货到付款，8-月结，9-账期，10-积分支付
   */
  payChannel: number
  /**
   * 总运费
   */
  freight: number

  /**
   * 税费
   */
  taxes: number
  /**
   * 促销活动优惠总金额
   */
  promotionAmount: number
  /**
   * 优惠券优惠总金额
   */
  couponAmount: number
  /**
   * 订单实付总金额
   */
  totalAmount: number
  /**
   * 收货地址，如商品配送方式中包含“物流”，则必须填写 ,OrderConsigneeVO
   */
  consignee?: {
    /**
     * 收货人Id
     */
    consigneeId: number
    /**
     * 收货人姓名
     */
    consignee: string
    /**
     * 省编码
     */
    provinceCode: string
    /**
     * 市编码
     */
    cityCode: string
    /**
     * 区编码
     */
    districtCode: string
    /**
     * 街道编码
     */
    streetCode?: string
    /**
     * 详细地址
     */
    address: string
    /**
     * 邮政编码
     */
    postalCode?: string
    /**
     * 国家编码（手机号码前缀）
     */
    countryCode: string
    /**
     * 手机号码
     */
    phone: string
    /**
     * 固定电话号码
     */
    telephone?: string
    /**
     * 是否默认，true-是，false-否
     */
    defaultConsignee?: boolean
  }
  hasInvoice?: boolean
  /**
   * 发票信息，如订单没有发票不需要填写此字段 ,OrderInvoiceVO
   */
  invoice?: {
    /**
     * 发票Id
     */
    invoiceId: number
    /**
     * 发票种类，1-企业，2-个人
     */
    invoiceKind: number
    /**
     * 发票类型，1-增值税普通发票，2-增值税专用发票
     */
    invoiceType: number
    /**
     * 发票台头
     */
    title: string
    /**
     * 纳税号
     */
    taxNo?: string
    /**
     * 开户银行
     */
    bank?: string
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
    phone?: string
    /**
     * 是否默认，true-是，false-否
     */
    defaultInvoice: boolean
  }
  /**
   * 合同信息，如订单没有合同不需要填写此字段 ,OrderContractVO
   */
  contract?: {
    id?: number
    /**
     * 合同文件名称
     */
    fileName: string
    /**
     * 合同文件Url
     */
    url: string
  }
  /**
   * 商品列表 ,MobileOrderProductVO
   */
  products: OrderProductType[]
  /**
   * 积分商品相关字段
   */
  product?: OrderProductType
  vendorMemberId?: number
  vendorRoleId?: number
  vendorMemberName?: string
  /**
   * 优惠券列表，如订单没有优惠券则不需要填写此字段 ,OrderCouponVO
   */
  coupons?: CouponItemType[]
  /**
   * 积分列表，如订单没有积分券则不需要填写此字段 ,OrderCouponVO
   */
  deductions?: DeductionsType[]
  /**
   * 订单送货时间列表 ,BuyerOrderDeliverTimeVO
   */
  deliverTimes?: {
    /**
     * 供应商会员（店铺所属会员、自营商城所属会员）Id
     */
    vendorMemberId: number
    /**
     * 供应商会员（店铺所属会员、自营商城所属会员）角色Id
     */
    vendorRoleId: number
    /**
     * 配送时间，可为空，如不为空，格式为yyyy-MM-dd，或yyyy-MM-ddHH:mm，或yyyy-MM-ddHH:mm-HH:mm
     */
    deliverTime?: string
    /**
     * 订单备注
     */
    remark?: string
  }[]
}

export interface ProductAttributeType {
  customerAttribute: {
    id: number
    groupName: string
    name: string
    isSearch: boolean
  }
  customerAttributeValue: {
    id: number
    value: string
  }
  id: number
}

export interface ProductItemType {
  groupHandPrice: any
  setMealId: any
  purchaseCommodityType: number
  id: number
  attribute: ProductAttributeType[]
  /** 购物车id */
  purchaseId?: number
  /**
   * 供应商会员Id
   */
  vendorMemberId: number
  /**
   * 供应商会员角色Id
   */
  vendorRoleId: number
  /**
   * 供应商会员名称
   */
  vendorMemberName: string
  /**
   * 上游供应商会员Id
   */
  upperMemberId?: number
  /**
   * 上游供应商会员角色Id
   */
  upperMemberRoleId?: number
  /**
   * 上游供应商会员名称
   */
  upperMemberName?: string
  upperCommodityId: number
  upperMemberRoleName: string
  /** 是否含有会员折扣 */
  isMemberPrice: boolean
  /** 折扣 */
  memberDiscount: number
  /** 单位 */
  unitName: string
  unitPrice: number
  /** 商品图片 */
  commodityPic: string
  /**
   * 商品Id
   */
  productId: number
  /**
   * 商品SkuId
   */
  skuId: number
  /**
   * 渠道商品库存Id
   */
  stockId?: number
  /**
   * 购物车Id
   */
  cartId?: number
  /**
   * 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品。字段值来自于商品服务提供的商品信息
   */
  priceType: number
  /**
   * 商品营销活动类型：0-无营销活动的普通商品，1-套餐主商品，2-套餐中的商品，3-换购的主商品，4-被换购的商品，5-其他营销活动商品
   */
  promotionType?: number
  /**
   * 套餐编号，如果是套餐主商品不能为空或0
   */
  groupNo?: number
  /**
   * 换购商品SkuId，如果是被换购的商品，不能为空，且换购前的商品必须在商品列表中，
   */
  parentSkuId?: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand?: string
  /**
   * 计价单位
   */
  unit: string
  /**
   * 商品LogoUrl
   */
  logo: string
  /**
   * 商品规格
   */
  spec?: string
  /**
   * 商品单价
   */
  price: number
  /**
   * 到手价
   */
  refPrice: number
  /**
   * 促销金额
   */
  saleTotalAmount: number
  /**
   * 会员折扣
   */
  discount?: number
  /**
   * 采购数量
   */
  quantity: number
  /**
   * 供方库存
   */
  stock?: number
  /**
   * 是否含税（true-含税，false-不含税）
   */
  tax?: boolean
  /**
   * 税率（百分比的分子部分）
   */
  taxRate?: number
  /**
   * 商品配送方式：1-物流，2-自提，3-无需配送 4-物流+自提
   */
  deliveryType: number
  /**
   * 运费类型，1-卖家承担，2-买家承担，当配送方式是物流时必填
   */
  freightType?: number
  /**
   * 商品重量，当配送方式是物流时要非空且大于0
   */
  weight?: number
  /**
   * 物流模板Id，当配送方式是物流时要非空且大于0
   */
  logisticsTemplateId?: number
  /**
   * 自提地址Id（如配送方式为自提，必填）
   */
  addressId?: number
  /**
   * 自提地址
   */
  address?: string
  /**
   * 接收人
   */
  receiver?: string
  /**
   * 接收人电话
   */
  phone?: string
  /** 购买数量 */
  count: number
  /** 物流信息 */
  logistics: LogisticsInfoType
  /** 配送区域 */
  commodityAreaList: {
    cityCode: string
    cityName: string
    isAllCity: boolean
    isAllRegion: boolean
    provinceCode: string
    provinceName: string
    regionCode: string
    regionName: string
  }[]
  /** 是否进口商品 */
  isCrossBorder: boolean
  /** 是否不限制区域 */
  isAllArea: boolean
  logisticsInfo?: StoreAddressItemType
  /** 自提地址 */
  pickUpAddress?: StoreAddressItemType
  selectDeliveryType: number
  /**
   * 商品关联的营销活动列表，如商品没有营销活动则不需要填写此字段 ,OrderPromotionVO
   */
  promotions?: {
    /**
     * （例如拼团订单）营销记录Id，前端从营销服务获得，可为空
     */
    recordId?: number
    /**
     * 营销活动Id
     */
    promotionId: number
    /**
     * 营销活动名称
     */
    name: string
    /**
     * 营销活动类型枚举
     */
    promotionType: number
    /**
     * 营销活动归属类型枚举
     */
    belongType: number
    /**
     * 营销活动起始时间，格式为yyyy-MM-ddHH:mm:ss
     */
    startTime: string
    /**
     * 营销活动结束时间，格式为yyyy-MM-ddHH:mm:ss
     */
    expireTime: string
  }[]
}

export interface ProductGroupItemType {
  groupNo: ProductGroupItemType[]
  /** 物流信息 */
  logistics: LogisticsInfoType
  /** 自提地址 */
  pickUpAddress?: StoreAddressItemType
  /** 物流+自提时选择的配送方式 */
  selectDeliveryType: number
  commodityList: ProductItemType[]
}
export interface StoreAddressItemType {
  /**
   * 主键id
   */
  id: number
  /**
   * 发货人名称
   */
  shipperName: string
  /** 门店id */
  storeId?: number
  /**  */
  fullAddress: string
  /**
   * 省编号
   */
  provinceCode: string
  /**
   * 省名称
   */
  provinceName: string
  /**
   * 市编号
   */
  cityCode: string
  /**
   * 市名称
   */
  cityName: string
  /**
   * 区编号
   */
  districtCode: string
  /**
   * 区名称
   */
  districtName: string
  /**
   * 街道编码
   */
  streetCode: string
  /**
   * 街道名称
   */
  streetName: string
  /**
   * 详细地址
   */
  address: string
  /**
   * 邮编
   */
  postalCode: string
  /**
   * 手机区号
   */
  areaCode: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 电话号码
   */
  tel: string
  /**
   * 是否默认0-否1-是
   */
  isDefault: number
}

export interface DeliverTimesItemType {
  vendorMemberId: number
  vendorRoleId: number
  deliverTime: string | undefined
  remark: string | undefined
  needDeliverTimes?: boolean
}

export interface OrderItemInfoType {
  /** 店铺id */
  id: number
  /** 订单商品信息 */
  orderList: ProductItemType[]
  /** 店铺名称 */
  shopname: string
  /** 门店地址 */
  storeList?: StoreAddressItemType[]
  /** 送货时间 */
  deliverTime?: DeliverTimesItemType
  memberId: number
  memberRoleId: number
}

export interface OrderGroupItemInfoType {
  /** 店铺id */
  id: number
  /** 订单分组商品信息 */
  orderList: ProductGroupItemType[]
  /** 店铺名称 */
  shopname: string
  /** 门店地址 */
  storeList?: StoreAddressItemType[]
  /** 送货时间 */
  deliverTime?: DeliverTimesItemType
  memberId: number
  memberRoleId: number
}

export interface LogisticsInfoType {
  deliveryType: number
  carriageType: number
  weight: number
  useTemplate: boolean
  templateId: number
  sendAddress: string
  sendAddressId: number
  company: number
}

export interface PayWayItemType {
  fundMode: number
  payType: number
  payTypeName: string
  payChannels: {
    payChannel: number
    payChannelName: string
  }[]
}

export interface PayNodesItemType {
  /** 支付批次 */
  batchNo: number
  /** 支付描述 */
  payNode: string
  /** 支付比例 */
  payRate: number
}

export interface OrderInfoType {
  /** 订单类型 */
  orderType?: ORDER_TYPE
  /** 电子合同Id，当使用电子合同时，此Id不为0，否则为0 */
  contractId: number
  /** 是否有电子合同，true-是，false-否 */
  hasContract: boolean
  /** 是否开发票 */
  isInvoice: boolean
  /** 是否需要支付 */
  requiredPay: boolean
  /** 商城Id */
  shopId: number
  /** 商城类型，1-企业商城 2-积分商城 3-渠道商城4-渠道自有商城 */
  shopType: number
  /** 商城名称 */
  shopName: string
  /** 供应商会员Id */
  supplyMembersId: number
  /** 供应商会员名称 */
  supplyMembersName: string
  /** 供应商会员角色Id */
  supplyMembersRoleId: number
  /** 支付环节列表，如果需要支付，此列表不为空，否则为空  */
  payNodes: PayNodesItemType[]
  /** 支付方式列表 */
  payWayList: PayWayItemType[]
  /** 物流信息 */
  logistics: LogisticsInfoType
  orderList: OrderItemInfoType[]
}
