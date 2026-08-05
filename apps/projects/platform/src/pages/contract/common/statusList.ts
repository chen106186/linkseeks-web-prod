import React, { useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/*
 * @Author: LeeJiancong
 * @Date: 2020-08-01 11:06:09
 * @LastEditors: LeeJiancong
 * @LastEditTime: 2020-09-09 14:47:02
 */
export const TimeList = [
  {
    label: intl.formatMessage({ id: 'contract.danjushijianquanbu' }),
    value: 0,
  },
  {
    label: intl.formatMessage({ id: 'contract.jintian' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.yizhounei' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.yigeyuenei' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.sangeyuenei' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.liugeyuenei' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.yiniannei' }),
    value: 6,
  },
  {
    label: intl.formatMessage({ id: 'contract.yinianqian' }),
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
    text: intl.formatMessage({ id: 'contract.tijiaoxuqiudan' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhexuqiudan' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.tijiaobaojiadan' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.querenbaojiadan' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
    value: 6,
  },
  {
    text: intl.formatMessage({ id: 'contract.quxiaobaojiadan' }),
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
    text: intl.formatMessage({ id: 'contract.xinzengxuqiudan' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhexuqiudanyiji' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhexuqiudanerji' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.tijiaoxuqiudan' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
    value: 6,
  },
  {
    text: intl.formatMessage({ id: 'contract.quxiaoxuqiudan' }),
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
    text: intl.formatMessage({ id: 'contract.tijiaoxunjiadan' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.tijiaobaojiadan' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.querenbaojiadan' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.baojiatongguo' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.baojiabutongguo' }),
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
    text: intl.formatMessage({ id: 'contract.xinzengxunjiadan' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhexunjiadan' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhexunjiadan' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.tijiaoxunjiadan' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.tijiaoxunjiadan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.tijiaobaojiadan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.querenbaojiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.baojiatongguo' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.baojiabutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.xinzengxunjiadan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhexunjiadan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhexunjiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.tijiaoxunjiadan' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
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
    text: intl.formatMessage({ id: 'contract.daitijiaoxunjiadan' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.daitijiaobaojiadan' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.daiquerenbaojiadan' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.baojiatongguo' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.baojiabutongguo' }),
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
    text: intl.formatMessage({ id: 'contract.daitijiaoshenhe' }),
    value: 1,
  },
  {
    text: intl.formatMessage({ id: 'contract.daishenhe' }),
    value: 2,
  },
  {
    text: intl.formatMessage({ id: 'contract.daishenhe' }),
    value: 3,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhetongguo' }),
    value: 4,
  },
  {
    text: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    text: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.daitijiaoxunjiadan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.daitijiaobaojiadan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.daiquerenbaojiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.baojiatongguo' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.baojiabutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.daitijiaoshenhe' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.daishenhe' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.daishenhe' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhetongguo' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.tijiaoxuqiudan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhexuqiudan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.tijiaobaojiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.querenbaojiadan' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
    value: 6,
  },
  {
    label: intl.formatMessage({ id: 'contract.quxiaobaojiadan' }),
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
    label: intl.formatMessage({ id: 'contract.xinzengxuqiudan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhexuqiudanyiji' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhexuqiudanerji' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.tijiaoxuqiudan' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.wancheng' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
    value: 6,
  },
  {
    label: intl.formatMessage({ id: 'contract.quxiaobaojiadan' }),
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
    label: intl.formatMessage({ id: 'contract.daitijiaoxuqiudan' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.daishenhexuqiudan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.daitijiaobaojiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.daiquerenbaojiadan' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.querentongguo' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.querenbutongguo' }),
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
    label: intl.formatMessage({ id: 'contract.daitijiaoshenhe' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'contract.daishenhebaojiadan' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'contract.daishenhebaojiadan' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'contract.daitijiaobaojiadan' }),
    value: 4,
  },
  {
    label: intl.formatMessage({ id: 'contract.wanchengshenhetongguo' }),
    value: 5,
  },
  {
    label: intl.formatMessage({ id: 'contract.shenhebutongguo' }),
    value: 6,
  },
]
