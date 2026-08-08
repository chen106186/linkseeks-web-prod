import React from 'react'
import creditIcon from './credit.png'
import styles from './index.module.less'

interface ShopCreditType {
  creditPoint: number
}

const ShopCredit: React.FC<ShopCreditType> = (props) => {
  const { creditPoint } = props

  return (
    <div className={styles.shopCredit}>
      <img className={styles.shopCreditIcon} src={creditIcon} />
      <div className={styles.pointWrap}>
        <span>{creditPoint}</span>
      </div>
    </div>
  )
}

export default ShopCredit
