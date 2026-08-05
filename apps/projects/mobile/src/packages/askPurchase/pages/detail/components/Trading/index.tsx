import React from 'react'
import { GetTradeAskPurchaseDetailForShopResponse } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { useMobileIntl } from '@apps/locales'
import styles from '../../index.module.scss'

interface IProps {
  PAGE: string
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
}

const Trading: React.FC<IProps> = ({ PAGE, dataSoucre }) => {
  const intl = useIntl()
  const translate = useMobileIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiry.jiaoyitiaojian', defaultMessage: '交易条件' })}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.jiaofushijian', defaultMessage: '交付时间' })}
          value={dataSoucre?.deliverTime || ''}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.baojiajiezhishijian', defaultMessage: '报价截止时间' })}
          value={dataSoucre?.quoteEndTime || ''}
        />
        {PAGE !== 'LIST' && (
          <>
            <Cell.Item title={translate('mobile.resource.askPurchase.lianxiren')} value={dataSoucre?.contactName} />
            <Cell.Item
              title={translate('mobile.resource.askPurchase.lianxidianhua')}
              value={dataSoucre?.contactMobile}
            />
          </>
        )}
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.jiaofudizhi', defaultMessage: '交付地址' })}
          value={dataSoucre?.deliverAddress}
        />
      </Cell>
    </MellowCard>
  )
}

export default Trading
