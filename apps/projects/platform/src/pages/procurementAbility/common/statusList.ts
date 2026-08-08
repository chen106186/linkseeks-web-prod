/*
 * @Author: LeeJiancong
 * @Date: 2020-08-01 11:06:09
 * @LastEditors: LeeJiancong
 * @LastEditTime: 2020-09-09 14:47:02
 */
export const TimeList = [
  {
    label: '单据时间（全部）',
    value: 0,
  },
  {
    label: '今天',
    value: 1,
  },
  {
    label: '一周内',
    value: 2,
  },
  {
    label: '一个月内',
    value: 3,
  },
  {
    label: '三个月内',
    value: 4,
  },
  {
    label: '六个月内',
    value: 5,
  },
  {
    label: '一年内',
    value: 6,
  },
  {
    label: '一年前',
    value: 7,
  },
]

/**
 * @description: 需求单发布状态筛选
 * @param {type} 外部1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
 * @return {type} 1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
 */
export const filterExternalStateList = [
  {
    text: '提交需求单',
    value: 1,
  },
  {
    text: '审核需求单',
    value: 2,
  },
  {
    text: '提交报价单',
    value: 3,
  },
  {
    text: '确认报价单',
    value: 4,
  },
  {
    text: '完成',
    value: 5,
  },
  {
    text: '审核不通过',
    value: 6,
  },
  {
    text: '取消报价单',
    value: 7,
  },
]

/**
 * @description: 需求单发布状态筛选
 * @param {type}
 * @return {type} 内
 */
export const filterInteriorStateList = [
  {
    text: '新增需求单',
    value: 1,
  },
  {
    text: '审核需求单一级',
    value: 2,
  },
  {
    text: '审核需求单二级',
    value: 3,
  },
  {
    text: '提交需求单',
    value: 4,
  },
  {
    text: '完成',
    value: 5,
  },
  {
    text: '审核不通过',
    value: 6,
  },
  {
    text: '取消需求单',
    value: 7,
  },
]

/**
 * @description: 商品询价外部状态筛选
 * @param {type}
 * @return {type} 1.提交询价单 2.提交报价单 3.确认报价单 4.报价通过 5.报价不通过
 */
export const filterExternalState = [
  {
    text: '提交询价单',
    value: 1,
  },
  {
    text: '提交报价单',
    value: 2,
  },
  {
    text: '确认报价单',
    value: 3,
  },
  {
    text: '报价通过',
    value: 4,
  },
  {
    text: '报价不通过',
    value: 5,
  },
]

/**
 * @description: 商品询价内部状态筛选
 * @param {type}
 * @return {type} 1.新增询价单 2.审核询价单 3.审核询价单 4.提交询价单 5.完成 6.审核不通过
 */
export const filterInternalState = [
  {
    text: '新增询价单',
    value: 1,
  },
  {
    text: '审核询价单',
    value: 2,
  },
  {
    text: '审核询价单',
    value: 3,
  },
  {
    text: '提交询价单',
    value: 4,
  },
  {
    text: '完成',
    value: 5,
  },
  {
    text: '审核不通过',
    value: 6,
  },
]

/**
 * @description: 商品询价外部状态筛选
 * @param {type}
 * @return {type} 1.提交询价单 2.提交报价单 3.确认报价单 4.报价通过 5.报价不通过
 */
export const filterExternalStateLabelList = [
  {
    label: '提交询价单',
    value: 1,
  },
  {
    label: '提交报价单',
    value: 2,
  },
  {
    label: '确认报价单',
    value: 3,
  },
  {
    label: '报价通过',
    value: 4,
  },
  {
    label: '报价不通过',
    value: 5,
  },
]

/**
 * @description: 商品询价内部状态筛选
 * @param {type}
 * @return {type} 1.新增询价单 2.审核询价单 3.审核询价单 4.提交询价单 5.完成 6.审核不通过
 */
export const filterInternalStateLabelList = [
  {
    label: '新增询价单',
    value: 1,
  },
  {
    label: '审核询价单',
    value: 2,
  },
  {
    label: '审核询价单',
    value: 3,
  },
  {
    label: '提交询价单',
    value: 4,
  },
  {
    label: '完成',
    value: 5,
  },
  {
    label: '审核不通过',
    value: 6,
  },
]

/**
 * @description: 确认询价报价外部状态筛选
 * @param {type}
 * @return {type} 1.待提交询价单 2.待提交报价单 3.待确认报价单 4.报价通过 5.报价不通过
 */
export const confirmFilterExternalState = [
  {
    text: '待提交询价单',
    value: 1,
  },
  {
    text: '待提交报价单',
    value: 2,
  },
  {
    text: '待确认报价单',
    value: 3,
  },
  {
    text: '报价通过',
    value: 4,
  },
  {
    text: '报价不通过',
    value: 5,
  },
]

/**
 * @description: 确认询价报价内部状态筛选
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核 3.待审核 4.审核通过 5.完成 6.审核不通过
 */
export const confirmFilterInteriorState = [
  {
    text: '待提交审核',
    value: 1,
  },
  {
    text: '待审核',
    value: 2,
  },
  {
    text: '待审核',
    value: 3,
  },
  {
    text: '审核通过',
    value: 4,
  },
  {
    text: '完成',
    value: 5,
  },
  {
    text: '审核不通过',
    value: 6,
  },
]

/**
 * @description: 确认询价报价搜索外部状态筛选
 * @param {type}
 * @return {type} 1.待提交询价单 2.待提交报价单 3.待确认报价单 4.报价通过 5.报价不通过
 */
export const searchFilterExternalState = [
  {
    label: '待提交询价单',
    value: 1,
  },
  {
    label: '待提交报价单',
    value: 2,
  },
  {
    label: '待确认报价单',
    value: 3,
  },
  {
    label: '报价通过',
    value: 4,
  },
  {
    label: '报价不通过',
    value: 5,
  },
]

/**
 * @description: 确认询价报价搜索内部状态筛选
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核 3.待审核 4.审核通过 5.完成 6.审核不通过
 */
export const searchFilterInteriorState = [
  {
    label: '待提交审核',
    value: 1,
  },
  {
    label: '待审核',
    value: 2,
  },
  {
    label: '待审核',
    value: 3,
  },
  {
    label: '审核通过',
    value: 4,
  },
  {
    label: '完成',
    value: 5,
  },
  {
    label: '审核不通过',
    value: 6,
  },
]

/***********************需求报价******************************* */
/**
 * @description: 需求报价外部状态筛选
 * @param {type} 外部状态:
 * @return {type} 1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteExternalState = [
  {
    label: '提交需求单',
    value: 1,
  },
  {
    label: '审核需求单',
    value: 2,
  },
  {
    label: '提交报价单',
    value: 3,
  },
  {
    label: '确认报价单',
    value: 4,
  },
  {
    label: '完成',
    value: 5,
  },
  {
    label: '审核不通过',
    value: 6,
  },
  {
    label: '取消报价单',
    value: 7,
  },
]

/**
 * @description: 需求报价内部状态筛选
 * @param {type} 内部状态:
 * @return {type} 1.新增需求单 2.审核需求单一级 3.审核需求单二级 4.提交需求单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteInteriorState = [
  {
    label: '新增需求单',
    value: 1,
  },
  {
    label: '审核需求单一级',
    value: 2,
  },
  {
    label: '审核需求单二级',
    value: 3,
  },
  {
    label: '提交需求单',
    value: 4,
  },
  {
    label: '完成',
    value: 5,
  },
  {
    label: '审核不通过',
    value: 6,
  },
  {
    label: '取消报价单',
    value: 7,
  },
]

/****************************确认需求报价********************************/
/**
 * @description: 确认需求报价外部状态筛选
 * @param {type} 外部状态:
 * @return {type} 1.待提交需求单 2.待审核需求单 3.待提交报价单 4.待确认报价单 5.确认通过 6.确认不通过
 */
export const confirmDemandQuoteExternalState = [
  {
    label: '待提交需求单',
    value: 1,
  },
  {
    label: '待审核需求单',
    value: 2,
  },
  {
    label: '待提交报价单',
    value: 3,
  },
  {
    label: '待确认报价单',
    value: 4,
  },
  {
    label: '确认通过',
    value: 5,
  },
  {
    label: '确认不通过',
    value: 6,
  },
]

/**
 * @description: 确认需求报价内部状态筛选
 * @param {type} 内部状态:
 * @return {type} 1.待提交审核 2.待审核报价单 3.待审核报价单 4.待提交报价单 5.完成（审核通过） 6.审核不通过
 */
export const confirmDemandQuoteInteriorState = [
  {
    label: '待提交审核',
    value: 1,
  },
  {
    label: '待审核报价单',
    value: 2,
  },
  {
    label: '待审核报价单',
    value: 3,
  },
  {
    label: '待提交报价单',
    value: 4,
  },
  {
    label: '完成（审核通过）',
    value: 5,
  },
  {
    label: '审核不通过',
    value: 6,
  },
]
