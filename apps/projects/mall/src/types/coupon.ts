/** 优惠券类型 */
export interface CouponInfoType {
  /**
   * 状态：1-可领取，2-已领取可用，3-已领取不可用
   */
  status: 1 | 2 | 3
  /**
   * 状态名称
   */
  statusName: string
  /**
   * 优惠券领取记录Id，当优惠券为“已领取可用”，“已领取不可用”时不为0
   * <p>在创建订单接口使用优惠券时，要传递此值</p>
   */
  executionId: number
  /**
   * 优惠券Id
   */
  couponId: number
  /**
   * 优惠券归属的供应商Id
   */
  vendorMemberId: number
  /**
   * 优惠券归属的供应商会员Id
   */
  vendorRoleId: number
  /**
   * 优惠券券码，当优惠券已领取时不为空
   */
  code: string
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
   * 使用条件，订单满多少元可用
   */
  orderAmount: number
  /**
   * 适用的SkuId列表
   * <p>当为“通用优惠券”时，此列表为空</p>
   * <p>当列表中包含了多个SkuId时，表示每个SkuId都可以使用此优惠券</p>
   */
  skuIds: number[]
}

export interface SelectPointItem {
  /** 积分归属的供应会员（店铺）Id */
  vendorMemberId: number
  /** 积分归属的供应会员（店铺）角色Id */
  vendorRoleId: number
  /** 是否平台积分，true-是，false-不是 */
  platform: boolean
}
