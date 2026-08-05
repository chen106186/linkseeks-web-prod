import React from 'react'
import classNames from 'classnames'
import { message } from 'antd'
import { GetMarketingCouponActivityPageSelectPageResponseDetail, postMarketingMobileCouponReceive } from '@apps/apis'
import { LinkTo } from '@/utils'
import { useState } from 'react'
import { getWebIntl } from '@/utils/locales'
import { getLoginDomainFn } from '@/constants/domain'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'

/** 未登录 */
const NO_LOGIN = 0
/** 不符合领取条件 */
const ILLEGAL = 1
/** 未领取 */
const CAN_PICK = 2
/** 已领取，去使用 */
const HAS_PICK = 3
interface Iprops extends GetMarketingCouponActivityPageSelectPageResponseDetail {
  /** 0 => 未登录， 1 => 不符合条件 2 => 未领取， 3 => 已领取 */
  canReceive: 0 | 1 | 2 | 3
  shopId: number
}

/** belongType 所属方类型1-平台2-商家 */
const IS_PLATFORM = 1

/** 优惠券类型  有效类型1-固定有效时间2-自领取开始时间*/
const IS_STABLE = 1

const Coupon: React.FC<Iprops> = (props: Iprops) => {
  const translate = getWebIntl()
  const { url } = useGlobalConext()
  const [hasPick, setHasPick] = useState<boolean>(false)
  const {
    belongType,
    denomination,
    useConditionMoney,
    typeName,
    effectiveType,
    effectiveTimeStart,
    effectiveTimeEnd,
    invalidDay,
    canReceive,
    id,
    shopId,
  } = props

  const handleClick = async (isDisabled: boolean) => {
    if (isDisabled) {
      return
    }
    if (canReceive === NO_LOGIN) {
      LinkTo(getLoginDomainFn(url), 'replace')
      return
    }

    if (canReceive === ILLEGAL) {
      const tips = translate('web.resource.mall.ninbumanzugaiquanlingqutiaojian')
      message.error(tips)
      return
    }
    message.loading({ content: translate('web.resource.mall.zhengzailingqu'), key: 'coupon' })

    const {
      data,
      code,
      message: msg,
    } = await postMarketingMobileCouponReceive(
      {
        shopId,
        belongType: belongType,
        couponId: id,
      },
      { ctlType: 'none' },
    )
    if (code === 1000) {
      message.success({ content: translate('web.resource.mall.lingquchenggong'), key: 'coupon' })
      setHasPick(true)
      return
    }
    message.error({ content: msg, key: 'coupon' })
  }

  return (
    <div className={classNames(styles.coupon)}>
      <div className={styles['coupon-conditions-wrap']}>
        <span className={styles['coupon-money']}>
          <span className={styles['coupon-currency']}>{translate('web.common.currencySymbol')}</span>
          {denomination}
        </span>
        <span className={styles['coupon-condition']}>
          {translate('web.resource.mall.mandatajian', { data: useConditionMoney })}
        </span>
      </div>
      <div className={styles['coupon-info']}>
        <span className={styles['coupon-info-typeName']}>{typeName}</span>
        <span className={styles['coupon-info-date']}>
          {effectiveType === IS_STABLE
            ? translate('web.resource.mall.startzhiend', { start: effectiveTimeStart, end: effectiveTimeEnd })
            : translate('web.resource.mall.lingquhoudaytianshixiao', { data: invalidDay || 1 })}
        </span>
        <div
          onClick={() => handleClick(canReceive === HAS_PICK || hasPick)}
          className={classNames(styles['coupon-info-btn'], {
            [styles['coupon-info-btn-disabled']]: canReceive === HAS_PICK || hasPick,
          })}
        >
          {canReceive === HAS_PICK || hasPick
            ? translate('web.resource.mall.yilingqu')
            : translate('web.resource.mall.lijilingqu')}
        </div>
      </div>
    </div>
  )
}

export default Coupon
