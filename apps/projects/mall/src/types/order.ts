import { ActivityItemType } from './marketing'

/** 物流信息 */
export interface LogisticsInfoType {
  deliveryType: number
  carriageType: number
  weight: number
  useTemplate: boolean
  templateId: number
  sendAddress: number
  company: number
}

/** 销售区域 */
export interface CommodityAreaItemType {
  cityCode: string
  cityName: string
  isAllCity: boolean
  isAllRegion: boolean
  provinceCode: string
  provinceName: string
  regionCode: string
  regionName: string
}

/** 发货地址 | 门店地址 */
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

/** 商品规格 */
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

/** 仓库信息 */
interface OrderProductPosition {
  /** 商品下单仓位id */
  positionId: number
  /** 商品下单仓位名称 */
  positionName: string
  /** 商品下单仓位数量 */
  positionQuantity: number
  /** 下单仓库id */
  warehouseId: number
  /** 下单仓库地址 */
  warehouseAddress: string
}

/** 订单商品 */
export interface ProductItemType {
  attribute: ProductAttributeType[]
  /** 是否含有会员折扣 */
  isMemberPrice: boolean
  /** 折扣 */
  memberDiscount: number
  /** 单位 */
  unitName: string
  unitPrice: number
  /**
   * 商品Id
   */
  productId: number
  /**
   * 商品SkuId
   */
  skuId: number
  /**
   * 购物车Id
   */
  cartId?: number
  /**
   * 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品。字段值来自于商品服务提供的商品信息
   */
  priceType: number
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
  // unit: string
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
  saleTotalAmount?: number
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
  // count: number,
  /** 物流信息 */
  logistics: LogisticsInfoType
  /** 配送区域 */
  commodityAreaList: CommodityAreaItemType[]
  /** 是否进口商品 */
  isCrossBorder: boolean
  /** 是否不限制区域 */
  isAllArea: boolean
  /** 发货地址id */
  shipperAddressId?: number
  logisticsInfo?: StoreAddressItemType
  /** 自提地址 */
  pickUpAddress?: StoreAddressItemType
  /** 当有发货方式是物流+自提时，选中的发货方式 */
  selectDeliveryType?: number
  /** 商品仓位库存数量和仓库地址信息 */
  orderProductPositionVOS?: OrderProductPosition[] | any
  activities?: ActivityItemType[]
  /** 换购/赠品 活动ID */
  activityId?: number
  /** 换购/赠品 活动类型 */
  activityType?: number
  /** 换购/赠品获取活动信息的该字段 */
  promotionId?: number
  /** 主商品id */
  parentSkuId?: number
}

/** 发货时间 */
export interface DeliverTimesItemType {
  vendorMemberId: number
  vendorRoleId: number
  deliverTime: string | undefined
  remark: string | undefined
  needDeliverTimes?: boolean
}

export interface ProductGroupItemType {
  /** 物流信息 */
  logistics: LogisticsInfoType
  /** 自提地址 */
  pickUpAddress?: StoreAddressItemType
  /** 物流+自提时选择的配送方式 */
  selectDeliveryType: number
  commodityList: ProductItemType[]
}

/** 订单数据 */
export interface OrderItemType {
  /** 商家会员ID */
  vendorMemberId: number
  /** 商家会员名称 */
  vendorMemberName: string
  /** 商家会员角色ID */
  vendorRoleId: number
  /** 店铺id */
  storeId: number
  /** 店铺名称 */
  storeName: string
  /** 门店地址 */
  storeList?: StoreAddressItemType[]
  /** 商品列表 */
  commodityList: ProductItemType[]
  /** 发货时间 */
  deliverTime?: DeliverTimesItemType
}

/** 订单根据发货方式分组信息 */
export interface OrderGroupItemType {
  /** 商家会员ID */
  vendorMemberId: number
  /** 商家会员名称 */
  vendorMemberName: string
  /** 商家会员角色ID */
  vendorRoleId: number
  /** 店铺id */
  storeId: number
  /** 店铺名称 */
  storeName: string
  /** 门店地址 */
  storeList?: StoreAddressItemType[]
  /** 分组商品列表 */
  commodityGroupList: ProductGroupItemType[]
}

export enum SummariesType {
  /** 商品金额总计 */
  COMMODITY_AMOUNT = 1,
  /** 税费 */
  TAX = 2,
  /** 会员折扣 */
  MEMBER_DISCOUNT = 3,
  /** 促销 */
  ACTIVITY = 4,
  /** 优惠券 */
  COUPON = 5,
  /** 积分抵扣 */
  POINTS = 6,
  /** 运费 */
  FREIGHT = 7,
  /** 共需支付 */
  PAY_AMOUNT = 10,
}

export interface SummariesItemType {
  type: SummariesType
  /** 类型名称 */
  typeName: string
  /** 此类型总共的金额 */
  totalAmount: number
}

/**
 * 积分信息
 */
export interface IntegralItemType {
  /**
   * 供应会员Id
   */
  vendorMemberId: number
  /**
   * 供应会员角色Id
   */
  vendorRoleId: number
  /**
   * 供应会员名称
   */
  vendorMemberName: string
  /**
   * 是否平台积分，true-是，false-不是
   */
  platform: boolean
  /**
   * 现有的积分
   */
  points?: number
  /**
   * 可使用的积分
   */
  usedPoint?: number
  /**
   * 可抵扣的金额
   */
  reduceAmount?: number
  /**
   * 积分是否可用, true-可用，false-不可用
   */
  usable?: boolean
}

export interface CreateOrderParam {
  /**
   * 商城Id
   */
  shopId: number
  /**
   * 店铺Id
   */
  storeId?: number
  /**
   * 支付方式，创建订单时必填
   */
  payType?: number
  /**
   * 支付渠道，创建订单时必填
   */
  payChannel?: number
  /**
   * 收货地址Id
   */
  addressId?: number
  /**
   * 发票Id，如果有发票，大于0
   */
  invoiceId?: number
  /**
   * 供应商及商品信息
   */
  vendors: {
    /**
     * （供应商、卖家、商品提供者）会员Id
     */
    vendorMemberId: number
    /**
     * （供应商、卖家、商品提供者）会员角色Id
     */
    vendorRoleId: number
    /**
     * 配送时间，可为空，如不为空，格式为yyyy-MM-dd， 或yyyy-MM-dd HH:mm，或yyyy-MM-dd HH:mm-HH:mm
     */
    deliverTime?: string
    /**
     * 订单备注
     */
    remark?: string
    /**
     * 商品列表
     */
    commodities: {
      /**
       * 购物车Id
       */
      cartId?: number
      /**
       * 商品SkuId
       */
      skuId: number
      /**
       * 商品数量
       */
      quantity: number
      /**
       * 赠品或换购商品数据Id
       * <p>数据来自价格计算接口中的赠品、或换购商品</p>
       */
      promotionId?: number
      /**
       * 营销活动类型
       * <p>5-赠送促销，6-换购促销</p>
       */
      activityType?: number
      /**
       * 商品配送方式：1-物流，2-自提，3-无需配送 4-物流+自提
       */
      deliveryType?: number
      /**
       * 自提地址Id（如配送方式为自提，必填）
       */
      addressId?: number
      /**
       * 仅MRO模式商城且skuId所属会员开启仓位同步库存才需要填写此字段
       * 商品仓位库存数量和仓库地址信息
       */
      positions?: {
        /**
         * 商品下单仓位id
         */
        positionId?: number
        /**
         * 商品下单仓位名称
         */
        positionName?: string
        /**
         * 商品下单仓位数量
         */
        positionQuantity?: number
        /**
         * 下单仓库id
         */
        warehouseId?: number
        /**
         * 下单仓库name
         */
        warehouseName?: string
      }[]
    }[]
  }[]
  /**
   * 使用的优惠券领券记录Id列表
   */
  executionIds?: number[]
  /**
   * 积分抵扣列表，如订单没有使用积分抵扣则不需要填写此字段
   */
  points?: {
    /**
     * 积分归属的供应会员（店铺）Id
     */
    vendorMemberId: number
    /**
     * 积分归属的供应会员（店铺）角色Id
     */
    vendorRoleId: number
    /**
     * 是否平台积分，true-是，false-不是
     */
    platform: boolean
  }[]
  /**
   * （计算后的）订单总金额
   */
  totalAmount?: number
}

export enum ORDER_TYPE {
  /** 普通现货订单 */
  normal = 'normal',
  /** 积分订单  */
  integral = 'integral',
  /** 拼团订单 */
  group = 'group',
}

/* --------------------------------- 配送方式 -------------------------------- */
/**
 * 物流
 */
export const DELIVERY_TYPE_LOGISTICS = 1
/**
 * 自提
 */
export const DELIVERY_TYPE_SELF_PICKUP = 2
/**
 * 无须配送
 */
export const DELIVERY_TYPE_NO_DELIVERY = 3
/**
 * 物流+自提
 */
export const DELIVERY_TYPE_LOGISTICS_AND_SELF = 4
