import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/** 商品类型枚举 */
export enum CommodityType {
  /** 自营商品 */
  SELF_SUPPORT_COMMODITY = 1,
  /** 上游商品 */
  UPPER_SUPPORTER_COMMODITY = 2,
  /** 代销商品 */
  AGENT_SALE_COMMODITY = 3,
}

/**
 * 商品类型文本
 */
export const COMMDITY_TYPE_TEXTS = {
  [CommodityType.SELF_SUPPORT_COMMODITY]: translate('web.resource.commodity.ziyinshanpin'),
  [CommodityType.UPPER_SUPPORTER_COMMODITY]: translate('web.resource.commodity.shangyougongyingshanpin'),
}

// 商品定价枚举
export enum PRICE_TYPE_ENUM {
  /**
   * 现货价格
   */
  SPOT_PRICE = 1,
  /**
   * 价格需要询价
   */
  INQUIRY_PRICE = 2,
  /**
   * 积分兑换商品
   */
  POINT_GOODS_PRICE = 3,
  /**
   * 赠品
   */
  GIFT_PRICE = 4,
}

export const PRICE_TYPE_TEXTS = {
  [PRICE_TYPE_ENUM.SPOT_PRICE]: translate('web.resource.commodity.xianhuojiage'),
  [PRICE_TYPE_ENUM.INQUIRY_PRICE]: translate('web.resource.commodity.jiagexuyaoxunjia'),
  [PRICE_TYPE_ENUM.POINT_GOODS_PRICE]: translate('web.resource.commodity.jifenduihuanshanping'),
  [PRICE_TYPE_ENUM.GIFT_PRICE]: translate('web.resource.commodity.zengpin'),
}

// 物流 - 配送方式
export enum DELIVERY_TYPE_ENUM {
  // 物流
  LOGISTICS = 1,
  // 自提
  SELF_PICKUP = 2,
  // 物流+自提
  LOGISTICS_SELF_PICKUP = 4,
  // 无需配送
  NOT_SEND = 3,
}
export const DELIVERY_TYPE_TEXTS = {
  [DELIVERY_TYPE_ENUM.LOGISTICS]: translate('web.resource.commodity.wuliuleixing1'),
  [DELIVERY_TYPE_ENUM.SELF_PICKUP]: translate('web.resource.commodity.wuliuleixing2'),
  [DELIVERY_TYPE_ENUM.LOGISTICS_SELF_PICKUP]: translate('web.resource.commodity.wuliuleixing3'),
  [DELIVERY_TYPE_ENUM.NOT_SEND]: translate('web.resource.logistics.wuliu2'),
}

// 物流 - 运费方式
export enum FREIGHT_TYPE_ENUM {
  // 卖家承担
  SELLER = 1,
  // 买家承担
  BUYER = 2,
}
export const FREIGHT_TYPE_TEXTS = {
  [FREIGHT_TYPE_ENUM.BUYER]: translate('web.resource.commodity.maijiachendanyunfei2'),
  [FREIGHT_TYPE_ENUM.SELLER]: translate('web.resource.commodity.maijiachendan'),
}

// 约定SKU属性名的前缀，用于获取和写入值
// 类目属性前缀
export const CATEGORY_ATTR_NAME_PREFIX = 'CATEGORY_ATTR_NAME_PREFIX'

// 类目属性文本回显
export const CATEGORY_ATTR_NAME_TEXT_PREFIX = 'CATEGORY_ATTR_NAME_TEXT_PREFIX'
// 规格属性前缀
export const SPECS_ATTR_NAME_PREFIX = 'SPECS_ATTR_NAME_PREFIX'

// 规格属性文本详情回显
export const SPECS_ATTR_NAME_TEXT_PREFIX = 'SPECS_ATTR_NAME_TEXT_PREFIX'

// 规格设置中的 表单项
export const SPECS_SETTING_FORM_NAME = 'SPECS_SETTING_FORM_NAME'

// 进行sku筛选使用的
export enum ATTR_FORM_ITEM_TYPE {
  /**
   * 单选
   */
  SINGLE = 'SINGLE',
  /**
   * 多选
   */
  MULTIPLE = 'MULTIPLE',
  /**
   * 输入
   */
  INPUT = 'INPUT',
}

export enum CONTENT_TYPE {
  TEXT = 1,
  PICTURE,
  VIDEO,
}
export interface ContentProp {
  id?: string
  type: CONTENT_TYPE
  content?: string
  url?: string
  linkType?: 1 | 2
  link?: string
}

export enum COMMODITY_PAGE_STATUS {
  ADD = 'add',
  EDIT = 'edit',
  DETAIL = 'detail',
  DRAFT = 'draft',
}

export enum COMMODITY_CATEGORY_TYPE_ENUM {
  /**
   * 实物商品
   */
  SHIWU = 1,

  /**
   * 虚拟商品
   */
  XUNI = 2,

  /**
   * 服务商品
   */
  FUWU = 3,

  /**
   * 积分兑换商品
   */
  JIFENDUIHUAN = 4,
}

export const COMMODITY_CATEGORY_TYPE_MAPS = {
  [COMMODITY_CATEGORY_TYPE_ENUM.SHIWU]: translate('web.resource.commodity.shiwushanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.XUNI]: translate('web.resource.commodity.xunishanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.FUWU]: translate('web.resource.commodity.fuwushanpin'),
  [COMMODITY_CATEGORY_TYPE_ENUM.JIFENDUIHUAN]: translate('web.resource.commodity.jifenduihuanshanping'),
}

export interface AttrFormItem {
  id: string
  name: string
  isMust: boolean
  // 是否是规格属性
  isPrice: boolean
  required: boolean
}

export interface InputAttrFormItem extends AttrFormItem {}
export interface SelectAttrFormItem extends AttrFormItem {
  options: { label: string; value: any; id: any }[]
  // 新增属性弹窗
  attrModalRef: any
}

// ************** SKU ******************
export enum CATEGORY_TYPE {
  /**
   * 单选
   */
  SINGLE = 1,
  /**
   * 多选
   */
  MULTIPLE = 2,
  /**
   * 输入
   */
  INPUT = 3,
}

// sku属性组件
export interface ProductAttrComponentProp extends AttrFormItem {
  /**
   * 品类类型
   */
  type: CATEGORY_TYPE

  /**
   * 表单项
   */
  name: string
  /**
   * 如果是单选/多选情况下，该字段表示对应的options项
   */
  customerAttributeValueList?: any[]
}
