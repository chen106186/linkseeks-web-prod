import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import styles from '../index.module.scss'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  dataSoucre: GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse | undefined
}

const Other: React.FC<IProps> = ({ dataSoucre }) => {
  const intl = useIntl()
  const translate = useMobileIntl()

  return (
    <MellowCard
      title={translate('mobile.resource.askPurchase.baojiadanxinxi')}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={translate('mobile.resource.askPurchase.jiaofushuoming')}
          value={dataSoucre?.deliverRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.fukuanshuoming')}
          value={dataSoucre?.paymentRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.shuifeishuoming')}
          value={dataSoucre?.taxesRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.wuliushuoming')}
          value={dataSoucre?.logisticsRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.baozhuangshuoming')}
          value={dataSoucre?.packageRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.qitashuoming')}
          value={dataSoucre?.otherRemark || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
      </Cell>
    </MellowCard>
  )
}

export default Other
