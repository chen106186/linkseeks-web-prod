import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/** 字段类型 */
export enum Fields_Type {
  STRING = 1, // 字符
  NUMBER = 2, // 数字
  DATE = 3, // 日期
}

/** 选择弹窗类型 */
export enum Select_Content_Type {
  SelectMaterial = 1, // 选择物料
  SelectCategory = 2, // 选择品类
  SelectSupplier = 4, // 选择供应商
  SelectGoods = 6, // 选择商品
  SelectSourceMall = 7, // 选择来源商城
  SelectContract = 8, // 选择合同
  SelectCustomer = 9, // 选择客户
  SelectReqFundsType = 10, // 选择请款类型
  SelectLifeCycle = 11, // 选择生命周期阶段
}

/**
 * EQUAL 1 等于
 *
 * UNEQUAL 2 不等于
 *
 * GREATER_THAN 3 大于
 *
 * GREATER_THAN_EQUAL 4 大于等于
 *
 * LESS_THAN 5 小于
 *
 * LESS_THAN_EQUAL 6 小于等于
 *
 * INCLUDED 7 包含
 *
 * NOT_INCLUDED 8 不包含
 *
 */
export enum CONDITION_VALUE {
  EQUAL = 1, // 等于
  UNEQUAL = 2, // 不等于
  GREATER_THAN = 3, // 大于
  GREATER_THAN_EQUAL = 4, // 大于等于
  LESS_THAN = 5, // 小于
  LESS_THAN_EQUAL = 6, // 小于等于
  INCLUDED = 7, // 包含
  NOT_INCLUDED = 8, // 不包含
}

export const conditionOptions = {
  [Fields_Type.STRING]: [
    {
      label: intl.formatMessage({ id: 'processRuleSetting.is', defaultMessage: '是' }),
      value: CONDITION_VALUE.EQUAL,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.isnot', defaultMessage: '不是' }),
      value: CONDITION_VALUE.UNEQUAL,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.baohan', defaultMessage: '包含' }),
      value: CONDITION_VALUE.INCLUDED,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.bubaohan', defaultMessage: '不包含' }),
      value: CONDITION_VALUE.NOT_INCLUDED,
    },
  ],
  [Fields_Type.NUMBER]: [
    { label: '>', value: CONDITION_VALUE.GREATER_THAN },
    { label: '<', value: CONDITION_VALUE.LESS_THAN },
    { label: '=', value: CONDITION_VALUE.EQUAL },
    { label: '>=', value: CONDITION_VALUE.GREATER_THAN_EQUAL },
    { label: '<=', value: CONDITION_VALUE.LESS_THAN_EQUAL },
    { label: '!=', value: CONDITION_VALUE.UNEQUAL },
  ],
  [Fields_Type.DATE]: [
    {
      label: intl.formatMessage({ id: 'processRuleSetting.is', defaultMessage: '是' }),
      value: CONDITION_VALUE.EQUAL,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.isnot', defaultMessage: '不是' }),
      value: CONDITION_VALUE.UNEQUAL,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.zaizhiqian', defaultMessage: '在之前' }),
      value: CONDITION_VALUE.LESS_THAN,
    },
    {
      label: intl.formatMessage({ id: 'processRuleSetting.zaizhihou', defaultMessage: '在之后' }),
      value: CONDITION_VALUE.GREATER_THAN,
    },
  ],
}

export const interrelationOptions = [
  { label: intl.formatMessage({ id: 'processRuleSetting.and', defaultMessage: '并且' }), value: 1 },
  { label: intl.formatMessage({ id: 'processRuleSetting.or', defaultMessage: '或者' }), value: 2 },
]

export enum RULE_TYPE {
  MATERIAL_MANAGE = 'MATERIAL_MANAGE', // 物料管理
  BUYING_REQUISITION = 'BUYING_REQUISITION', // 请购单
  PURCHASE_PROCESS = 'PURCHASE_PROCESS', // 采购流程
  CONTRACT_MANAGE = 'CONTRACT_MANAGE', // 合同管理
  CONTRACT_COORDINATION = 'CONTRACT_COORDINATION', // 合同协同
  REQUEST_FUNDS_MANAGE = 'REQUEST_FUNDS_MANAGE', // 请款单管理
  PURCHASE_PROCESS_SRM = 'PURCHASE_PROCESS_SRM', // 采购订单(SRM)
  AFTER_SALES_B2B = 'AFTER_SALES_B2B', // 售后管理(B2B)
  QUALITY_MANAGE = 'QUALITY_MANAGE', // 质量管理
  LIFECYCLE_CHANGE = 'LIFECYCLE_CHANGE', // 生命周期变更
}

/**
 * 物料管理 1
 *
 * 采购单流程 2
 *
 * 合同管理 3
 *
 * 合同协同 4
 *
 * 请购单流程 5
 *
 * 请款单管理 6
 *
 * 采购订单(SRM) 7
 *
 * 售后管理(B2B) 8
 *
 * 质量管理 9
 *
 * 生命周期变更 10
 */
export enum RULE_ENR_TYPE {
  MATERIAL_MANAGE = 1, // 物料管理
  PURCHASE_PROCESS = 2, // 采购单流程
  CONTRACT_MANAGE = 3, // 合同管理
  CONTRACT_COORDINATION = 4, // 合同协同
  BUYING_REQUISITION = 5, // 请购单流程
  REQUEST_FUNDS_MANAGE = 6, // 请款单管理
  PURCHASE_PROCESS_SRM = 7, // 采购订单(SRM)
  AFTER_SALES_B2B = 8, // 售后管理(B2B)
  QUALITY_MANAGE = 9, // 质量管理
  LIFECYCLE_CHANGE = 10, // 生命周期变更
}

/**
 * 表格类选择弹窗类型
 */
export const TABLE_SELECT_TYPE = [
  Select_Content_Type.SelectMaterial, // 物料
  Select_Content_Type.SelectSupplier, // 供应商
  Select_Content_Type.SelectGoods, // 商品
  Select_Content_Type.SelectContract, // 选择合同
  Select_Content_Type.SelectCustomer, // 选择客户
]

/**
 * 树结构类选择弹窗类型
 */
export const TREE_SELECT_TYPE = [
  Select_Content_Type.SelectCategory, // 品类
]

/**
 * 多选框结构类选择弹窗类型
 */
export const CHECKBOX_SELECT_TYPE = [
  Select_Content_Type.SelectSourceMall, // 来源商城
  Select_Content_Type.SelectReqFundsType, // 请款类型
]

/**
 * 单选框结构类选择弹窗类型
 */
export const RADIO_SELECT_TYPE = [
  Select_Content_Type.SelectLifeCycle, // 生命周期阶段
]

/**
 * 请款单类型
 */
export const REQ_FUNDS_TYPE = [
  { id: 1, name: intl.formatMessage({ id: 'process.order1', defaultMessage: '物料对账单' }) },
  { id: 9, name: intl.formatMessage({ id: 'process.order2', defaultMessage: '采购询价合同' }) },
  { id: 11, name: intl.formatMessage({ id: 'process.order3', defaultMessage: '采购招标合同' }) },
  { id: 10, name: intl.formatMessage({ id: 'process.order4', defaultMessage: '采购竞价合同' }) },
  { id: 14, name: intl.formatMessage({ id: 'process.order5', defaultMessage: '请购单合同' }) },
  { id: 12, name: intl.formatMessage({ id: 'process.order6', defaultMessage: '采购请购单' }) },
]
