import { getTopDomain } from '@apps/utils/src/domain'
import { getEnv } from '@apps/utils/src/env'

/** 当前城市cookie */
export const POSITION_INFO_KEY = 'POSITION_INFO'

/** 选择配送区域cookie */
export const RECEIVER_INFO_KEY = 'RECEIVER_INFO'

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

export enum COMMODITY_SHOW_TYPE {
  gird = 'gird',
  list = 'list',
}

export enum COMMODITY_TYPE {
  /**
   * 现货商品
   */
  prompt = 1,
  /**
   * 询价商品
   */
  inquiry = 2,
  /**
   * 积分商品
   */
  integral = 3,
  /**
   *	赠品
   */
  gift = 4,
}

export const LANG_ICON_MAP = {
  'zh-CN': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
  'zh-TW': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/china.png',
  'en-US': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/us.png',
  'ko-KR': 'http://lingxi-frontend-test.oss-cn-hangzhou.aliyuncs.com/images/koren.png',
}

/**
 * 一级域名（不包含端口）
 */
export const TOP_DOMAIN_NO_PORT = getTopDomain(
  import.meta.env.PROD ? getEnv('SITE_URL') : 'http://lx-b2b.lingxidev.com:6002',
)
