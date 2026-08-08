/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-30 15:25:03
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-08 14:01:28
 * @Description: 营销活动相关常量
 */

/* --------------------------------- 商家优惠券类型 -------------------------------- */
/**
 * 0元购买抵扣券
 */
export const MERCHANT_COUPON_TYPE_VOUCHER = 1;
/**
 * 通用优惠券
 */
export const MERCHANT_COUPON_TYPE_UNIVERSAL = 2;
/**
 * 品类优惠券
 */
export const MERCHANT_COUPON_TYPE_CATEGORY = 3;
/**
 * 品牌优惠券
 */
export const MERCHANT_COUPON_TYPE_BRAND = 4;
/**
 * 商品优惠券
 */
export const MERCHANT_COUPON_TYPE_PRODUCT = 5;



/* --------------------------------- 商家优惠券领取方式 -------------------------------- */
/**
 * 前台用户领券
 */
export const MERCHANT_COUPON_RECEIVE_FRONT = 1;
/**
 * 指定会员发券
 */
export const MERCHANT_COUPON_RECEIVE_DESIGNATED = 2;
/**
 * 营销活动用券
 */
export const MERCHANT_COUPON_RECEIVE_ACTIVITY = 3;
/**
 * 会员运营用券
 */
export const MERCHANT_COUPON_RECEIVE_OPERATE = 4;


/* --------------------------------- 商家优惠券适用用户 -------------------------------- */
/**
 * 新用户(不包含会员)
 */
export const SUITABLE_TYPE_NEW_USER = 1;
/**
 * 老用户(不包含会员)
 */
export const SUITABLE_TYPE_OLD_USER = 2;
/**
 * 新会员(仅会员用户)
 */
export const SUITABLE_TYPE_NEW_MEMBER = 3;
/**
 * 老会员(仅会员用户)
 */
export const SUITABLE_TYPE_OLD_MEMBER = 4;

/** 特价促销 */
export const ACTIVITY_TYPE_1 = 1
/** 直降促销 */
export const ACTIVITY_TYPE_2 = 2
/** 折价促销 */
export const ACTIVITY_TYPE_3 = 3
/** 满量促销 */
export const ACTIVITY_TYPE_4 = 4
/** 满额促销 */
export const ACTIVITY_TYPE_5 = 5
/** 赠送促销 */
export const ACTIVITY_TYPE_6 = 6
/** 多件促销 */
export const ACTIVITY_TYPE_7 = 7
/** 组合促销 */
export const ACTIVITY_TYPE_8 = 8
/** 拼团 */
export const ACTIVITY_TYPE_9 = 9
/** 抽奖 */
export const ACTIVITY_TYPE_10 = 10
/** 砍价 */
export const ACTIVITY_TYPE_11 = 11
/** 秒杀 */
export const ACTIVITY_TYPE_12 = 12
/** 换购 */
export const ACTIVITY_TYPE_13 = 13
/** 预售 */
export const ACTIVITY_TYPE_14 = 14
/** 套餐 */
export const ACTIVITY_TYPE_15 = 15
/** 试用 */
export const ACTIVITY_TYPE_16 = 16
/** 满量促销 - 满量减 1 */
export const MANLIANG_JIAN = 1
/** 满量促销 - 满量折 2 */
export const MANLIANG_ZHE = 2
/** 满额促销 - 满额减 1 */
export const MANE_JIAN = 1
/** 满额促销 - 满额折 2 */
export const MANE_ZHE = 2
/** 赠送促销 (赠送促销类型 - 满额赠 1) */
export const MANE_ZENG = 1
/** 赠送促销 (赠送促销类型 - 卖商品赠 2) */
export const BUYPRODUCT_ZENG = 2
/** 赠送促销 (赠品类型 - 赠商品 1) */
export const WHITGIFT_PRODUCT = 1
/** 赠送促销 (赠品类型 - 赠优惠券 2) */
export const BUYPRODUCT_WHITGIFT = 2
/** 砍价 (每次砍价金额 - 随机金额 1) */
export const RANDOM_AMOUNT = 1
/** 砍价 (每次砍价金额 - 固定金额 2) */
export const FIXATION_AMOUNT = 2
/** 抽奖 订单抽奖 1 */
export const LOTTERY_ORDERLOTTERY = 1
/** 抽奖 积分抽奖 2 */
export const LOTTERY_INTEGRALLOTTERY = 2
/** 抽奖 行为抽奖 3 */
export const LOTTERY_BEHAVIORLOTTERY = 3
/** 抽奖 活动抽奖 4 */
export const LOTTERY_ACTIVITYLOTTERY = 4
/** 抽奖 申请会员 1 */
export const LOTTERY_APPLYMEMBER = 1
/** 抽奖 签到 2 */
export const LOTTERY_SIGNIN= 2
/** 抽奖 抽奖次数 每日 1 */
export const EVERY_DAY= 1
/** 抽奖 抽奖次数 每周 2 */
export const EVERY_WEEK= 2
/** 抽奖 抽奖次数 每月 3 */
export const EVERY_MONTH= 3
/** 抽奖 抽奖次数 活动期内 4 */
export const SEASON_ENTO= 4
/** 换购 换购类型 满额换购 1 */
export const FULL_EXCHANGE= 1
/** 换购 换购类型 买商品换购 2 */
export const BUYPRODUCT_EXCHANGE= 2

