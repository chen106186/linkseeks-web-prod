/*
 * @Author: GHua
 * @Date: 2022-03-30 19:08:01
 * @LastEditTime: 2022-04-07 14:22:53
 * @LastEditors: GHua
 * @Description:
 */
// 订单类型
export enum OrderModeType {
  /**
   *  购物车下单 - 1
   */
  BUYER = 1,

  /**
   *  手工下单 - 2
   */
  MANUAL,

  /**
   *  询价报价下单 - 3
   */
  QUOTATION,
  /**
   * 需求报价下单 - 4
   */
  DEMAND,
  /**
   * 合并订单下单 - 5
   */
  MERGE,

  /**
   *  渠道直采购物车下单 - 6
   */
  CHANNEL_DIRECT_BUY,

  /**
   *  渠道直采手工下单 - 7
   */
  CHANNEL_DIRECT_MANUAL,

  /**
   *  渠道现货购物车下单 - 8
   */
  CHANNEL_STOCK_BUY,

  /**
   *  渠道现货手工下单 - 9
   */
  CHANNEL_STOCK_MANUAL,

  /**
   * 积分下单 - 10
   */
  RIGHT_POINT,

  /**
   * 渠道积分下单 - 11
   */
  CHANNEL_RIGHT_POINT,

  /**
   * 采购询价 - 12
   */
  PURCHASE_INQUIRY,

  /**
   * 采购招标 - 13
   */
  PURCHASE_BIDDING,

  /**
   * 采购竞价 - 14
   */
  PURCHASE_PRICE_COMPETITION,
}

/** 当前城市cookie */
export const POSITION_INFO_KEY = 'POSITION_INFO'

/** 选择配送区域cookie */
export const RECEIVER_INFO_KEY = 'RECEIVER_INFO'

/** * 默认省市 */
export const DEFAULT_CITY = {
  provinceCode: '110000',
  provinceName: '北京',
  cityCode: '110100',
  cityName: '北京市',
}

/** 会员商品 */
export const MEMBER_COMMODITY = 1

/** 渠道商品 */
export const CHANNEL_COMMODITY = 2

/** 商品列表展示模式 */
export enum COMMODITY_SHOW_TYPE {
  gird = 'gird',
  list = 'list',
}
