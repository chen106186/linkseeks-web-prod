import React from 'react'
import styles from './index.less'
import { getOssUrlPath } from '@apps/constants'

interface ShopCreditType {
  creditPoint: number
}

const ShopCredit: React.FC<ShopCreditType> = (props) => {
  const { creditPoint } = props

  return (
    <div className={styles.shopCredit}>
      <img className={styles.shopCreditIcon} src={getOssUrlPath('/irregular/mall/icons/credit.png')} />
      <div className={styles.pointWrap}>
        <span>{creditPoint}</span>
      </div>
    </div>
  )
}

export default ShopCredit
