import React, { ReactNode, useState } from 'react'
import { Badge, Tag } from 'antd'
import statuStyle from './colorTag'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/****** ***********************  需求单 ************************** */
/**
 * @description: 需求提交一级
 * @param {type}
 * @return {type}
 */
export const interiorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.daitijiaoshenhe' })} />)
    : text === 2
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daishenhe' })} />)
    : text === 3
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.shenhetongguo' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/**
 * @description: 需求提交二级
 * @param {type}
 * @return {type}
 */
export const interiorStateTwo = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.daitijiaoshenhe' })} />)
    : text === 3
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daishenhe' })} />)
    : text === 4
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.shenhetongguo' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 内
 */

export const enquirySearchInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.xinzengxuqiudan' })} />)
    : text === 2
    ? (component = <Badge color="#FFC400" text={intl.formatMessage({ id: 'contract.shenhexuqiudanyiji' })} />)
    : text === 3
    ? (component = <Badge color="#FFC400" text={intl.formatMessage({ id: 'contract.shenhexuqiudanerji' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daitijiaoxuqiudan' })} />)
    : text === 5
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : text === 6
    ? (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
    : (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.quxiaoxuqiudan' })} />)
  return component
}
/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 外
 */
export const enquirySearchexternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.tijiaoxuqiudan' })} />)
    : text === 2
    ? (component = <Badge color="#FFC400" text={intl.formatMessage({ id: 'contract.shenhexuqiudan' })} />)
    : text === 3
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.tijiaobaojiadan' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.querenbaojiadan' })} />)
    : text === 5
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : text === 6
    ? (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
    : (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.quxiaobaojiadan' })} />)
  return component
}

/****** *********************** 报价单 ************************** */
//内部
// 内部状态:1.新增需求单 2.审核需求单一级 3.审核需求单二级 4.提交需求单 5.完成 6.审核不通过 7.取消报价单
export const enquiryOfferSearchInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.xinzengbaojiadan' })} />)
    : text === 2
    ? (component = <Badge color="#FFC400" text={intl.formatMessage({ id: 'contract.shenhebaojiadanyiji' })} />)
    : text === 3
    ? (component = <Badge color="#FFC400" text={intl.formatMessage({ id: 'contract.shenhebaojiadanerji' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })} />)
    : text === 5
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : text === 6
    ? (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
    : (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.quxiaobaojiadan' })} />)
  return component
}

//外部
export const enquiryOfferSearchexternalState = (text: any) => {
  let component: ReactNode = null
  // 外部状态:1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
  text === 1
    ? (component = <span style={statuStyle.default}>{intl.formatMessage({ id: 'contract.daitijiaoxuqiudan' })}</span>)
    : text === 2
    ? (component = <span style={statuStyle.default}>{intl.formatMessage({ id: 'contract.shenhexuqiudan' })}</span>)
    : text === 3
    ? (component = <span style={statuStyle.confirm}>{intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })}</span>)
    : text === 4
    ? (component = <span style={statuStyle.confirm}>{intl.formatMessage({ id: 'contract.querenbaojiadan' })}</span>)
    : text === 5
    ? (component = <span style={statuStyle.success}>{intl.formatMessage({ id: 'contract.wancheng' })}</span>)
    : text === 6
    ? (component = <span style={statuStyle.Error}>{intl.formatMessage({ id: 'contract.shenhebutongguo' })}</span>)
    : (component = <span style={statuStyle.default}>{intl.formatMessage({ id: 'contract.quxiaobaojiadan' })}</span>)
  return component
}

/****** *********************** 确认报价单 ************************** */
/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 外
 */
export const enquiryOfferConfirmSearchexternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.tijiaoxuqiudan' })} />)
    : text === 2
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })} />)
    : (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.tijiaobaojiadan' })} />)
  return component
}
export const enquiryOfferConfirmSearchInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.daishenhe' })} />)
    : text === 2
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.yijishenhetongguo' })} />)
    : text === 3
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.erjishenhetongguo' })} />)
    : (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.tijiaobaojiadan' })} />)
  return component
}

/****** *********************** 待新增询价单 ************************** */
/**
 * @description: 内部状态查询
 * @param {type}
 * @return {type}  1.新增询价单 2.审核询价单 3.审核询价单 4.提交询价单 5.完成 6.审核不通过
 */
export const quoteOrderInternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.xinzengxunjiadan' })} />)
    : text === 2
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.shenhexunjiadan' })} />)
    : text === 3
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.shenhexunjiadan' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.tijiaoxunjiadan' })} />)
    : text === 5
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/**
 * @description: 确认询价报价-报价单查询-外部状态查询
 * @param {type}
 * @return {type} 1.提交询价单 2.提交报价单 3.确认报价单 4.报价通过 5.报价不通过
 */
export const inquiryQuoteOuterState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.tijiaoxunjiadan' })}</Tag>)
    : text === 2
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.tijiaobaojiadan' })}</Tag>)
    : text === 3
    ? (component = <Tag color="processing">{intl.formatMessage({ id: 'contract.querenbaojiadan' })}</Tag>)
    : text === 4
    ? (component = <Tag color="success">{intl.formatMessage({ id: 'contract.baojiatongguo' })}</Tag>)
    : (component = <Tag color="error">{intl.formatMessage({ id: 'contract.baojiabutongguo' })}</Tag>)
  return component
}

/************************************确认询价报价************************************ */
/**
 * @description: 外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type}  1.待提交询价单 2.待提交报价单 3.待确认报价单 4.报价通过 5.报价不通过
 */
export const confirmExternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daitijiaoxunjiadan' })}</Tag>)
    : text === 2
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })}</Tag>)
    : text === 3
    ? (component = <Tag color="processing">{intl.formatMessage({ id: 'contract.daiquerenbaojiadan' })}</Tag>)
    : text === 4
    ? (component = <Tag color="success">{intl.formatMessage({ id: 'contract.baojiatongguo' })}</Tag>)
    : (component = <Tag color="error">{intl.formatMessage({ id: 'contract.baojiabutongguo' })}</Tag>)
  return component
}
/**
 * @description: 确认询价报价-报价单查询-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核 3.待审核 4.审核通过 5.完成 6.审核不通过
 */
export const confirmInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.daitijiaoshenhe' })} />)
    : text === 2
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.daishenhe' })} />)
    : text === 3
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.daishenhe' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.shenhetongguo' })} />)
    : text === 5
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/***************************确认需求报价************************** */
/**
 * @description: 确认需求报价-外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交需求单 2.待审核需求单 3.待提交报价单 4.待确认报价单 5.确认通过 6.确认不通过
 */
export const demandExternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daitijiaoxuqiudan' })}</Tag>)
    : text === 2
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daishenhexuqiudan' })}</Tag>)
    : text === 3
    ? (component = <Tag color="processing">{intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })}</Tag>)
    : text === 4
    ? (component = <Tag color="warning">{intl.formatMessage({ id: 'contract.daiquerenbaojiadan' })}</Tag>)
    : text === 5
    ? (component = <Tag color="success">{intl.formatMessage({ id: 'contract.querentongguo' })}</Tag>)
    : (component = <Tag color="error">{intl.formatMessage({ id: 'contract.baojiabutongguo' })}</Tag>)
  return component
}

/**
 * @description: 确认需求报价-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核报价单 3.待审核报价单 4.待提交报价单 5.完成（审核通过） 6.审核不通过
 */
export const demandInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.daitijiaoshenhe' })} />)
    : text === 2
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.daishenhebaojiadan' })} />)
    : text === 3
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.daishenhebaojiadan' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })} />)
    : text === 5
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.wanchengshenhetongguo' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/********************************需求报价 & 需求发布********************************* */
/**
 * @description: 需求报价-外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteExternalState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daitijiaoxuqiudan' })}</Tag>)
    : text === 2
    ? (component = <Tag color="default">{intl.formatMessage({ id: 'contract.daishenhexuqiudan' })}</Tag>)
    : text === 3
    ? (component = <Tag color="processing">{intl.formatMessage({ id: 'contract.daitijiaobaojiadan' })}</Tag>)
    : text === 4
    ? (component = <Tag color="warning">{intl.formatMessage({ id: 'contract.daiquerenbaojiadan' })}</Tag>)
    : text === 5
    ? (component = <Tag color="success">{intl.formatMessage({ id: 'contract.querentongguo' })}</Tag>)
    : (component = <Tag color="error">{intl.formatMessage({ id: 'contract.baojiabutongguo' })}</Tag>)
  return component
}

/**
 * @description: 需求报价-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.新增需求单 2.审核需求单一级 3.审核需求单二级 4.提交需求单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteInteriorState = (text: any) => {
  let component: ReactNode = null
  text === 1
    ? (component = <Badge status="default" text={intl.formatMessage({ id: 'contract.xinzengxuqiudan' })} />)
    : text === 2
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.shenhexuqiudanyiji' })} />)
    : text === 3
    ? (component = <Badge status="warning" text={intl.formatMessage({ id: 'contract.shenhexuqiudanerji' })} />)
    : text === 4
    ? (component = <Badge status="processing" text={intl.formatMessage({ id: 'contract.tijiaoxuqiudan' })} />)
    : text === 5
    ? (component = <Badge status="success" text={intl.formatMessage({ id: 'contract.wancheng' })} />)
    : text === 6
    ? (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
    : (component = <Badge status="error" text={intl.formatMessage({ id: 'contract.shenhebutongguo' })} />)
  return component
}

/********************************需求发布******************************* */
