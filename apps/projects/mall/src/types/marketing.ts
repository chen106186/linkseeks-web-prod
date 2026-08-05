/** 活动信息 */
export interface ActivityItemType {
  /**
   * 营销活动Id
   */
  activityId?: number
  /**
   * 营销活动名称
   */
  name?: string
  /**
   * 营销活动一级类型
   */
  type: number
  /**
   * 营销活动一级类型名称
   */
  typeName: string
  /**
   * 营销活动二级类型
   */
  subType: number
  /**
   * 营销活动二级类型名称
   */
  subTypeName?: string
  /**
   * 营销活动三级类型
   */
  thirdType: number
  /**
   * 营销很多三级类型名称
   */
  thirdTypeName: string
  /**
   * 营销活动起始时间，格式为yyyy-MM-dd HH:mm:ss
   */
  startTime?: string
  /**
   * 营销活动结束时间，格式为yyyy-MM-dd HH:mm:ss
   */
  endTime?: string
  /**
   * 营销活动减少的单价（正数，默认为 0）
   */
  reducePrice?: number
  /**
   * 营销活动的折扣（正数，默认为 1）
   */
  discount?: number
  /**
   * 经过营销活动计算后的单价
   */
  calcPrice?: number
  /**
   * 当前营销活动总共减少的金额
   */
  reduceAmount?: number
  /**
   * 满量促销规则
   */
  quantityRules: {
    /**
     * 是否命中此规则，true-是，false-否
     */
    hit: boolean
    /**
     * 满足的数量
     */
    quantity: number
    /**
     * （满量减）减少的金额
     */
    decrease: number
    /**
     * （满量折）折扣
     */
    discount: number
    /**
     * 规则提示
     */
    hint: string
  }[]
  /**
   * 满额促销规则
   */
  amountRules: {
    /**
     * 是否命中此规则，true-是，false-否
     */
    hit: boolean
    /**
     * 满足的金额
     */
    amount: number
    /**
     * （满额减）减少的金额
     */
    decrease: number
    /**
     * （满额折）折扣
     */
    discount: number
    /**
     * 提示语
     */
    hint?: string
  }[]
  /**
   * 赠送促销 - 赠品组
   */
  giftGroups: {
    /**
     * 是否命中此规则，true-是，false-否
     */
    hit: boolean
    /**
     * 分组编号
     */
    groupNo: number
    /**
     * 优惠门槛（满多少金额，用于满额增）
     */
    amountThreshold: number
    /**
     * 优惠门槛（满多少数量，用于买商品增）
     */
    quantityThreshold: number
    /**
     * 赠送的商品列表（用于赠送商品）
     */
    giftCommodities: {
      /**
       * 赠品数据Id
       */
      promotionId: number
      /**
       * 营销活动Id
       */
      activityId: number
      /**
       * 营销活动类型
       */
      activityType: number
      /**
       * 赠送分组编号（计算时填入）
       */
      groupNo: number
      /**
       * 赠送商品的Id
       */
      commodityId: number
      /**
       * 赠送商品的SkuId（计算时填入）
       */
      skuId: number
      /**
       * 商品图片
       */
      logo: string
      /**
       * 名称
       */
      name: string
      /**
       * 单价
       */
      price: number
      /**
       * 品牌
       */
      brand: string
      /**
       * 品类
       */
      category: string
      /**
       * 单位
       */
      unit: string
      /**
       * 赠送的数量（计算时填入）
       */
      giftQuantity: number
      /**
       * 配送方式
       */
      deliveryType: number
    }[]
    /**
     * 赠送的优惠券列表（用于赠送优惠券）
     */
    giftCoupons: {
      /**
       * 赠品数据Id
       */
      promotionId: number
      /**
       * 营销活动Id
       */
      activityId: number
      /**
       * 营销活动类型
       */
      activityType: number
      /**
       * 赠送分组编号
       */
      groupNo: number
      /**
       * 赠送优惠券的Id
       */
      couponId: number
      /**
       * 优惠券名称
       */
      name: string
      /**
       * 优惠券是否归属平台
       */
      platform: boolean
      /**
       * 优惠券类型
       */
      type: 0 | 1 | 2 | 3
      /**
       * 优惠券类型名称
       */
      typeName: string
      /**
       * 有效期类型
       */
      periodType: number
      /**
       * 领券多少天内有效
       */
      periodDays: number
      /**
       * 有效期起始时间，格式为 yyyy-MM-dd HH:mm:ss
       */
      periodStartTime: string
      /**
       * 有效期结束时间，格式为 yyyy-MM-dd HH:mm:ss
       */
      periodEndTime: string
      /**
       * 优惠券面额（可抵扣金额）
       */
      amount: number
      /**
       * 赠送的数量
       */
      giftQuantity: number
    }[]
  }[]
  /**
   * 换购促销 - 换购组
   */
  exchangeGroups: {
    /**
     * 是否命中此规则，true-是，false-否
     */
    hit: boolean
    /**
     * 分组编号
     */
    groupNo: number
    /**
     * 换购门槛（满多少金额，用于满额换购）
     */
    amountThreshold: number
    /**
     * 换购门槛（满多少数量，用于买商品换购）
     */
    quantityThreshold: number
    /**
     * 换购的商品列表
     */
    exchangeCommodities: {
      /**
       * 换购商品数据Id
       */
      promotionId: number
      /**
       * 营销活动Id
       */
      activityId: number
      /**
       * 营销活动类型
       */
      activityType: number
      /**
       * 换购分组编号
       */
      groupNo: number
      /**
       * 换购商品的Id
       */
      commodityId: number
      /**
       * 换购商品的SkuId
       */
      skuId: number
      /**
       * 商品图片
       */
      logo: string
      /**
       * 名称
       */
      name: string
      /**
       * 单价
       */
      price: number
      /**
       * 品牌
       */
      brand: string
      /**
       * 品类
       */
      category: string
      /**
       * 单位
       */
      unit: string
      /**
       * 换购商品的单价
       */
      exchangePrice: number
      /**
       * 换购的数量
       */
      exchangeQuantity: number
      /**
       * 配送方式
       */
      deliveryType: number
    }[]
  }[]
}

export interface ExchangeCommodityItemType {
  /**
   * 换购商品数据Id
   */
  promotionId: number
  /**
   * 营销活动Id
   */
  activityId: number
  /**
   * 营销活动类型
   */
  activityType: number
  /**
   * 换购分组编号
   */
  groupNo: number
  /**
   * 换购商品的Id
   */
  commodityId: number
  /**
   * 换购商品的SkuId
   */
  skuId: number
  /**
   * 商品图片
   */
  logo: string
  /**
   * 名称
   */
  name: string
  /**
   * 单价
   */
  price: number
  /**
   * 品牌
   */
  brand: string
  /**
   * 品类
   */
  category: string
  /**
   * 单位
   */
  unit: string
  /**
   * 换购商品的单价
   */
  exchangePrice: number
  /**
   * 换购的数量
   */
  exchangeQuantity: number
}
