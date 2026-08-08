import React, { useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import { formatPriceParts } from '../../../../utils/formatter'
import styles from './index.module.scss'

type SkuItem = {
	skuId: number
	type: number
	unit: number
	price: number
	activityPrice: number
	salesNum: number | null
	stockNum: number | null
}

type ProductItem = {
	brand: string
	category: string
	maxReward: number
	productId: number
	productImgUrl: string
	productName: string
	salesNum: number
	stockNum: number
	saleTags?: string[]
	currentSku: SkuItem
	skuList: SkuItem[]
}

interface Iprops {
	data: ProductItem
	onClick?: (value: ProductItem) => void
	onAdd?: (value: ProductItem) => void
}

const ProductCard: React.FC<Iprops> = (props: Iprops) => {
  const { data, onClick, onAdd } = props
  const intl = getIntl()

  const renderPrice = () => {
    const [intPart, decimalPart] = formatPriceParts(data.currentSku?.activityPrice ?? data.currentSku?.price ?? 0)
    return (
      <View className={styles['card-info-footer-price']}>
        <Text className={styles['card-info-footer-price-red']}>
          {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
          <Text className={styles['card-info-footer-price-large']}>{intPart}</Text>
          <Text>.{decimalPart}</Text>
        </Text>
        {data.currentSku.activityPrice != null && (
          <Text className={styles['card-info-footer-price-original']}>
            {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
            {formatPriceParts(data.currentSku.price ?? 0).join('.')}
          </Text>
        )}
      </View>
    )
  }

  return (
    <View className={styles.card} onClick={() => onClick?.(data)}>
      <Image className={styles['card-image']} mode="aspectFill" src={data.productImgUrl} />
      <View className={styles['card-info']}>
        <View className={styles['card-info-name']}>{data.productName}</View>
        <View className={styles['card-info-footer']}>
          {renderPrice()}
        </View>
        <View className={styles['card-info-btm']}>
          <View className={styles['card-info-btm-left']}>
            <View className={styles['card-info-btm-left-btn1']}>
              {intl.formatMessage({ id: 'teamLeader.fanli', defaultMessage: '返利' })}
            </View>
            <View className={styles['card-info-btm-left-btn2']}>
              {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
              {formatPriceParts(data.maxReward ?? 0).join('.')}
            </View>
          </View>
          {data.skuList.length > 1 && (
            <View
              className={styles['card-info-footer-button']}
              onClick={e => {
                e.stopPropagation()
								onAdd?.(data)
              }}
            >
              <Icons name="Plus" size={16} color="#fff" />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default ProductCard
