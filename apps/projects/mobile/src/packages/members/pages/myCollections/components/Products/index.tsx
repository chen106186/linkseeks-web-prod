import React from 'react'
import { View, Image, Text, Toast } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import styles from './index.module.scss'

interface Iprops {
  name: string
  minPrice: number
  unitName: string
  sold: number
  mainPic: string
  /**
   * 1-现货价格,2-价格需要询价,3-积分兑换商品
   */
  priceType: 1 | 2 | 3
  /**
   * 商品id
   */
  id: number
  /**
   * 是否上架
   */
  isPublish: boolean
}

const Products = (props: Iprops) => {
  const { name, minPrice, unitName, sold, mainPic, priceType, id, isPublish } = props
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const handleJump = () => {
    if (!isPublish) {
      Toast.show({
        title: intl.formatMessage({ id: 'card.myCollections.goods.unPublished', defaultMessage: '商品已下架' }),
      })
      return
    }
    jmpProductDetail(priceType, { commodityId: id })
  }

  const tagText = [
    '',
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_1', defaultMessage: '现货价格' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_2', defaultMessage: '询价价格' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_3', defaultMessage: '积分兑换' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_4', defaultMessage: '赠品' }),
  ]

  return (
    <MellowCard style={{ width: `calc(100vw - 40px)` }}>
      <View className={styles['product-container']} onClick={handleJump}>
        <View className={styles['image-container']}>
          <Image src={mainPic} className={styles['img']} />
          {(!isPublish && (
            <View className={styles['flag']}>
              <Text className={styles['flag-text']}>
                {intl.formatMessage({ id: 'card.myCollections.status.unPublished', defaultMessage: '已下架' })}
              </Text>
            </View>
          )) ||
            null}
        </View>
        <View className={styles['infos']}>
          <Text className={styles['product-name']}>{name}</Text>
          <View className={styles['footer']}>
            <Text className={styles['deal']}>
              {sold}
              {intl.formatMessage({ id: 'card.myCollections.goods.sold', defaultMessage: '成交' })}
            </Text>
            {priceType === 1 ? (
              <View className={styles['box']}>
                <Text className={styles['price']}>{`${intl.formatMessage({
                  id: 'currency',
                  defaultMessage: '￥',
                })}${minPrice}`}</Text>
                <Text className={styles['unit']}>{`/${unitName}`}</Text>
              </View>
            ) : (
              <View className={styles['tag']}>{tagText[priceType]}</View>
            )}
          </View>
        </View>
      </View>
    </MellowCard>
  )
}

export default Products
