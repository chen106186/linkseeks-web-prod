export interface Ilist {
  dateTime: any
  roleName: string
  count: number
}

export enum TimeEnum {
  WEEK = 1,
  MONTH = 2,
  YEAR = 3,
}

export interface ImemberData {
  /**
   * 今日注册数
   */
  todayCount: number

  /**
   * 七日注册数
   */
  weekCount: number

  /**
   * 三十日注册数
   */
  monthCount: number

  /**
   * 三十日注册数
   */
  totalCount: number

  /**
   * 周统计数据
   */
  weekList: Ilist[]

  /**
   * 月统计数据
   */
  monthList: Ilist[]

  /**
   * 年统计数据
   */
  yearList: Ilist[]
}

export interface IorderData {
  /**
   * 今日订单数
   */
  todayCount: number

  /**
   * 今日营业额
   */
  todayAmount: number

  /**
   * 七日订单数
   */
  weekCount: number

  /**
   * 七日营业额
   */
  weekAmount: number

  /**
   * 三十日订单数
   */
  monthCount: number

  /**
   * 三十日营业额
   */
  monthAmount: number
  /**
   * 累鸡订单数
   */
  totalCount: number
  /**
   * 累计营业额
   */
  totalAmount: number

  /**
   * 周统计数据
   */
  weekList: Ilist[]
  /**
   * 月统计数
   */
  monthList: Ilist[]
  /**
   * 年统计数
   */
  yearList: Ilist[]
}

export interface ItodayAdd {
  orderAmount: string
  orderGrowthRate: number
  memberCount: string
  memberGrowthRate: number
  commodityCount: number
  commodityGrowthRate: number
  shopCount: number
  shopGrowthRate: number
}
