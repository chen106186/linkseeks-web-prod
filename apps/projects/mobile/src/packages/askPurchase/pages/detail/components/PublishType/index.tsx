import React from 'react'
import { GetTradeAskPurchaseDetailForShopResponse } from '@apps/apis'
import { View } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import { useMobileIntl } from '@apps/locales'
import { PAGE_TYPE } from '../../index'
import styles from '../../index.module.scss'

interface IProps {
  PAGE: PAGE_TYPE
  dataSoucre: GetTradeAskPurchaseDetailForShopResponse | undefined
}

const PublishType: React.FC<IProps> = ({ PAGE, dataSoucre }) => {
  const translate = useMobileIntl()

  const renderPublishType = () => {
    if (dataSoucre?.publishType === 1) {
      return (
        <View className={styles['publishType-list']}>
          {dataSoucre?.askPurchaseShopResponses &&
            dataSoucre.askPurchaseShopResponses.length > 0 &&
            dataSoucre.askPurchaseShopResponses.map((shopItem) => (
              <View className={styles['publishType-list-item']} key={shopItem.shopId}>
                {shopItem.shopName}
              </View>
            ))}
        </View>
      )
    } else {
      return (
        <View className={styles['publishType-list']}>
          {dataSoucre?.askPurchaseMemberResponses &&
            dataSoucre.askPurchaseMemberResponses.length > 0 &&
            dataSoucre.askPurchaseMemberResponses.map((memberItem) => (
              <View className={styles['publishType-list-item']} key={memberItem.memberId}>
                {memberItem.memberName}
              </View>
            ))}
        </View>
      )
    }
  }

  return dataSoucre && PAGE !== 'LIST' && PAGE.indexOf('MERCHANTS') < 0 ? (
    <MellowCard
      title={translate('mobile.resource.askPurchase.xuqiuduijie')}
      className={styles['inquiryDetailContainer-customStyle']}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={translate('mobile.resource.askPurchase.duijiefangshi')}
          value={
            dataSoucre?.publishType === 1
              ? translate('mobile.resource.askPurchase.zhidingfabushangcheng')
              : translate('mobile.resource.askPurchase.zhidinggongyingshang')
          }
        />
      </Cell>
      {renderPublishType()}
    </MellowCard>
  ) : null
}

export default PublishType
