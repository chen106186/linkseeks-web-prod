import React from 'react'
import styles from './index.less'
import classNames from 'classnames'
import { GetMarketingCouponActivityPageSelectPageResponseDetail } from '@apps/apis'

interface Iprops extends GetMarketingCouponActivityPageSelectPageResponseDetail {
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

/** 优惠券类型  有效类型1-固定有效时间2-自领取开始时间*/
const IS_STABLE = 1

const WebCoupon: React.FC<Iprops> = (props: Iprops) => {
  const { className, onMouseOver, onClick, ...couponData } = props
  const designProps = {
    onMouseOver,
    onClick,
  }

  if (!couponData?.id) {
    return <div className={classNames(styles.coupon, className, styles.empty)} {...designProps} />
  }

  return (
    <div className={classNames(styles.coupon, className)} {...designProps}>
      <div className={styles['coupon-conditions-wrap']}>
        <span className={styles['coupon-money']}>
          <span className={styles['coupon-currency']}>￥</span>
          {couponData.denomination}
        </span>
        <span className={styles['coupon-condition']}>满${couponData.useConditionMoney}立减</span>
      </div>
      <div className={styles['coupon-info']}>
        <span className={styles['coupon-info-typeName']}>{couponData.typeName}</span>
        <span className={styles['coupon-info-date']}>
          {couponData.effectiveType === IS_STABLE
            ? `${couponData.effectiveTimeStart}至${couponData.effectiveTimeEnd}`
            : `领取后${couponData.invalidDay}天失效`}
        </span>
        <div className={styles['coupon-info-btn']}>立即领取</div>
      </div>
    </div>
  )
}

export default WebCoupon
