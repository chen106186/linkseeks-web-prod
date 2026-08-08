import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { Badge } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { formatTimeString } from '@/utils'
import { transformConstantsEnum } from '@linkseeks/tools'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
/** 商品 渠道商品 快捷修改单价 共用常量 */

/** 商品（渠道商品）状态 */
export const productStatusLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.3' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.4' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.5' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.6' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.7' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.productStatusLabel.8' }),
]

/** 商品状态对应的颜色 */
export const productStatusColor = ['', 'blue', 'cyan', 'orange', 'green', 'green', 'purple', 'gold', 'grey']

/** 品类类型 */
export const customerCategoryTypeLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.customerCategoryTypeLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.customerCategoryTypeLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.customerCategoryTypeLabel.3' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.customerCategoryTypeLabel.4' }),
]

/** 商品定价类型 */
export const priceTypeLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.3' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.4' }),
]

/** 商品物流类型 */
export const deliveryTypeLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.deliveryTypeLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.deliveryTypeLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.deliveryTypeLabel.3' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.deliveryTypeLabel.4' }),
]

/** 商品运费类型 */
export const carriageTypeLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.carriageTypeLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.carriageTypeLabel.2' }),
]

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

/** 商品描述图片类型枚举 */
export enum CommodityImagesType {
  /** 描述图片 */
  DESCRIPTION_IMAGES = 1,
  /** 厂商资质图片 */
  CERTIFICATION_IMAGES = 2,
  /** 商品检测报告 */
  REPORT_IMAGES = 3,
}

/** 商品的操作文本 */
export const opeartionLabel = [
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.opeartionLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.opeartionLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.opeartionLabel.3' }),
]

/** 查看商品 审核历史列 */
export const columns: ColumnType<any>[] = [
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.memberRoleId' }),
    dataIndex: 'memberRoleId',
    key: 'memberRoleId',
    render: (t, c, i) => i + 1,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.memberRoleName' }),
    dataIndex: 'memberRoleName',
    key: 'memberRoleName',
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.status' }),
    dataIndex: 'status',
    key: 'status',
    render: (t, r) => <Badge color={productStatusColor[t]} text={productStatusLabel[t]} />,
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.operation' }),
    dataIndex: 'operation',
    key: 'operation',
    render: (text) => opeartionLabel[text],
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.createTime' }),
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text: any) => formatTimeString(text),
  },
  {
    title: getIntl().formatMessage({ id: 'commodity.products.constant.columns.checkRemark' }),
    dataIndex: 'checkRemark',
    key: 'checkRemark',
  },
]

/** 阶梯价格排序函数 */
export const orderlyLadderPrice = (data) => {
  try {
    if (JSON.stringify(data) !== '{}') {
      let tempObject = {}
      Object.keys(data)
        .sort((x, y) => Number(x.split('-')[0]) - Number(y.split('-')[0]))
        .forEach((key) => {
          tempObject[key] = data[key]
        })
      return tempObject
    } else {
      return data
    }
  } catch (error) {
    console.log(error)
  }
}

export const upperCommoditySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.name' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        brandName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.brandName' }),
          },
        },
        customerCategoryName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.constant.upperCommoditySchema.customerCategoryName',
            }),
          },
        },
        priceType: {
          type: 'number',
          enum: [
            {
              label: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.priceType.1' }),
              value: 1,
            },
            {
              label: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.priceType.2' }),
              value: 2,
            },
          ],
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.products.constant.upperCommoditySchema.priceType.placeholder',
            }),
            style: { width: '160px' },
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.memberName' }),
            style: { width: '160px' },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'commodity.products.constant.upperCommoditySchema.submit' }),
          },
        },
      },
    },
  },
}

export const filterUsefulData = (data) => {
  // 仅获取表单所需要的字段数据
  return {
    name: data.name,
    brand: data.brand,
    customerCategory: data.customerCategory,
    slogan: data.slogan,
    sellingPoint: data.sellingPoint || [],
    commodityAreaList: data.commodityAreaList,
    isUpdateAttribute: data.isUpdateAttribute,
    unitId: data.unitId,
    unitName: data.unitName,
    subUnitId: data.subUnitId,
    subUnitName: data.subUnitName,
    minOrder: data.minOrder,
    isMemberPrice: data.isMemberPrice,
    priceType: data.priceType,
    commodityAttributeList: data.commodityAttributeList,
    unitPriceAndPicList: data.commoditySkuList,
    isAllAttributePic: data.isAllAttributePic,
    commodityRemark: data.commodityRemark,
    logistics: { ...data.logistics, sendCycle: data.sendCycle },
    isInvoice: data.isInvoice,
    marks: data.marks,
    packing: data.packing,
    afterService: data.afterService,
    isTax: true,
    taxRate: data.taxRate,
    title: data.title,
    keywords: data.keywords,
    description: data.description,
    type: data.type,
    createTime: data.createTime,
    isCrossBorder: data.isCrossBorder,
  }
}

export const filterUsefulDraftData = (data) => {
  console.log(data, 'data')
  return {
    name: data.name,
    // brandId: data.brandId,
    brand: { id: data.brandId, name: data.brandName },
    customerCategoryId: data.customerCategoryId,
    slogan: data.slogan,
    sellingPoint: data.sellingPoint || [],
    commodityAreaList: data.commodityAreaList || [],
    isUpdateAttribute: data.isUpdateAttribute,
    unitId: data.unitId,
    unitName: data.unitName,
    subUnitId: data.subUnitId,
    subUnitName: data.subUnitName,
    minOrder: data.minOrder,
    isMemberPrice: data.isMemberPrice,
    priceType: data.priceType,
    commodityAttributeList: data.commodityAttributeList || [],
    unitPriceAndPicList: data.unitPriceAndPicList || [],
    isAllAttributePic: data.isAllAttributePic,
    commodityRemark: data.commodityRemark,
    logistics: { ...data.logistics, sendCycle: data.sendCycle },
    isInvoice: data.isInvoice,
    marks: data.marks,
    packing: data.packing,
    afterService: data.afterService,
    isTax: true,
    taxRate: data.taxRate,
    title: data.title,
    keywords: data.keywords,
    description: data.description,
    type: data.type,
    createTime: data.createTime,
    isCrossBorder: data.isCrossBorder,
    // 是否草稿
    draft: data.draft,
  }
}

/**
 *
 * 商品定价
 */
export const CommodityPriceEnum = [
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.1' }),
    value: 1,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.2' }),
    value: 2,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.3' }),
    value: 3,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.priceTypeList.4' }),
    value: 4,
  },
]

/**
 * 商品状态
 */
export const CommodityStatusEnum = [
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.1' }),
    value: 1,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.2' }),
    value: 2,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.3' }),
    value: 3,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.4' }),
    value: 4,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.5' }),
    value: 5,
  },
  {
    label: getIntl().formatMessage({ id: 'commodity.products.schema.productSchema.statusList.6' }),
    value: 6,
  },
]

// ****************** 重构常量 **********************

// 商品定价
export const [priceTypeStatusMaps, priceTypeStatusList, priceTypeTextList] = transformConstantsEnum([
  '',
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.1' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.2' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.3' }),
  getIntl().formatMessage({ id: 'commodity.products.constant.priceTypeLabel.4' }),
])

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
  LOGISTICS_SELF_PICKUP = 3,
  // 无需配送
  NOT_SEND = 4,
}
export const DELIVERY_TYPE_TEXTS = {
  [DELIVERY_TYPE_ENUM.LOGISTICS]: translate('web.resource.commodity.wuliuleixing1'),
  [DELIVERY_TYPE_ENUM.SELF_PICKUP]: translate('web.resource.commodity.wuliuleixing2'),
  [DELIVERY_TYPE_ENUM.LOGISTICS_SELF_PICKUP]: translate('web.resource.commodity.wuliuleixing3'),
  [DELIVERY_TYPE_ENUM.NOT_SEND]: translate('web.resource.logistics.wuliu2'),
}

// 物流 - 运费方式
export enum FREIGHT_TYPE_ENUM {
  // 买家承担
  BUYER = 1,
  // 卖家承担
  SELLER = 2,
}
export const FREIGHT_TYPE_TEXTS = {
  [FREIGHT_TYPE_ENUM.BUYER]: translate('web.resource.commodity.maijiachendanyunfei2'),
  [FREIGHT_TYPE_ENUM.SELLER]: translate('web.resource.commodity.maijiachendan'),
}
