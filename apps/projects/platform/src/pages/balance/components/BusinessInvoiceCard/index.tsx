import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { priceFormat } from '@/utils/numberFomat'

import styles from './index.less'
import { useWebIntl } from '@apps/locales'

interface BusinessInvoiceCardData {
  invoiceNumber: number
  invoiceDate: string
  invoiceMoney: number
}

interface BusinessInvoiceCardProps {
  data: BusinessInvoiceCardData
}

const BusinessInvoiceCard: React.FC<BusinessInvoiceCardProps> = (props: BusinessInvoiceCardProps) => {
  const { data } = props
  const intl = useIntl()
  const translate = useWebIntl()
  return (
    <div className={styles.invoiceCard}>
      <div className={styles.title}>
        {intl.formatMessage({ id: 'balance.components.businessInvoiceCard.invoiceNumber' })}：
        <span>{data.invoiceNumber}</span>
      </div>
      <div className={styles.title}>
        {intl.formatMessage({ id: 'balance.components.businessInvoiceCard.invoiceDate' })}：
        <span>{data.invoiceDate}</span>
      </div>
      <div className={styles.title}>
        {intl.formatMessage({ id: 'balance.components.businessInvoiceCard.invoiceMoney' })}：
        <span>
          {translate('web.common.currencySymbol')}
          {priceFormat(data.invoiceMoney)}
        </span>
      </div>
    </div>
  )
}

export default BusinessInvoiceCard
