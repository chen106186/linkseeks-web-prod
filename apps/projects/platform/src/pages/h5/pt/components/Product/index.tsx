import React, { useMemo } from 'react'
import { getWebIntl } from '@apps/locales'
import styles from './index.module.less'

interface Iprops {
  productName: string
  productImage: string
  price: number
  slogan: string
  activityPrice: number
  loading?: boolean
}

const Product: React.FC<Iprops> = (props: Iprops) => {
  const { productName, productImage, price, slogan, activityPrice, loading = false } = props
  const translate = getWebIntl()

  if (loading) {
    return (
      <div className={styles.product}>
        <div className={styles['product-image-loading']} />
        <div className={styles.info}>
          <div className={styles['info-name-loading']} />
          <div className={styles['info-slogan-loading']} />
          <div className={styles['info-footer']}>
            <div className={styles['activity-price-loading']} />
          </div>
        </div>
      </div>
    )
  }

  const formatActivityPrice = useMemo(() => (activityPrice || 0)?.toFixed(2).split('.'), [activityPrice])

  return (
    <div className={styles.product}>
      <img className={styles['product-image']} src={productImage} />
      <div className={styles.info}>
        <div className={styles['info-name']}>{productName}</div>
        <div className={styles['info-slogan']}>{slogan}</div>
        <div className={styles['info-footer']}>
          <div className={styles['activity-price']}>
            {translate('web.common.currencySymbol')}
            <span className={styles['activity-price-big']}>{formatActivityPrice[0]}</span>.{formatActivityPrice[1]}
          </div>
          <div className={styles['original-price']}>{`${translate('web.common.currencySymbol')}${price}`}</div>
        </div>
      </div>
    </div>
  )
}

export default Product
