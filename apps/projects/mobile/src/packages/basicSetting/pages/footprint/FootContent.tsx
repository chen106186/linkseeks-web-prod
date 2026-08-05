import React from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import styles from './index.module.scss'

/**
 * 商户下 商品下 对应选购的规格列表
 */

interface Iprops {
  mainPic: string
  commodityName: string
  sold: string
  unitName: string
  minPrice: string
  id: number
  isPublish: boolean
  priceType: number
}

const FootContent: React.FC<Iprops> = (props: Iprops) => {
  const {
    mainPic = '',
    commodityName = '',
    sold = '',
    unitName = '',
    minPrice = '0',
    id = 0,
    isPublish = true,
    priceType,
  } = props
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()

  /**
   *  价格区间
   */
  const fnGetPriceSection = (str: string, key: number) => {
    if (!str) {
      return 0
    }
    const arrStr = `${str}`.split('.')
    if (key === 1 && !arrStr[key]) {
      return `00`
    }
    return arrStr[key]
  }

  const fnJumpUrl = () => {
    if (isPublish) {
      jmpProductDetail(priceType, { commodityId: id })
    }
  }

  const tagText = [
    '',
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_1', defaultMessage: '现货价格' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_2', defaultMessage: '询价价格' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_3', defaultMessage: '积分兑换' }),
    intl.formatMessage({ id: 'card.myCollections.goods.priceType_4', defaultMessage: '赠品' }),
  ]

  return (
    <View className={styles['footproint-page']} onClick={fnJumpUrl}>
      <View className={styles['footproint-page-contentImg']}>
        <Image className={styles['footproint-page-contentImg-box']} src={mainPic} />
        {!isPublish && (
          <View className={styles['footproint-page-isPublish']}>
            <Text className={styles['footproint-page-isPublishTips']}>
              {intl.formatMessage({ id: 'card.myCollections.status.unPublished' })}
            </Text>
          </View>
        )}
      </View>
      <View className={styles['footproint-page-content']}>
        <Text className={styles['footproint-page-contentTitle']}>{commodityName || '-'}</Text>
        <Text className={styles['footproint-page-frequency']}>{`${sold || '0'}${intl.formatMessage({
          id: 'address.footprint.sold',
          defaultMessage: '成交',
        })}`}</Text>
        {priceType === 1 ? (
          <View className={styles['footproint-page-moneyWarp']}>
            <Text className={styles['footproint-page-moneyMin']}>{intl.formatMessage({ id: 'currency' })}</Text>
            <Text className={styles['footproint-page-money']}>{fnGetPriceSection(minPrice, 0)}</Text>
            <Text className={styles['footproint-page-moneyMin']}>{`.${fnGetPriceSection(minPrice, 1)}`}</Text>
            <Text className={styles['footproint-page-Min']}>{` / ${
              unitName || intl.formatMessage({ id: 'address.footprint.unit.piece', defaultMessage: '件' })
            }`}</Text>
          </View>
        ) : (
          <View className={styles['tag']}>{tagText[priceType]}</View>
        )}
      </View>
    </View>
  )
}

export default observer(FootContent)
