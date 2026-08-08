import React, { useEffect } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { View, Text, Image, Icons } from '@apps/mobile-ui'
import { showToast } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import cs from 'classnames'
import { numFormat, priceFormat } from '@/utils/numberFormat'

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
  productId: number
  productName: string
  productImgUrl: string
  brand: string
  category: string
  salesNum: number
  stockNum: number
  saleTags?: string[]
  currentSku: SkuItem
  skuList: SkuItem[]
}

interface Iprops {
  data: ProductItem
  isPublish: boolean
  onClick?: (value: ProductItem) => void
  onAdd?: (value: ProductItem) => void
}

const ProductCard: React.FC<Iprops> = (props: Iprops) => {
  const { data, isPublish, onClick, onAdd } = props
  const intl = getIntl()

  const defaultUnit = intl.formatMessage({ id: 'communityGroupBuy.activity.product.unit', defaultMessage: '件' })
  const [unit, setUnit] = React.useState<string>(defaultUnit)
  useEffect(() => {
    setUnit(data.currentSku.unit || defaultUnit)
  }, [data.currentSku.unit])

  const renderPrice = () => {
    let priceArr = String(priceFormat(data.currentSku.activityPrice || data.currentSku.price || 0)).split('.')
    return (
      <View className={styles['card-info-footer-price']}>
        <Text className={styles['card-info-footer-price-red']}>
          ￥<Text className={styles['card-info-footer-price-large']}>{priceArr[0]}</Text>
          {priceArr[1] && <Text>.{priceArr[1]}</Text>}
        </Text>
        {data.currentSku.activityPrice > 0 && (
          <Text className={styles['card-info-footer-price-original']}>￥{priceFormat(data.currentSku.price)}</Text>
        )}
      </View>
    )
  }

  return (
    <View className={styles.card} onClick={() => onClick?.(data)}>
      <Image className={styles['card-image']} mode="aspectFill" src={data.productImgUrl} />
      <View className={styles['card-info']}>
        <View className={styles['card-info-name']}>{data.productName}</View>
        <View className={styles['card-info-tags']}>
          {data.saleTags?.map((item, index) => (
            <View key={index} className={styles['card-info-tags-item']}>
              {item}
            </View>
          ))}
        </View>
        <View className={styles['card-info-volume']}>
          <Text className={styles['card-info-volume-black']}>
            {intl.formatMessage({ id: 'communityGroupBuy.activity.product.yishou', defaultMessage: '已售' })}
            {numFormat(data.salesNum)}
            {unit}
          </Text>
          <Text>
            /{intl.formatMessage({ id: 'communityGroupBuy.activity.product.shengyu', defaultMessage: '剩余' })}
            {numFormat(data.stockNum)}
            {unit}
          </Text>
        </View>
        <View className={styles['card-info-footer']}>
          {renderPrice()}
          <View
            className={cs(
              styles['card-info-footer-button'],
              !isPublish || data.stockNum <= 0 ? styles['disabled'] : '',
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (!isPublish) {
                showToast({
                  title: intl.formatMessage({
                    id: 'communityGroupBuy.activity.product.shangpinyixiajia',
                    defaultMessage: '商品已下架',
                  }),
                })
                return
              } else if (data.stockNum <= 0) {
                showToast({
                  title: intl.formatMessage({
                    id: 'communityGroupBuy.activity.product.shangpinyishouqing',
                    defaultMessage: '商品已售罄',
                  }),
                })
                return
              }
              onAdd?.(data)
            }}
          >
            <Icons name="Plus" size={16} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProductCard
