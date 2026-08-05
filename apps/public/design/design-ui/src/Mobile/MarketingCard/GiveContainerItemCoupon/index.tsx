import React from 'react'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'

interface GiveContainerItemCouponProps {
  typeName?: string
  denomination: number
  useConditionMoney: number
  [key: string]: any
}

const GiveContainerItemCoupon: React.FC<GiveContainerItemCouponProps> = (
  props: GiveContainerItemCouponProps,
) => {
  const renderComponent = (
    locale: MobileLocale,
    lang: (
      key: keyof MobileLocale,
      defaultMessage: string,
      options: any,
    ) => string,
  ) => {
    const {
      typeName = locale['mobile.marketing.business.coupons'],
      denomination,
      useConditionMoney,
    } = props

    return (
      <div className={styles[`lingxi-marketingCard-GiveContainerItemCoupon`]}>
        <div
          className={
            styles[`lingxi-marketingCard-GiveContainerItemCoupon-denomination`]
          }
        >
          ¥<span>{denomination}</span>
        </div>
        <div
          className={
            styles[
              `lingxi-marketingCard-GiveContainerItemCoupon-useConditionMoney`
            ]
          }
        >
          {lang('mobile.coupon.use.condition', '满${price}可使用', {
            price: useConditionMoney,
          })}
        </div>
        <div
          className={
            styles[`lingxi-marketingCard-GiveContainerItemCoupon-typeName`]
          }
        >
          {typeName}
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default GiveContainerItemCoupon
