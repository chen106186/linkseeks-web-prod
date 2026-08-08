/**
 * 企业采购-首页卡片
 */
import React from 'react'
import { ShoppingCartOutlined, HistoryOutlined } from '@ant-design/icons'
import { getQueryString } from '@/utils/getUrlParam'
import { useLocation } from 'react-router-dom'
import styles from './index.module.less'

interface Props {
  cardWidth: number
  cardTitle?: string
  cardType?: string
  cardAddress?: string
  deliverData?: string
  cardFrom?: string
  commodity?: number
  lostDay?: number
  company?: string
  date?: string
  topBorderColor?: string
  jumpUrl?: string
}
/**
 * @cardTitle 卡片标题
 */
const InquiryCard: React.FC<Props> = (props) => {
  const {
    cardTitle,
    cardType,
    cardAddress,
    deliverData,
    cardFrom,
    commodity,
    lostDay,
    company,
    date,
    topBorderColor,
    jumpUrl = '',
  } = props
  const { search } = useLocation()
  const inShop = getQueryString('inShop', search || '')

  return (
    <ul
      className={styles['inquiry-main']}
      style={{ width: props.cardWidth, borderColor: topBorderColor ? topBorderColor : '#ffffff' }}
    >
      <li className={styles['card-title']}>{cardTitle}</li>

      <li className={styles['card-type']}> # {cardType}</li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'交付地址'}：</span>
        <span className={styles['address-value']}>{cardAddress}</span>
      </li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'交付日期'}：</span>
        <span className={styles['address-value']}>{deliverData}</span>
      </li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'适用地市'}：</span>
        <span className={styles['address-value']}>{cardFrom}</span>
      </li>

      <li className={styles['card-item']} style={{ margin: '24px 0 34px' }}>
        <div>
          <ShoppingCartOutlined translate={undefined} className={styles['icon-sign']} />
          <span>{`物料${commodity || 0}种`}</span>
        </div>
        <div>
          <HistoryOutlined translate={undefined} className={styles['icon-sign']} />
          {lostDay && lostDay > 0 ? <span>{`不足${lostDay}天`}</span> : <span>{'已经截止'}</span>}
        </div>
      </li>
      {!inShop && (
        <li className={styles['card-content']} style={{ marginTop: '24px' }}>
          {company}
        </li>
      )}

      <li className={styles['card-content']}>{date}</li>

      <li>
        <a href={jumpUrl} className="all-jump"></a>
      </li>
    </ul>
  )
}

export default InquiryCard
