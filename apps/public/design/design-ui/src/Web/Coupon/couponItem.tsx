import React from 'react'
import { getWebIntl } from '@apps/locales'
import classNames from 'classnames'
import moment from 'moment'
import { CouponItemType } from '.'
import styles from './index.module.less'

interface IPorps {
  couponInfo: CouponItemType
  linkdisable?: boolean
  onClick?: (couponInfo: CouponItemType) => void
}

/** 未登录 */
const NO_LOGIN = 0
/** 不符合领取条件 */
const ILLEGAL = 1
/** 未领取 */
const CAN_PICK = 2
/** 已领取，去使用 */
const HAS_PICK = 3

/** 优惠券类型  有效类型1-固定有效时间2-自领取开始时间*/
const IS_STABLE = 1

const CouponItem: React.FC<IPorps> = (props) => {
  const { couponInfo, linkdisable, onClick } = props
  const translate = getWebIntl()

  const handleClick = () => {
    if (!linkdisable) {
      onClick?.(couponInfo)
    }
  }

  return (
    <div className={styles['coupon-list-item']}>
      <div className={styles['coupon-conditions-wrap']}>
        <span className={styles['coupon-money']}>
          <span className={styles['coupon-currency']}>
            {translate('web.common.currencySymbol')}
          </span>
          {couponInfo.denomination}
        </span>
        <span className={styles['coupon-condition']}>
          {translate('web.resource.mall.mandatajian', {
            data: couponInfo.useConditionMoney,
          })}
        </span>
      </div>
      <div className={styles['coupon-info']}>
        <span className={styles['coupon-info-typeName']}>
          {couponInfo.typeName}
        </span>
        <span className={styles['coupon-info-date']}>
          {couponInfo.effectiveType === IS_STABLE
            ? translate('web.resource.mall.startzhiend', {
                start: moment(couponInfo.effectiveTimeStart).format(
                  'YYYY-MM-DD',
                ),
                end: moment(couponInfo.effectiveTimeEnd).format('YYYY-MM-DD'),
              })
            : translate('web.resource.mall.lingquhoudaytianshixiao', {
                data: couponInfo.invalidDay || 1,
              })}
        </span>
        <div
          onClick={handleClick}
          className={classNames(styles['coupon-info-btn'], {
            [styles['coupon-info-btn-disabled']]:
              couponInfo.canReceive === HAS_PICK,
          })}
        >
          {couponInfo.canReceive === HAS_PICK
            ? translate('web.resource.mall.yilingqu')
            : translate('web.resource.mall.lijilingqu')}
        </div>
      </div>
    </div>
  )
}

export default CouponItem
