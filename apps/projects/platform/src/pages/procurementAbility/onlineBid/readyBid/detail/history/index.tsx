import React from 'react'

import level1 from '@/assets/icons/the_first.png'
import level2 from '@/assets/icons/the_second.png'
import level3 from '@/assets/icons/the_third.png'

import { priceFormat } from '@/utils/numberFomat'

import TrendTag from '../../../../components/detail/components/trendTag'

import styles from './index.less'
import OfferItem from '../offer'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

interface HistoryItemProps {
  detail: any
}

const HistoryItem: React.FC<HistoryItemProps> = (props: any) => {
  const { detail } = props
  const mapData = detail.offerLogs ? [...detail.offerLogs].splice(0, 3) : []
  const firstData = mapData[0]
  const _returnBadge = () => {
    if (!detail.isOpenRanking) {
      return null
    } else {
      const _number = Number(detail?.ranking ?? 0)
      switch (_number) {
        case 1:
          return <img src={level1} alt={intl.formatMessage({ id: 'detail.purchase.label8' })} className={styles.icon} />
        case 2:
          return <img src={level2} alt={intl.formatMessage({ id: 'detail.purchase.label9' })} className={styles.icon} />
        case 3:
          return (
            <img src={level3} alt={intl.formatMessage({ id: 'detail.purchase.label10' })} className={styles.icon} />
          )
        default:
          return <div className={styles.badge}>{_number}</div>
      }
    }
  }

  return (
    <div className={styles.history}>
      <div className={styles.historyHeader}>
        <h5>{intl.formatMessage({ id: 'detail.purchase.label11' })}</h5>
        <div className={styles.box}>
          {_returnBadge()}
          <div className={styles.rightPosition}>
            {firstData?.offerRatio ? <TrendTag ratio={firstData?.offerRatio} /> : ''}
          </div>
          <p>{intl.formatMessage({ id: 'detail.purchase.label12' })}</p>
          <p className={styles.currentPrice}>
            <span>{intl.formatMessage({ id: 'common.money' })}</span>
            {firstData?.offerPrice ? priceFormat(firstData?.offerPrice) : '-'}
          </p>
          <div className={styles.row}>
            <div className={styles.col} style={{ borderRight: '1px solid #EBECF0' }}>
              {intl.formatMessage({ id: 'detail.purchase.nowMinPrice1' })}：
              <span>
                {detail.isOpenPurchase
                  ? detail?.minLowPrice
                    ? `${intl.formatMessage({ id: 'common.money' })}${priceFormat(detail?.minLowPrice)}`
                    : '-'
                  : intl.formatMessage({ id: 'detail.purchase.label7' })}
              </span>
            </div>
            <div className={styles.col}>
              {intl.formatMessage({ id: 'detail.purchase.allowPurchaseCount1' })}：
              <span>{firstData?.offerCount ? firstData?.offerCount : '-'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.historyFootter}>
        <h5>{intl.formatMessage({ id: 'detail.purchase.label13' })}</h5>
        {mapData &&
          mapData.map((item) => {
            return (
              <OfferItem
                key={item.offerTime}
                detail={{ ...item, isOpenRanking: detail.isOpenRanking, isOpenPurchase: detail.isOpenPurchase }}
              />
            )
          })}
      </div>
    </div>
  )
}

export default HistoryItem
