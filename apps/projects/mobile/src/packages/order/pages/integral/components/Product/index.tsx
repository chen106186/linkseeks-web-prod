import MellowCard from '@/components/MellowCard'
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Image, Text } from '@apps/mobile-ui'
import { DELIVERY_TYPE_ENUM } from '@/constants/const/product'
// import styles from '@/components/Modemobile/styles';
import styles from './index.module.scss'

type SkuType = {
  unitName: string
  count: number
  attributeName: string
  showPrice: number
  skuid: number
}

interface Iprops {
  storeId: number
  storePic: string
  storeName: string
  commodity: {
    commodityName: string
    commodityId: number
    commodityLogo: string
    skuItem: SkuType
    deliveryType: number
    logisticsDetail?: {
      address: string
      areaCode: string
      cityCode: string
      cityName: string
      districtCode: string
      districtName: string
      id: number
      isDefault: number
      phone: string
      postalCode: string
      provinceCode: string
      provinceName: string
      shipperName: string
      tel: string
    }
  }
}

const Product: React.FC<Iprops> = (props: Iprops) => {
  const { storeName, storePic, commodity } = props
  const intl = useIntl()
  return (
    <MellowCard
      style={{ marginTop: pxTransform(8) }}
      title={
        storeName ? (
          <View className={styles.header}>
            <Image className={styles['store-logo']} src={storePic} />
            <Text className={styles['store-name']}>{storeName}</Text>
          </View>
        ) : (
          <View className={styles.header}></View>
        )
      }
    >
      <View className={styles.container}>
        <View className={styles['product-info']}>
          <Image className={styles['product-image']} src={commodity.commodityLogo} />
          <View className={styles['product-props']}>
            <Text className={styles['product-name']}>{commodity.commodityName}</Text>
            <Text className={styles['product-sku']}>{commodity.skuItem.attributeName}</Text>
            <View className={styles['product-footer']}>
              <Text className={styles['product-score']}>{commodity.skuItem.showPrice}</Text>
              <Text className={styles['product-score-text']}>
                {intl.formatMessage({ id: 'integral.jifen1', defaultMessage: '积分' })}
              </Text>
              <Text className={styles['product-count']}>{`x${commodity.skuItem.count}`}</Text>
            </View>
          </View>
        </View>
        {commodity.deliveryType === DELIVERY_TYPE_ENUM.SELF_PICKUP && (
          <View className={styles.footer}>
            <Text className={styles['footer-tips']}>
              {intl.formatMessage({ id: 'integral.order.selfPick', defaultMessage: '该商品需要前往一下地址提取货物' })}
            </Text>
            <View className={styles['self-pick-user']}>
              <Text>{commodity.logisticsDetail?.shipperName}</Text>
              <Text className={styles['self-pick-user-phone']}>{commodity.logisticsDetail?.phone}</Text>
            </View>
            <Text className={styles['self-pick-address']}>
              {`${commodity.logisticsDetail?.provinceName}/${commodity.logisticsDetail?.cityName}/${commodity.logisticsDetail?.districtName}${commodity.logisticsDetail?.address}`}
            </Text>
          </View>
        )}
      </View>
    </MellowCard>
  )
}

export default Product
