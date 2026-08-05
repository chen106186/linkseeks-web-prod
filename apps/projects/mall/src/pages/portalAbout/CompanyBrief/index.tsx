/**
 * 公司简介
 */
import React from 'react'
import Pin from './img/Pin.svg'
import Date from './img/Date.svg'
import Company from './img/Company.svg'
import staffNum from './img/staffNum.svg'
import yearProcessAmount from './img/yearProcessAmount.svg'
import { PieChartOutlined } from '@ant-design/icons/lib/icons'
import styles from './index.module.less'

interface Props {
  companyBrief?: string
  companyBusiness?: string
  briefList?: Array<{}>
}

function CompanyBrief(props: Props) {
  const {
    companyBrief = '-',
    companyBusiness = '-',
    briefList = [{ title: '地区', secondTitle: '广东广州', icon: 'address' }],
  } = props
  const fnGetIcon = (address: string) => {
    switch (address) {
      case 'address':
        return <img src={Pin} alt="" className={styles['detail-icon']} />
      case 'PieChartOutlined':
        return <PieChartOutlined translate={undefined} />
      case 'data':
        return <img src={Date} alt="" className={styles['detail-icon']} />
      case 'Company':
        return <img src={Company} alt="" className={styles['detail-icon']} />
      case 'staffNum':
        return <img src={staffNum} alt="" className={styles['detail-icon']} />
      case 'yearProcessAmount':
        return <img src={yearProcessAmount} alt="" className={styles['detail-icon']} />
      default:
        break
    }
  }
  return (
    <div className={styles['brief-main']}>
      <div className={styles['brief-title']}>公司简介</div>
      <ul className={styles['brief-item-warp']}>
        {briefList.map((item: any) => {
          return (
            <li className={styles['brief-item']} key={item.title}>
              <div className={styles['brief-item-icon']}>{fnGetIcon(item.icon)}</div>
              <div>
                <div className={styles['enterprises-value']}>{item.title}</div>
                <div className={styles['enterprises-key']}>{item.secondTitle}</div>
              </div>
            </li>
          )
        })}
      </ul>
      <ul className={styles['brief-content']}>
        <li className={styles['brief-content-item']}>
          <span className={styles['enterprises-key']}>简介：</span>
          <span className={styles['enterprises-value']}>{companyBrief}</span>
        </li>
        <li className={styles['brief-content-item']}>
          <span className={styles['enterprises-key']}>主营：</span>
          <span className={styles['enterprises-value']}>{companyBusiness}</span>
        </li>
      </ul>
    </div>
  )
}

export default CompanyBrief
