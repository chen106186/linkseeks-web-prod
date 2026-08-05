import React from 'react'
import styles from './index.less'

interface Iprops {
  originalPrice: number
  discountPrice: number
  unit?: string
}

const Price: React.FC<Iprops> = (props: Iprops) => {
  const { unit = '件', originalPrice, discountPrice } = props
  return (
    <div className={styles.price}>
      <div className={styles.originalPrice}>
        <span className={styles.currency}>￥</span>
        <span>
          {discountPrice || originalPrice}/{unit}
        </span>
      </div>
      {(originalPrice !== discountPrice && originalPrice && (
        <div className={styles.discountPrice}>
          ￥{originalPrice}/{unit}
        </div>
      )) ||
        null}
    </div>
  )
}

export default Price
