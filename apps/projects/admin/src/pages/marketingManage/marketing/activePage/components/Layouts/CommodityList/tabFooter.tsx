import React, { useMemo } from 'react'
import styles from './tabFooter.less'

interface Iprops {
  originalPrice: number
  discountPrice: number
}

const TabFooter: React.FC<Iprops> = (props: Iprops) => {
  const { discountPrice, originalPrice } = props
  const cacheDiscountPrice = useMemo(() => discountPrice?.toString().split('.'), [discountPrice])
  return (
    <div className={styles.footer}>
      <div className={styles.price}>
        <div className={styles.discount}>
          ￥<span className={styles.priceInt}>{cacheDiscountPrice[0]}</span>.
          <span>{cacheDiscountPrice?.[1] || '00'}</span>
        </div>
        <span className={styles.originalPrice}>￥{originalPrice.toFixed(2)}</span>
      </div>
      <div className={styles.button}>
        <span>立即抢购</span>
      </div>
    </div>
  )
}

export default TabFooter
