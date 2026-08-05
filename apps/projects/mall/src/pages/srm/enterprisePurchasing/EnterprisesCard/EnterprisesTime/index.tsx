import React from 'react'
import styles from '../index.module.less'

interface Props {
  inquiryNum?: string
  inviteTenderNum?: string
  biddingNum?: string
  purchaseAmount?: string
}

function EnterprisesTime(props: Props) {
  const {
    inquiryNum = '0', // 累计询价(次)
    inviteTenderNum = '0', // 累计招标
    biddingNum = '0', // 累计竞价
    purchaseAmount = '0', // 累计采购金额
  } = props

  return (
    <ul className={styles['enterprises-right']}>
      <li className={styles['enterprises-right-item']}>
        <div className={styles['enterprises-key']}>{'累计询价(次)'}</div>
        <div className={styles['enterprises-money']}>{inquiryNum}</div>
      </li>
      <li className={styles['enterprises-right-item']}>
        <div className={styles['enterprises-key']}>{'累计招标(次)'}</div>
        <div className={styles['enterprises-money']}>{inviteTenderNum}</div>
      </li>
      <li className={styles['enterprises-right-item']}>
        <div className={styles['enterprises-key']}>{'累计竞价(次)'}</div>
        <div className={styles['enterprises-money']}>{biddingNum}</div>
      </li>
      <li className={styles['enterprises-right-item']}>
        <div className={styles['enterprises-key']}>{'累计采购金额(元)'}</div>
        <div className={styles['enterprises-money']}>{purchaseAmount}</div>
      </li>
    </ul>
  )
}

export default EnterprisesTime
