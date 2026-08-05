import React from 'react'
import { GetTradeAskPurchaseDetailForShopResponse } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { View, Text, Toast } from '@apps/mobile-ui'
import { PAGE_TYPE } from '../../index'
import styles from '../../index.module.scss'
import { setClipboardData } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'

interface IProps {
  PAGE: PAGE_TYPE
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
}

const BasicInfo: React.FC<IProps> = ({ PAGE, dataSoucre }) => {
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
          title={
            PAGE === 'LIST'
              ? translate('mobile.resource.askPurchase.danhao')
              : translate('mobile.resource.askPurchase.xunyuandanhao')
          }
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
        {PAGE === 'LIST' && (
          <Cell.Item
            title={intl.formatMessage({ id: 'inquiry.xuqiuzhaiyao', defaultMessage: '需求摘要' })}
            value={dataSoucre?.name}
          />
        )}
        {PAGE !== 'LIST' && (
          <>
            <Cell.Item
              title={translate('mobile.resource.askPurchase.xunyuanxuqiudanzhaiyao')}
              value={dataSoucre?.name}
            />
            <Cell.Item title={translate('mobile.resource.askPurchase.danjushijian')} value={dataSoucre?.billTime} />
            <Cell.Item
              title={translate('mobile.resource.askPurchase.baojiajiezhishijian')}
              value={dataSoucre?.quoteEndTime}
            />
          </>
        )}
      </Cell>
    </MellowCard>
  )
}

export default BasicInfo
