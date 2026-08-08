import React from 'react'

import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'

import TrendTag from '../../../../components/detail/components/trendTag'

import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
interface OfferItemProps {
  detail: any
}

const OfferItem: React.FC<OfferItemProps> = (props: any) => {
  const { detail } = props
  return (
    <div className={styles.offerItem}>
      <div className={styles.left}>
        {detail.isOpenRanking
          ? `${intl.formatMessage({ id: 'detail.purchase.label4' })}${detail.ranking}${intl.formatMessage({
              id: 'detail.purchase.label5',
            })}`
          : intl.formatMessage({ id: 'detail.purchase.label7' })}
      </div>
      <div className={styles.right}>
        <div className={styles.row}>
          <div className={styles.rowPrice}>
            <span>
              {intl.formatMessage({ id: 'common.money' })} {priceFormat(detail.offerPrice)}
            </span>
            {intl.formatMessage({ id: 'detail.purchase.nowMinPrice1' })}：
            {detail.isOpenPurchase
              ? `${intl.formatMessage({ id: 'common.money' })}${priceFormat(detail.minPrice)}`
              : intl.formatMessage({ id: 'detail.purchase.label7' })}
          </div>
          {intl.formatMessage({ id: 'detail.purchase.label4' })}
          {detail.offerCount}
          {intl.formatMessage({ id: 'detail.purchase.label6' })}
        </div>
        <div className={styles.row}>
          <div className={styles.rowTime}>{formatTimeString(detail.offerTime, 'HH:mm:ss')}</div>
          {detail.offerRatio ? <TrendTag ratio={detail.offerRatio} /> : ''}
        </div>
      </div>
    </div>
  )
}

export default OfferItem
