/* --------------------------------- 商城类型 -------------------------------- */
export enum SHOP_TYPE {
  /**
   * 企业商城
   */
  ENTERPRISE = 1,
  /**
   * 积分商城
   */
  POINTS = 2,
  /**
   * 渠道商城
   */
  CHANNEL = 3,
  /**
   * 渠道自有商城
   */
  CHANNEL_OWNED = 4,
  /**
   * 渠道积分商城
   */
  CHANNEL_POINTS = 5,
}

export enum LAYOUT_TYPE {
  /**
   * 企业商城
   */
  mall = 'mall',
  /**
   * 找现货
   */
  spot = 'spot',
  /**
   * 企业C端商城
   */
  client = 'client',
  /**
   * 自营商城
   */
  own = 'own',
  /**
   * 店铺（店铺商城）
   */
  shop = 'shop',
  /**
   * 渠道商城
   */
  channel = 'channel',
  /**
   * 企业商城-积分商城
   */
  scoreMall = 'scoreMall',
  /**
   * 店铺-积分兑换
   */
  shopScoreMall = 'shopScoreMall',
  /**
   * 店铺列表
   */
  shopList = 'shopList',
}

/* --------------------------------- 商城属性 -------------------------------- */
export enum SHOP_PROPERTY {
  /**
   * B端商城
   */
  BUSINESS = 1,
  /**
   * C端商城
   */
  CUSTOMER = 2,
  /**
   * B端自营商城
   */
  BUSINESS_SELF_SUPPORT = 3,
  /**
   * C端自营商城
   */
  CUSTOMER_SELF_SUPPORT = 4,
}
