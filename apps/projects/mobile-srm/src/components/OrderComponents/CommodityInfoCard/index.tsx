import React, { useState } from 'react'
import { View, Icons, Image } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import InfoCard from '@/components/InfoCard'
import InfoWrap from '@/components/InfoWrap'
import OrderItemCard from '@/components/OrderComponents/OrderItemCard'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

export type PropsType = {
  source: any
  showEditPrice?: boolean
}

const CommodityInfoCard = ({ source = {}, showEditPrice = false }: PropsType) => {
  const intl = useIntl()
  const [showMore, setShowMore] = useState<boolean>(false)

  return (
    <InfoCard
      title={
        <View className={styles['vendor-wrap']} style={{ marginBottom: pxTransform(2) }}>
          <Image className={styles['logo']} src={source.logo} />
          <View>{source.vendorMemberName}</View>
        </View>
      }
    >
      {source.products?.map((item, index) =>
        index === 0 || showMore ? (
          <View key={item.orderProductId} style={{ marginBottom: showMore ? pxTransform(16) : 0 }}>
            <OrderItemCard
              hideHeader
              hideFooter
              showEditPrice={showEditPrice}
              customStyle={{ padding: 0 }}
              itemData={{
                products: [item],
                orderId: source.orderId,
              }}
            />
            <View className={styles['info-address']}>
              <InfoWrap
                title={intl.formatMessage({ id: 'order.distributionMode', defaultMessage: '配送方式' })}
                subtitle={item.deliverTypeName}
              />
              <InfoWrap
                title={intl.formatMessage({ id: 'order.shippingAddress', defaultMessage: '配送地址' })}
                subtitle={`${item.receiver} / ${item.phone}`}
                customStyle={{ marginBottom: pxTransform(6) }}
              />
              <View className={styles['address-detail']}>{item.address}</View>
            </View>
          </View>
        ) : null,
      )}
      {source.products?.length > 1 && (
        <View className={styles['open-close-more']} onClick={() => setShowMore((value) => !value)}>
          <View>
            {showMore
              ? intl.formatMessage({ id: 'order.putAway', defaultMessage: '收起' })
              : intl.formatMessage({ id: 'order.viewRemainingItems', defaultMessage: '查看剩余商品' })}
          </View>
          <Icons
            name={showMore ? 'ChevronUp' : 'ChevronDown'}
            size={12}
            color="#91959B"
            customStyle={{ marginLeft: pxTransform(4) }}
          />
        </View>
      )}
    </InfoCard>
  )
}

export default CommodityInfoCard
