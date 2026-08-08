import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'

export interface CouponsItemProps {
  // 优惠券价格
  money?: string | number
  denomination?: number
  // 适用说明
  info?: string
  useConditionMoney?: number
  // 优惠券类型
  tag?: string
  typeName?: string
  // 是否能够领取
  disable?: boolean
  // 是否为空状态
  isnull?: boolean
  className: string
  /** 货币， 发现貌似能力中心那边无论改成什么都不会出现英文，出此下策 通过provider处理，但貌似不会同步 */
  currency?: string
  rightRender?: React.ReactNode
}

const CouponsItem: React.FC<CouponsItemProps> = (props: CouponsItemProps) => {
  const {
    money,
    denomination,
    info,
    useConditionMoney,
    tag,
    typeName,
    disable,
    isnull = true,
    className,
    currency,
    rightRender,
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
    const _disableText = () => {
      return disable
        ? locale['mobile.receive.not']
        : locale['mobile.receive.at.once']
    }

    if (isnull) {
      return (
        <div
          className={cx(
            styles[`lingxi-marketingCard-couponsItem-null`],
            className,
          )}
          {...other}
        >
          <PlusOutlined />
        </div>
      )
    } else {
      return (
        <div
          className={cx(styles[`lingxi-marketingCard-couponsItem`], className)}
          {...other}
        >
          <div className={styles[`lingxi-marketingCard-couponsItem-left`]}>
            <div
              className={styles[`lingxi-marketingCard-couponsItem-left-money`]}
            >
              {currency || locale['mobile.currency']}
              <span>{money || denomination}</span>
            </div>
            <div
              className={styles[`lingxi-marketingCard-couponsItem-left-info`]}
            >
              {info ||
                lang('mobile.coupon.use.condition', '满${price}可使用', {
                  price: useConditionMoney,
                })}
            </div>
            <div
              className={
                styles[`lingxi-marketingCard-couponsItem-left-tagContainer`]
              }
            >
              <div
                className={styles[`lingxi-marketingCard-couponsItem-left-tag`]}
              >
                {tag || typeName}
              </div>
            </div>
          </div>
          {rightRender || (
            <div className={styles[`lingxi-marketingCard-couponsItem-right`]}>
              {_disableText()}
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default CouponsItem
