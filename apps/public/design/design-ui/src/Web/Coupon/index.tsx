import React from 'react'
import cx from 'classnames'
import CouponItem from './couponItem'
import styles from './index.module.less'

export interface CouponItemType {
  sort: number
  /**
   * 主键id
   */
  id: number
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 优惠券类型
   */
  type: number
  /**
   * 优惠券类型名称
   */
  typeName: string
  /**
   * 领(发)券起始时间
   */
  releaseTimeStart: number
  /**
   * 领(发)券结束时间
   */
  releaseTimeEnd: number
  /**
   * 券面额
   */
  denomination: number
  /**
   * 领取方式
   */
  getWay: number
  /**
   * 领取方式名称
   */
  getWayName: string
  /**
   * 使用条件, 满多少金额可用
   */
  useConditionMoney: number
  /**
   * 有效类型 1-固定有效时间 2-自领取开始时间
   */
  effectiveType: number
  /**
   * 固定有效时间, 券有效起始时间
   */
  effectiveTimeStart: number
  /**
   * 固定有效时间, 券有效结束时间
   */
  effectiveTimeEnd: number
  /**
   * 自领取开始时间, 券多少天失效
   */
  invalidDay: number
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 所属方类型 1-平台 2-商家
   */
  belongType: number
  /**
   * 所属方名称
   */
  belongName: string
  /** 0 => 未登录， 1 => 不符合条件 2 => 未领取， 3 => 已领取 */
  canReceive: 0 | 1 | 2 | 3
}

interface IProps {
  className?: string
  /** 显示标题 */
  showTitle?: boolean
  /** 标题 */
  title: string
  /** 上下边距 */
  verticalMargin?: number
  couponList: CouponItemType[]
  linkdisable?: boolean
  onItemClick?: (couponInfo: CouponItemType) => void
}

const Coupon: React.FC<IProps> = (props) => {
  const {
    title,
    couponList,
    className,
    showTitle = true,
    linkdisable = false,
    verticalMargin = 0,
    onItemClick,
    ...others
  } = props

  return (
    <div
      className={cx(styles['coupon-list-wrap'], className)}
      style={{
        marginTop: verticalMargin,
        marginBottom: verticalMargin,
      }}
      {...others}
    >
      {showTitle && <div className={styles['coupon-list-title']}>{title}</div>}
      <div className={styles['coupon-list']}>
        {couponList &&
          couponList.length > 0 &&
          couponList.map((couponItem) => (
            <CouponItem
              couponInfo={couponItem}
              key={couponItem.id}
              onClick={onItemClick}
            />
          ))}
      </div>
    </div>
  )
}

export default Coupon
