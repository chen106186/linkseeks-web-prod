import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

interface Iprops {
  originalPrice: number
  discountPrice: number
  unit?: string
}

const Price: React.FC<Iprops> = (props: Iprops) => {
  const translate = useWebIntl()
  const { unit = translate('web.common.jian'), originalPrice, discountPrice } = props
  return (
    <div className={styles.price}>
      <div className={styles.originalPrice}>
        <span className={styles.currency}>{getIntl().formatMessage({ id: 'common.money' })}</span>
        <span>
          {discountPrice || originalPrice}/{unit}
        </span>
      </div>
      {(originalPrice !== discountPrice && originalPrice && (
        <div className={styles.discountPrice}>
          {getIntl().formatMessage({ id: 'common.money' })}
          {originalPrice}/{unit}
        </div>
      )) ||
        null}
    </div>
  )
}

export default Price
