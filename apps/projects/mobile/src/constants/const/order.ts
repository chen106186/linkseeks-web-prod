/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-28 18:05:19
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-19 11:05:25
 * @Description: 订单相关常量
 */
/** -------------------------- 订单类型 -------------------------- */
/**
 * 询价采购
 */
export const ORDER_TYPE_INQUIRYT_PURCHASE = 1;
/**
 * 需求采购
 */
export const ORDER_TYPE_DEMAND_PURCHASE = 2;
/**
 * 现货采购
 */
export const ORDER_TYPE_STORE_PURCHASE = 3;
/**
 * 集采
 */
export const ORDER_TYPE_CENTRAL_PURCHASE = 4;
/**
 * 渠道直采
 */
export const ORDER_TYPE_CHANNEL_DIRECT_MINING = 5;
/**
 * 渠道现货
 */
export const ORDER_TYPE_CHANNEL_STORE = 6;
/**
 * 积分兑换
 */
export const ORDER_TYPE_POINTS = 7;
/**
 * 渠道积分兑换
 */
export const ORDER_TYPE_CHANNEL_POINTS = 8;
/**
 * 采购询价合同
 */
export const ORDER_TYPE_INQUIRY_CONTRACT = 9;
/**
 * 采购竞价合同
 */
export const ORDER_TYPE_BIDDING_CONTRACT = 10;
/**
 * 采购招标合同
 */
export const ORDER_TYPE_TENDER_CONTRACT = 11;
/**
 * 请购单下单
 */
export const ORDER_TYPE_REQUISITION = 12;

/**
 * 判断订单类型是否是积分订单
 * @param orderType 订单类型 number
 * @returns 
 */
export const checkIsPointsOrder = (orderType: number) => orderType === ORDER_TYPE_POINTS || orderType === ORDER_TYPE_CHANNEL_POINTS;