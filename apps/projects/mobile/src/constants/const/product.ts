/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-30 15:59:18
 * @LastEditors: GHua
 * @LastEditTime: 2022-03-18 20:04:56
 * @Description: 商品模块相关常量
 */

/* --------------------------------- 配送方式 -------------------------------- */
export enum DELIVERY_TYPE_ENUM {
  /**
   * 物流
   */
  LOGISTICS = 1,
  /**
   * 自提
   */
  SELF_PICKUP,
  /**
   * 无须配送
   */
  NO_DELIVERY,
  /**
   * 物流+自提
   */
  LOGISTICS_AND_SELF,
}

/* --------------------------------- 运费方式 -------------------------------- */
/**
 * 卖家承担运费（默认）
 */
export const CARRIAGE_TYPE_SELLER = 1
/**
 * 买家承担运费
 */
export const CARRIAGE_TYPE_BUYER = 2
/**
 * 运费方式文本
 */
export const CARRIAGE_TYPE_TEXT: { [key: number]: string } = {
  [CARRIAGE_TYPE_SELLER]: '卖家承担运费',
  [CARRIAGE_TYPE_BUYER]: '买家承担运费',
}

/* --------------------------------- 产品定价方式 -------------------------------- */
export enum PRICE_TYPE_ENUM {
  /**
   * 现货定价
   */
  SPOT = 1,
  /**
   * 询价
   */
  CONSULTING,
  /**
   * 积分
   */
  INTEGRAL,
  /**
   * 赠品
   */
  GIFT,
}

/* --------------------------------- 支付方式 -------------------------------- */
/**
 * 线上支付
 */
export const PAY_WAY_ON_LINE = 1
/**
 * 线下支付
 */
export const PAY_WAY_OFFLINE = 2
/**
 * 授信额度支付
 */
export const PAY_WAY_CREDIT = 3
/**
 * 货到付款支付
 */
export const PAY_WAY_COD = 4
/**
 * 支付方式文本
 */
export const PAY_WAY_TEXT: { [key: number]: string } = {
  [PAY_WAY_ON_LINE]: '线上支付',
  [PAY_WAY_OFFLINE]: '线下支付',
  [PAY_WAY_CREDIT]: '授信额度支付',
  [PAY_WAY_COD]: '货到付款支付',
}
