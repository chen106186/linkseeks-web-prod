import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  newCommodity: any
}

const CommodityContent: React.FC<Iprops> = (props: Iprops) => {
  const { newCommodity } = props
  const intl = useIntl()
  /**
   * @param skuList
   * 获取sku属性
   */
  const fnGetSku = (skuList: any) => {
    try {
      if (!skuList || skuList.length === 0) {
        return ''
      }
      const str = skuList.map((item: any) => `${item.name}:${item.value}`)
      return str.join(',')
    } catch (error) {
      return intl.formatMessage({ id: 'pay.baocuole', defaultMessage: '报错了' })
    }
  }
  return (
    <View className={styles['money-warp']}>
      <View className={styles['moneyleft']}>
        <Image src={newCommodity.commodityLogo} style={{ width: pxTransform(96), height: pxTransform(96) }} />
      </View>
      <View className={styles['money-center']}>
        <Text className={styles['center-title']}>{newCommodity.name}</Text>
        <Text className={styles['center-title-sku']}>{fnGetSku(newCommodity.commoditySku)}</Text>
        <View className={styles['product-warp']}>
          <View className={styles['product-number']}>
            <Text className={styles['min-text']}>{intl.formatMessage({ id: 'currency' })}</Text>
            <Text className={styles['price-text']}>{`${newCommodity.newPrice}`}</Text>
            <Text className={styles['min-text']}>{`/${newCommodity.unitName}`}</Text>
          </View>
          <Text className={styles['center-title-small']}>{`X${newCommodity.count}`}</Text>
        </View>
      </View>
    </View>
  )
}

export default observer(CommodityContent)
