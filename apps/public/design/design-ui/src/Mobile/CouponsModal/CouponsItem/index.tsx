import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'
import CouponPlatfromIcon from '../../../img/coupon_platform.png'
import CouponShopIcon from '../../../img/coupon_shop.png'

interface CouponsItemProps {
  name?: string
  type?: number
  useConditionMoney?: number | string
  expiredDay?: number | string
  denomination?: number | string
  isnull?: boolean
  className?: any
  crossorigin?: '' | 'anonymous' | 'use-credentials' | undefined
}

const CouponsItem: React.FC<CouponsItemProps> = (props: CouponsItemProps) => {
  const {
    name,
    type,
    useConditionMoney,
    expiredDay,
    denomination,
    isnull = true,
    className,
    crossorigin,
    ...other
  } = props

  const renderComponent = (
    locale: MobileLocale,
    lang: (
      key: keyof MobileLocale,
      defaultMessage: string,
      options: any,
    ) => string,
  ) => {
    if (isnull) {
      return (
        <div
          className={cx(styles[`lingxi-couponsModal-item-null`], className)}
          {...other}
        >
          <PlusOutlined />
        </div>
      )
    } else {
      return (
        <div
          className={cx(styles['lingxi-couponsModal-item'], className)}
          {...other}
        >
          <img
            crossOrigin={crossorigin}
            className={styles['lingxi-couponsModal-item-icon']}
            src={type === 1 ? CouponPlatfromIcon : CouponShopIcon}
          />
          <div className={styles['lingxi-couponsModal-item-right']}>
            <div className={styles['lingxi-couponsModal-item-right-title']}>
              {name}
            </div>
            {/* <div className={styles['lingxi-couponsModal-item-right-info']}>满 {useConditionMoney} 元可用 ｜ {expiredDay} 天内有效</div> */}
            <div className={styles['lingxi-couponsModal-item-right-info']}>
              {lang(
                'mobile.coupon.use.condition.day',
                '满 {price} 元可用 ｜ {day} 天内有效',
                { price: useConditionMoney, day: expiredDay },
              )}
            </div>
            <div className={styles['lingxi-couponsModal-item-right-bottom']}>
              <div
                className={
                  styles['lingxi-couponsModal-item-right-bottom-money']
                }
              >
                ¥<span>{denomination}</span>
              </div>
              <div
                className={styles['lingxi-couponsModal-item-right-bottom-btn']}
              >
                {locale['mobile.coupon.use']}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default CouponsItem
