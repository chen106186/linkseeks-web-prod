import React, { useMemo } from 'react'
import styles from './tabFooter.less'
import { getIntl } from '@linkseeks/i18n'
import { priceFormat } from '@/utils/numberFomat'

const intl = getIntl()

interface Iprops {
  originalPrice: number
  discountPrice: number
}

const TabFooter: React.FC<Iprops> = (props: Iprops) => {
  // const intl = useIntl();
  const { discountPrice, originalPrice } = props

  const cacheDiscountPrice = useMemo(() => discountPrice?.toString().split('.'), [discountPrice])
  return (
    <div className={styles.footer}>
      <div className={styles.price}>
        <div className={styles.discount}>
          {intl.formatMessage({ id: 'common.money' })}
          <span className={styles.priceInt}>{cacheDiscountPrice[0]}</span>.
          <span>{cacheDiscountPrice?.[1] || '00'}</span>
        </div>
        <span className={styles.originalPrice}>
          {intl.formatMessage({ id: 'common.money' })}
          {priceFormat(originalPrice)}
        </span>
      </div>
      <div className={styles.button}>
        <span>{intl.formatMessage({ id: 'activityPage.buyNow' })}</span>
      </div>
    </div>
  )
}

export default TabFooter
