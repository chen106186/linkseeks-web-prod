/** 活动相关 */

/**
 * 活动页-活动推荐栏
 */
export const MARKETING_ACTIVITY_DECORATION_HOT = 'hot'

/**
 * 活动页-活动推荐栏-子项
 */
export const MARKETING_ACTIVITY_DECORATION_HOT_ITEM = 'hotItem'

/**
 * 直降促销
 */
export const MARKETING_ACTIVITY_DECORATION_PLUMMET = 'plummet'

/**
 * 折扣促销
 */
export const MARKETING_ACTIVITY_DECORATION_DISCOUNT = 'discount'

/**
 * 满量促销
 */
export const MARKETING_ACTIVITY_DECORATION_FULLQUATITY = 'fullQuantity'
/**
 * 满量促销-满量减
 */
export const MARKETING_ACTIVITY_DECORATION_FULLQUATITY_REDUCE = 'fullQuantitySub'

/**
 * 满量促销-满量折
 */
export const MARKETING_ACTIVITY_DECORATION_FULLQUATITY_DISCOUNT = 'fullQuantityDiscount'

/**
 * 满额促销
 */
export const MARKETING_ACTIVITY_DECORATION_FULLMONEY = 'fullMoney'

/**
 * 满额促销-满额减
 */
export const MARKETING_ACTIVITY_DECORATION_FULLMONEY_REDUCE = 'fullMoneySub'

/**
 * 满额促销-满额折
 */
export const MARKETING_ACTIVITY_DECORATION_FULLMONEY_DISCOUNT = 'fullMoneyDiscount'

/**
 * 赠送促销
 */
export const MARKETING_ACTIVITY_DECORATION_GIVEAWAY = 'giveAway'

/**
 * 赠送促销-赠送商品
 */
export const MARKETING_ACTIVITY_DECORATION_GIVEAWAY_COMMODITY = 'giveProduct'

/**
 * 赠送促销-赠送优惠券
 */
export const MARKETING_ACTIVITY_DECORATION_GIVEAWAY_COUPON = 'giveCoupon'

/**
 * 换购
 */
export const MARKETING_ACTIVITY_DECORATION_EXCHANGE = 'exchange'

/**
 * 换购-满额换购
 */
export const MARKETING_ACTIVITY_DECORATION_EXCHANGE_AMOUNT = 'fullSwap'

/**
 * 换购-买商品换购
 */
export const MARKETING_ACTIVITY_DECORATION_EXCHANGE_COMMODITY = 'buySwap'

/**
 * 营销活动页-活动类型集合
 */
export const MARKETING_ACTIVITY_DECORATION_LIST = [
  MARKETING_ACTIVITY_DECORATION_HOT,
  MARKETING_ACTIVITY_DECORATION_PLUMMET,
  MARKETING_ACTIVITY_DECORATION_DISCOUNT,
  MARKETING_ACTIVITY_DECORATION_FULLQUATITY_REDUCE,
  MARKETING_ACTIVITY_DECORATION_FULLQUATITY_DISCOUNT,
  MARKETING_ACTIVITY_DECORATION_FULLMONEY_REDUCE,
  MARKETING_ACTIVITY_DECORATION_FULLMONEY_DISCOUNT,
  MARKETING_ACTIVITY_DECORATION_GIVEAWAY_COMMODITY,
  MARKETING_ACTIVITY_DECORATION_GIVEAWAY_COUPON,
  MARKETING_ACTIVITY_DECORATION_EXCHANGE_AMOUNT,
  MARKETING_ACTIVITY_DECORATION_EXCHANGE_COMMODITY,
]

/**
 * 直降促销
 */
export const MARKETING_ACTIVITY_TYPE_1 = 1

/**
 * 折扣促销
 */
export const MARKETING_ACTIVITY_TYPE_2 = 2

/**
 * 满量促销
 */
export const MARKETING_ACTIVITY_TYPE_3 = 3

/**
 * 满额促销
 */
export const MARKETING_ACTIVITY_TYPE_4 = 4

/**
 * 赠送促销
 */
export const MARKETING_ACTIVITY_TYPE_5 = 5

/**
 * 换购
 */
export const MARKETING_ACTIVITY_TYPE_6 = 6

/** ----------------------------------------------- */
/**
 * 营销活动二级类型-满量减
 */
export const MARKETING_SUB_ACTIVITY_TYPE_1 = 1

/**
 * 营销活动二级类型-满量折
 */
export const MARKETING_SUB_ACTIVITY_TYPE_2 = 2

/**
 * 营销活动二级类型-满额减
 */
export const MARKETING_SUB_ACTIVITY_TYPE_3 = 3

/**
 * 营销活动二级类型-满额折
 */
export const MARKETING_SUB_ACTIVITY_TYPE_4 = 4

/**
 * 营销活动二级类型-满额赠
 */
export const MARKETING_SUB_ACTIVITY_TYPE_5 = 5

/**
 * 营销活动二级类型-买商品赠
 */
export const MARKETING_SUB_ACTIVITY_TYPE_6 = 6

/**
 * 营销活动二级类型-买商品赠
 */
export const MARKETING_SUB_ACTIVITY_TYPE_7 = 7

/**
 * 营销活动二级类型-买商品赠
 */
export const MARKETING_SUB_ACTIVITY_TYPE_8 = 8

/**
 * 营销活动一级类型
 */
export enum MARKETING_ACTIVITY_TYPE {
  /** 直降促销 */
  'PLUMMET' = MARKETING_ACTIVITY_TYPE_1,
  /** 折扣促销 */
  'DISCOUNT' = MARKETING_ACTIVITY_TYPE_2,
  /** 满量促销 */
  'FULLQUATITY' = MARKETING_ACTIVITY_TYPE_3,
  /** 满额促销 */
  'FULLMONEY' = MARKETING_ACTIVITY_TYPE_4,
  /** 赠送促销 */
  'GIVEAWAY' = MARKETING_ACTIVITY_TYPE_5,
  /** 换购 */
  'EXCHANGE' = MARKETING_ACTIVITY_TYPE_6,
}

/**
 * 营销活动二级类型
 */
export enum MARKETING_SUB_ACTIVITY_TYPE {
  /** 营销活动二级类型-满量减 */
  'FULLQUATITY_REDUCE' = MARKETING_SUB_ACTIVITY_TYPE_1,
  /** 营销活动二级类型-满量折 */
  'FULLQUATITY_DISCOUNT' = MARKETING_SUB_ACTIVITY_TYPE_2,
  /** 营销活动二级类型-满额减 */
  'FULLMONEY_REDUCE' = MARKETING_SUB_ACTIVITY_TYPE_3,
  /** 营销活动二级类型-满额折 */
  'FULLMONEY_DISCOUNT' = MARKETING_SUB_ACTIVITY_TYPE_4,
  /** 营销活动二级类型-满额赠 */
  'GIVEAWAY_AMOUNT' = MARKETING_SUB_ACTIVITY_TYPE_5,
  /** 营销活动二级类型-买商品赠 */
  'GIVEAWAY_COMMODITY' = MARKETING_SUB_ACTIVITY_TYPE_6,
  /** 营销活动二级类型-满额换购 */
  'EXCHANGE_AMOUNT' = MARKETING_SUB_ACTIVITY_TYPE_7,
  /** 营销活动二级类型-买商品换购 */
  'EXCHANGE_COMMODITY' = MARKETING_SUB_ACTIVITY_TYPE_8,
}

/**
 * 根据活动类型显示活动标签名称
 * @param type 活动类型
 * @returns
 */
export const getMarketingTagNameByType = (type: MARKETING_ACTIVITY_TYPE, thirdType?: number) => {
  switch (type) {
    case MARKETING_ACTIVITY_TYPE.PLUMMET:
      return '直降'
    case MARKETING_ACTIVITY_TYPE.DISCOUNT:
      return '折扣'
    case MARKETING_ACTIVITY_TYPE.GIVEAWAY:
      return thirdType === 1 ? '赠品' : '返券'
    case MARKETING_ACTIVITY_TYPE.EXCHANGE:
      return '换购'
    default:
      return ''
  }
}

export enum MarketingTypeEnum {
  /** 特价促销 */
  activity_type_1 = 1,
  /** 直降促销 */
  activity_type_2,
  /** 折扣促销 */
  activity_type_3,
  /** 满量促销 */
  activity_type_4,
  /** 满额促销 */
  activity_type_5,
  /** 赠送促销 */
  activity_type_6,
  /** 多件促销 */
  activity_type_7,
  /** 组合促销 */
  activity_type_8,
  /** 拼团 */
  activity_type_9,
  /** 抽奖 */
  activity_type_10,
  /** 砍价 */
  activity_type_11,
  /** 秒杀 */
  activity_type_12,
  /** 换购 */
  activity_type_13,
  /** 预售 */
  activity_type_14,
  /** 套餐 */
  activity_type_15,
  /** 试用 */
  activity_type_16,
}

/** 活动相关 */

/** 活动推荐 */
export const ACTIVITY_HOT = 'hot'

/** 活动-特价促销 */
export const ACTIVITY_SPECIALOFFER = 'specialOffer'

/** 直降促销 */
export const ACTIVITY_PLUMMET = 'plummet'

/** 折扣促销 */
export const ACTIVITY_DISCOUNT = 'discount'

/** 满量促销-满量减 */
export const ACTIVITY_FULLQUANTITYSUB = 'fullQuantitySub'

/** 满量促销--满量折  */
export const ACTIVITY_FULLQUANTITYDISCOUNT = 'fullQuantityDiscount'

/** 满额促销--满额减  */
export const ACTIVITY_FULLMONEYSUB = 'fullMoneySub'

/** 满额促销--满额折 */
export const ACTIVITY_FULLMONEYDISCOUNT = 'fullMoneyDiscount'

/** 赠送促销-赠送商品 */
export const ACTIVITY_GIVEPRODUCT = 'giveProduct'

/** 赠送促销-赠送优惠券 */
export const ACTIVITY_GIVECOUPON = 'giveCoupon'

/** 赠送促销-多件促销 */
export const ACTIVITY_MOREPIECE = 'morePiece'

/** 赠送促销-组合促销 */
export const ACTIVITY_COMBINATION = 'combination'

/** 赠送促销-拼团 */
export const ACTIVITY_GROUPPURCHASE = 'groupPurchase'

/** 砍价 */
export const ACTIVITY_BARGAIN = 'bargain'

/** 秒杀 */
export const ACTIVITY_SECKILL = 'secKill'

/** 换购-满额换购 */
export const ACTIVITY_FULLSWAP = 'fullSwap'

/** 换购-满额换购 */
export const ACTIVITY_BUYSWAP = 'buySwap'

/** 换购-预售 */
export const ACTIVITY_PRESALE = 'preSale'

/** 套餐 */
export const ACTIVITY_SETMEAL = 'setMeal'

/** 试用  */
export const ACTIVITY_ATTEMPT = 'attempt'

/** 抽奖 */
export const ACTIVITY_LUCKDRAW = 'luckddraw'

/** 活动类型ID */

/** 活动-特价促销 */
export const ACTIVITY_SPECIALOFFER_NUMBER = 1

/** 直降促销 */
export const ACTIVITY_PLUMMET_NUMBER = 2

/** 折扣促销 */
export const ACTIVITY_DISCOUNT_NUMBER = 3

/** 满量促销-满量减, minType: 1 */
export const ACTIVITY_FULLQUANTITYSUB_NUMBER = 4

/** 满量促销--满量折 minType: 2 */
export const ACTIVITY_FULLQUANTITYDISCOUNT_NUMBER = 4

/** 满额促销--满额减 minType: 1  */
export const ACTIVITY_FULLMONEYSUB_NUMBER = 5

/** 满额促销--满额折 minType: 2 */
export const ACTIVITY_FULLMONEYDISCOUNT_NUMBER = 5

/** 赠送促销-赠送商品 minType: 1 */
export const ACTIVITY_GIVEPRODUCT_NUMBER = 6

/** 赠送促销-赠送优惠券  minType: 2  */
export const ACTIVITY_GIVECOUPON_NUMBER = 6

/** 赠送促销-多件促销 */
export const ACTIVITY_MOREPIECE_NUMBER = 7

/** 赠送促销-组合促销 */
export const ACTIVITY_COMBINATION_NUMBER = 8

/** 拼团 */
export const ACTIVITY_GROUPPURCHASE_NUMBER = 9

/** 抽奖 */
export const ACTIVITY_LUCKDRAW_NUMBER = 10

/** 砍价 */
export const ACTIVITY_BARGAIN_NUMBER = 11

/** 秒杀 */
export const ACTIVITY_SECKILL_NUMBER = 12

/** 换购-满额换购 minType = 1 */
export const ACTIVITY_FULLSWAP_NUMBER = 13

/** 换购-满额换购 minType = 2  */
export const ACTIVITY_BUYSWAP_NUMBER = 13

/** 换购-预售 */
export const ACTIVITY_PRESALE_NUMBER = 14

/** 套餐 */
export const ACTIVITY_SETMEAL_NUMBER = 15

/** 试用  */
export const ACTIVITY_ATTEMPT_NUMBER = 16

export const ACTIVITY_NAME_TO_NUMBER = {
  [ACTIVITY_SPECIALOFFER]: ACTIVITY_SPECIALOFFER_NUMBER,
  [ACTIVITY_PLUMMET]: ACTIVITY_PLUMMET_NUMBER,
  [ACTIVITY_DISCOUNT]: ACTIVITY_DISCOUNT_NUMBER,
  [ACTIVITY_FULLQUANTITYSUB]: ACTIVITY_FULLQUANTITYSUB_NUMBER,
  [ACTIVITY_FULLQUANTITYDISCOUNT]: ACTIVITY_FULLQUANTITYDISCOUNT_NUMBER,
  [ACTIVITY_FULLMONEYSUB]: ACTIVITY_FULLMONEYSUB_NUMBER,
  [ACTIVITY_FULLMONEYDISCOUNT]: ACTIVITY_FULLMONEYDISCOUNT_NUMBER,
  [ACTIVITY_GIVEPRODUCT]: ACTIVITY_GIVEPRODUCT_NUMBER,
  [ACTIVITY_GIVECOUPON]: ACTIVITY_GIVECOUPON_NUMBER,
  [ACTIVITY_MOREPIECE]: ACTIVITY_MOREPIECE_NUMBER,
  [ACTIVITY_COMBINATION]: ACTIVITY_COMBINATION_NUMBER,
  [ACTIVITY_GROUPPURCHASE]: ACTIVITY_GROUPPURCHASE_NUMBER,
  [ACTIVITY_LUCKDRAW]: ACTIVITY_LUCKDRAW_NUMBER,
  [ACTIVITY_BARGAIN]: ACTIVITY_BARGAIN_NUMBER,
  [ACTIVITY_SECKILL]: ACTIVITY_SECKILL_NUMBER,
  [ACTIVITY_FULLSWAP]: ACTIVITY_FULLSWAP_NUMBER,
  [ACTIVITY_BUYSWAP]: ACTIVITY_BUYSWAP_NUMBER,
  [ACTIVITY_PRESALE]: ACTIVITY_PRESALE_NUMBER,
  [ACTIVITY_SETMEAL]: ACTIVITY_SETMEAL_NUMBER,
  [ACTIVITY_ATTEMPT]: ACTIVITY_ATTEMPT_NUMBER,
} as const
