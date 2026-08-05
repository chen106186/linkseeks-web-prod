import React from 'react'
import quality from './quality.png'
import styles from './index.module.less'

interface Props {
  companyTitle?: string
  creditPoint?: string
  inquiryNum?: string // 询价次数
  inviteTenderNum?: string // 招标次数
  biddingNum?: string // 竞价次数
  purchaseAmount?: string // 采购金额
}

const CompanyCard: React.FC<Props> = (props) => {
  const {
    companyTitle = '-',
    inquiryNum = '0',
    inviteTenderNum = '0',
    biddingNum = '0',
    purchaseAmount = '0',
    creditPoint = '0',
  } = props

  return (
    <ul className={styles['company-card']}>
      <li className={styles['company-title']}>{companyTitle}</li>
      <li className={styles['company-title-second']}>
        <img className={styles['quality-img']} src={quality} alt="" />
        <span className={styles['quality-tips']}>{creditPoint}</span>
      </li>
      <li className={styles['cumulative-money']}>{'累计采购金额'}：</li>
      <li className={styles['number-money']}>{`${purchaseAmount}万元`}</li>
      <li className={styles['card-item']}>
        <div className={styles['card-key']}>{'累计询价'}：</div>
        <div className={styles['card-value']}>{`${inquiryNum}单`}</div>
      </li>
      <li className={styles['card-item']}>
        <div className={styles['card-key']}>{'累计招标'}：</div>
        <div className={styles['card-value']}>{`${inviteTenderNum}单`}</div>
      </li>
      <li className={styles['card-item']}>
        <div className={styles['card-key']}>{'累计竞价'}：</div>
        <div className={styles['card-value']}>{`${biddingNum}单`}</div>
      </li>
    </ul>
  )
}

export default CompanyCard
