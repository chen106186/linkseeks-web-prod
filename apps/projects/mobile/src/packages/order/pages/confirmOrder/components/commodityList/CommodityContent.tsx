import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { observer } from 'mobx-react-lite'
import { fnGetNewEstimatePrice } from '../../../../common/commonlyFn'
import styles from './index.module.scss'

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  newCommodity: any
}

const CommodityContent: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl()
  const { newCommodity } = props

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
      return intl.formatMessage({ id: 'confirmOrder_components_commodityList_commodityContent_fnGetSku' })
    }
  }
  return (
    <View className={styles['card-main']}>
      <View className={styles['money-warp']}>
        <View className={styles['money-left']}>
          <Image src={newCommodity.commodityLogo} style={{ width: pxTransform(96), height: pxTransform(96) }} />
        </View>
        <View className={styles['money-center']}>
          <View className={styles['box']}>
            {`${newCommodity.isMain}` === 'false' && newCommodity.purchaseCommodityType === 4 && (
              <Text className={styles['exchange-title']}>
                {newCommodity.purchaseCommodityType === 4
                  ? intl.formatMessage({
                      id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_exchange',
                    })
                  : intl.formatMessage({
                      id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_selmeal',
                    })}
              </Text>
            )}
            <Text className={styles['center-title']}>{newCommodity.name}</Text>
          </View>
          <Text className={styles['center-title-sku']}>{fnGetSku(newCommodity.commoditySku)}</Text>
          <View className={styles['product-warp']}>
            <View className={styles['product-number']}>
              <Text className={styles['min-text']}>{intl.formatMessage({ id: 'currency' })}</Text>
              <Text className={styles['price-text']}>{fnGetNewEstimatePrice(newCommodity)}</Text>
              <Text className={styles['min-text']}>{`/${newCommodity.unitName || newCommodity.unit}`}</Text>
            </View>
            <Text className={styles['center-title-small']}>{`X${newCommodity.count}`}</Text>
          </View>
        </View>
      </View>
      {newCommodity.giveList?.map((giveItem: any, index: number) => {
        return (
          <View className={styles['money-warp']} key={`give_${index}`}>
            <View className={styles['center-title-small']}>{`${intl.formatMessage({
              id: 'purchase_commonlyFn_callBlackTips_fnGetActivityTips_callBlackTips_give',
            })}:${giveItem.name}`}</View>
            <View className={styles['center-title-small']}>{`${giveItem.num}${giveItem.unit || ''}`}</View>
          </View>
        )
      })}
    </View>
  )
}

export default observer(CommodityContent)
