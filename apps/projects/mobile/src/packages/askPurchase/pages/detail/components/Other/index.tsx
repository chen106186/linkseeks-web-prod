import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { GetTradeAskPurchaseDetailForShopResponse } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import styles from '../../index.module.scss'

interface IProps {
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
}

const Other: React.FC<IProps> = ({ dataSoucre }) => {
  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiry.qitashuoming', defaultMessage: '其他说明' })}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.baojiayaoqiu', defaultMessage: '报价要求' })}
          value={dataSoucre?.quoteRequire || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.fukuanfangshi', defaultMessage: '付款方式' })}
          value={dataSoucre?.paymentWay || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.shuifeiyaoqiu', defaultMessage: '税费要求' })}
          value={dataSoucre?.taxesRequire || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.wuliuyaoqiu', defaultMessage: '物流要求' })}
          value={dataSoucre?.logisticsRequire || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.baozhuangyaoqiu', defaultMessage: '包装要求' })}
          value={dataSoucre?.packageRequire || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
        <Cell.Item
          title={intl.formatMessage({ id: 'inquiry.qitayaoqiu', defaultMessage: '其他要求' })}
          value={dataSoucre?.otherRequire || intl.formatMessage({ id: 'inquiry.wu', defaultMessage: '无' })}
        />
      </Cell>
    </MellowCard>
  )
}

export default Other
