import { NAV_TYPE } from '.'

export interface AdvertItem {
  /**
   * 排序
   */
  sort: number
  /**
   * 导航类型
   */
  type: NAV_TYPE
  /**
   * 广告名称
   */
  name: string
  /**
   * 广告图片
   */
  picUrl: string
  /**
   * 导航内容
   */
  value: string
  valueText?: string
  /** 有效开始时间 */
  effectiveStartTime?: string
  /** 有效结束时间 */
  effectiveEndTime?: string
}
