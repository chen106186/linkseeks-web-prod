import { getWebIntl } from '@/utils/locales'
import React, { useMemo } from 'react'
import styles from './price.module.less'

interface Iprops {
  originalPrice: number
  discountPrice?: number
  unit?: string
}

const Price: React.FC<Iprops> = (props: Iprops) => {
  const translate = getWebIntl()

  const { unit = translate('web.common.jian'), originalPrice, discountPrice } = props
  const isSame = originalPrice === discountPrice
  const currentPrice = useMemo(() => {
    return discountPrice || originalPrice || 0
  }, [originalPrice, discountPrice])

  return (
    <div className={styles.price}>
      <div className={styles.originalPrice}>
        <span className={styles.currency}>{translate('web.common.currencySymbol')}</span>
        <span>
          {currentPrice}/{unit}
        </span>
      </div>
      {!isSame && originalPrice && (
        <div className={styles.discountPrice}>
          {translate('web.common.currencySymbol')}
          {originalPrice}/{unit}
        </div>
      )}
    </div>
  )
}

export default Price
