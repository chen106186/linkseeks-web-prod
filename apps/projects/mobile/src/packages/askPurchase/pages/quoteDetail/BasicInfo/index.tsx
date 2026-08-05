import React from 'react'
import { GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { View, Text, Toast } from '@apps/mobile-ui'
import styles from '../index.module.scss'
import { setClipboardData } from '@apps/mobile-services/utils/taro'
import { dateFormat } from '@/utils/date'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  dataSoucre: GetTradeMobileAskPurchaseAskPurchaseQuoteDetailResponse | undefined
}

const BasicInfo: React.FC<IProps> = ({ dataSoucre }) => {
  const intl = useIntl()
  const translate = useMobileIntl()

  const clipboard = (dataText: any) => {
    setClipboardData({
      data: dataText,
      success: () => {
        Toast.show({
          title: translate('mobile.resource.askPurchase.neirongfuzhichenggong'),
          icon: 'none',
        })
      },
    })
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'inquiry.jibenxinxi', defaultMessage: '基本信息' })}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={translate('mobile.resource.askPurchase.duiyingxuqiudanhao')}
          value={
            <View>
              <Text style={{ color: '#91959b' }}>{dataSoucre?.askPurchaseNo}</Text>
              <Text
                onClick={() => clipboard(dataSoucre?.askPurchaseNo)}
                className={styles['inquiryDetailContainer-textCopyStyle']}
              >
                {translate('mobile.common.copy')}
              </Text>
            </View>
          }
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.jiezhishijian')}
          value={dataSoucre?.quoteEndTime ? dateFormat(new Date(dataSoucre?.quoteEndTime)) : ''}
        />
        <Cell.Item
          title={translate('mobile.resource.askPurchase.caigoushangmingcheng')}
          value={dataSoucre?.memberName}
        />
        <Cell.Item title={translate('mobile.resource.askPurchase.danjushijian')} value={dataSoucre?.billTime} />
      </Cell>
    </MellowCard>
  )
}

export default BasicInfo
