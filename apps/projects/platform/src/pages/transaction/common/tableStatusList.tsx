import { ReactNode} from 'react';
import {Badge, Tag} from 'antd'
import statuStyle from './colorTag'

/****** ***********************  需求单 ************************** */
/**
 * @description: 需求提交一级
 * @param {type}
 * @return {type}
 */
export const interiorState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="待提交审核" />:
  text === 2 ? component = <Badge status='processing' text="待审核" />:
  text === 3 ? component = <Badge status='success' text="审核通过" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}


/**
 * @description: 需求提交二级
 * @param {type}
 * @return {type}
 */
export const interiorStateTwo = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="待提交审核" />:
  text === 3 ? component = <Badge status='processing' text="待审核" />:
  text === 4 ? component = <Badge status='success' text="审核通过" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}

/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 内
 */

export const enquirySearchInteriorState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="新增需求单" />:
  text === 2 ? component = <Badge color="#FFC400"  text="审核需求单一级" />:
  text === 3 ? component = <Badge color="#FFC400" text="审核需求单二级" />:
  text === 4 ? component = <Badge status='processing' text="待提交需求单" />:
  text === 5 ? component = <Badge status='success' text="完成" />:
  text === 6 ? component = <Badge status='error' text="审核不通过" />:
  component = <Badge status="default" text="取消需求单" />
  return component;
}
/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 外
 */
export const enquirySearchexternalState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="提交需求单" />:
  text === 2 ? component = <Badge color="#FFC400" text="审核需求单" />:
  text === 3 ? component = <Badge status='default' text="提交报价单" />:
  text === 4 ? component = <Badge status='processing' text="确认报价单" />:
  text === 5 ? component = <Badge status='success' text="完成" />:
  text === 6 ? component = <Badge status='error' text="审核不通过" />:
  component = <Badge status="default" text="取消报价单" />
  return component;
}






/****** *********************** 报价单 ************************** */
//内部
// 内部状态:1.新增需求单 2.审核需求单一级 3.审核需求单二级 4.提交需求单 5.完成 6.审核不通过 7.取消报价单
export const enquiryOfferSearchInteriorState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="新增报价单" />:
  text === 2 ? component = <Badge color="#FFC400"  text="审核报价单一级" />:
  text === 3 ? component = <Badge color="#FFC400" text="审核报价单二级" />:
  text === 4 ? component = <Badge status='processing' text="待提交报价单" />:
  text === 5 ? component = <Badge status='success' text="完成" />:
  text === 6 ? component = <Badge status='error' text="审核不通过" />:
  component = <Badge status="default" text="取消报价单" />
  return component;
}

//外部
export const enquiryOfferSearchexternalState = (text:any) =>  {
  let component: ReactNode = null;
  // 外部状态:1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
  text === 1 ? component = <span style={statuStyle.default}>待提交需求单</span>:
  text === 2 ? component = <span style={statuStyle.default}>审核需求单</span>:
  text === 3 ? component = <span style={statuStyle.confirm}>待提交报价单</span>:
  text === 4 ? component = <span style={statuStyle.confirm}>确认报价单</span>:
  text === 5 ? component = <span style={statuStyle.success}>完成</span>:
  text === 6 ? component = <span style={statuStyle.Error}>审核不通过</span>:
  component = <span style={statuStyle.default}>取消报价单</span>
  return component;
}


/****** *********************** 确认报价单 ************************** */
/**
 * @description: 专用需求发布的需求单查询
 * @param {type}
 * @return {type} 外
 */
export const enquiryOfferConfirmSearchexternalState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="提交需求单" />:
  text === 2 ? component = <Badge status='processing' text="待提交报价单" />:
  component = <Badge status='default' text="提交报价单" />
  return component;
}
export const enquiryOfferConfirmSearchInteriorState = (text:any) =>  {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="待审核" />:
  text === 2 ? component = <Badge status='success' text="一级审核通过" />:
  text === 3?  component = <Badge status="success"  text="二级审核通过" />:
   component = <Badge status='processing' text="提交报价单" />
  return component;
}

/****** *********************** 待新增询价单 ************************** */
/**
 * @description: 内部状态查询
 * @param {type}
 * @return {type}  1.新增询价单 2.审核询价单 3.审核询价单 4.提交询价单 5.完成 6.审核不通过
 */
export const quoteOrderInternalState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="新增询价单" />:
  text === 2 ? component = <Badge status='warning' text="审核询价单" />:
  text === 3 ? component = <Badge status='warning' text="审核询价单" />:
  text === 4 ? component = <Badge status='processing' text="提交询价单" />:
  text === 5 ? component = <Badge status='success' text="完成" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}

/**
 * @description: 确认询价报价-报价单查询-外部状态查询
 * @param {type}
 * @return {type} 1.提交询价单 2.提交报价单 3.确认报价单 4.报价通过 5.报价不通过
 */
export const inquiryQuoteOuterState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Tag color="default">提交询价单</Tag>:
  text === 2 ? component = <Tag color="default">提交报价单</Tag>:
  text === 3 ? component = <Tag color="processing">确认报价单</Tag>:
  text === 4 ? component = <Tag color="success">报价通过</Tag>:
  component = <Tag color="error">报价不通过</Tag>
  return component;
}

/************************************确认询价报价************************************ */
/**
 * @description: 外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type}  1.待提交询价单 2.待提交报价单 3.待确认报价单 4.报价通过 5.报价不通过
 */
export const confirmExternalState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Tag color="default">待提交询价单</Tag>:
  text === 2 ? component = <Tag color="default">待提交报价单</Tag>:
  text === 3 ? component = <Tag color="processing">待确认报价单</Tag>:
  text === 4 ? component = <Tag color="success">报价通过</Tag>:
  component = <Tag color="error">报价不通过</Tag>
  return component;
}
/**
 * @description: 确认询价报价-报价单查询-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核 3.待审核 4.审核通过 5.完成 6.审核不通过
 */
export const confirmInteriorState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="待提交审核" />:
  text === 2 ? component = <Badge status='warning' text="待审核" />:
  text === 3 ? component = <Badge status='warning' text="待审核" />:
  text === 4 ? component = <Badge status='processing' text="审核通过" />:
  text === 5 ? component = <Badge status='processing' text="完成" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}

/***************************确认需求报价************************** */
/**
 * @description: 确认需求报价-外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交需求单 2.待审核需求单 3.待提交报价单 4.待确认报价单 5.确认通过 6.确认不通过
 */
export const demandExternalState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Tag color="default">待提交需求单</Tag>:
  text === 2 ? component = <Tag color="default">待审核需求单</Tag>:
  text === 3 ? component = <Tag color="processing">待提交报价单</Tag>:
  text === 4 ? component = <Tag color="warning">待确认报价单</Tag>:
  text === 5 ? component = <Tag color="success">确认通过</Tag>:
  component = <Tag color="error">报价不通过</Tag>
  return component;
}

 /**
 * @description: 确认需求报价-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.待提交审核 2.待审核报价单 3.待审核报价单 4.待提交报价单 5.完成（审核通过） 6.审核不通过
 */
export const demandInteriorState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="待提交审核" />:
  text === 2 ? component = <Badge status='warning' text="待审核报价单" />:
  text === 3 ? component = <Badge status='warning' text="待审核报价单" />:
  text === 4 ? component = <Badge status='processing' text="待提交报价单" />:
  text === 5 ? component = <Badge status='processing' text="完成（审核通过）" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}

/********************************需求报价 & 需求发布********************************* */
/**
 * @description: 需求报价-外部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.提交需求单 2.审核需求单  3.提交报价单  4.确认报价单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteExternalState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Tag color="default">待提交需求单</Tag>:
  text === 2 ? component = <Tag color="default">待审核需求单</Tag>:
  text === 3 ? component = <Tag color="processing">待提交报价单</Tag>:
  text === 4 ? component = <Tag color="warning">待确认报价单</Tag>:
  text === 5 ? component = <Tag color="success">确认通过</Tag>:
  component = <Tag color="error">报价不通过</Tag>
  return component;
}

 /**
 * @description: 需求报价-内部状态查询
 * @author: HJX
 * @param {type}
 * @return {type} 1.新增需求单 2.审核需求单一级 3.审核需求单二级 4.提交需求单 5.完成 6.审核不通过 7.取消报价单
 */
export const demandQuoteInteriorState = (text:any) => {
  let component: ReactNode = null;
  text === 1 ? component = <Badge status='default' text="新增需求单" />:
  text === 2 ? component = <Badge status='warning' text="审核需求单一级" />:
  text === 3 ? component = <Badge status='warning' text="审核需求单二级" />:
  text === 4 ? component = <Badge status='processing' text="提交需求单" />:
  text === 5 ? component = <Badge status='success' text="完成" />:
  text === 6 ? component = <Badge status='error' text="审核不通过" />:
  component = <Badge status='error' text="审核不通过" />
  return component;
}

/********************************需求发布******************************* */
