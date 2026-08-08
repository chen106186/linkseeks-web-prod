import React from 'react'
import creditIcon from './credit.png'
import styles from './index.less'

interface ShopCreditType {
  creditPoint: number
  style?: React.CSSProperties
}

const ShopCredit: React.FC<ShopCreditType> = (props) => {
  const { creditPoint, style } = props

  return (
    <div className={styles.shopCredit} style={style}>
      <img className={styles.shopCreditIcon} src={creditIcon} />
      <div className={styles.pointWrap}>
        <span>{creditPoint}</span>
      </div>
    </div>
  )
}

export default ShopCredit
