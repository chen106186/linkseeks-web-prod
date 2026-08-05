import React, { useMemo } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import ImageBox from '@/components/ImageBox'
import { useIntl } from '@linkseeks/i18n'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'

import './index.scss'

interface GoodsItemProps {
  productName?: string
  // 图片
  img: any
  tags: string[]
  // 标签文本
  info?: string
  // 原价
  originalPrice?: string
  // 折扣价
  discountPrice?: string
  // 价格排列方向
  direction: 'row' | 'column'
  disable?: boolean
  layoutType: LAYOUT_TYPE
  [key: string]: any
}

const GoodsItem: React.FC<GoodsItemProps> = (props: GoodsItemProps) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()

  const {
    img,
    info,
    tags,
    originalPrice,
    discountPrice,
    productName,
    direction = 'column',
    childWitdh,
    num,
    disable,
    layoutType,
  } = props

  const _discountPrice = useMemo(() => {
    if (discountPrice && typeof discountPrice === 'string') {
      const _price = discountPrice.split('.')
      return (
        <Text className="marketingCard-goodsItem-container-price-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-goodsItem-container-price-discountPrice-in">{_price[0]}</Text>
          {`.${_price[1] || '00'}`}
        </Text>
      )
    } else if (discountPrice && typeof discountPrice === 'number') {
      return (
        <Text className="marketingCard-goodsItem-container-price-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-goodsItem-container-price-discountPrice-in">{discountPrice}</Text>
        </Text>
      )
    }
    return null
  }, [discountPrice])

  const _tab = () => {
    !disable && jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: props.productId })
  }

  return layoutType !== LAYOUT_TYPE.shop ? (
    <View className="marketingCard-goodsItem-container" style={{ width: pxTransform(childWitdh) }} onClick={_tab}>
      <View
        className="marketingCard-goodsItem-container-img"
        style={{ width: pxTransform(childWitdh), height: pxTransform(childWitdh) }}
      >
        <Image src={img} style={{ width: pxTransform(childWitdh), height: pxTransform(childWitdh) }} />
        {num ? (
          <Text
            style={{
              position: 'absolute',
              right: pxTransform(0),
              bottom: pxTransform(0),
              color: '#252D37',
              fontSize: pxTransform(12),
            }}
          >{`x${num}`}</Text>
        ) : null}
      </View>
      {info ? (
        <View className="marketingCard-goodsItem-container-tag">
          <Text className="marketingCard-goodsItem-container-tag-text">{info}</Text>
        </View>
      ) : null}
      <View className="marketingCard-goodsItem-container-price" style={{ flexDirection: direction }}>
        {_discountPrice}
        {originalPrice ? (
          <Text className="marketingCard-goodsItem-container-price-originalPrice">{`${intl.formatMessage({
            id: 'currency',
          })}${originalPrice}`}</Text>
        ) : null}
      </View>
    </View>
  ) : (
    <View className="marketingCard-goodsItem-container row" onClick={_tab}>
      <View className="marketingCard-goodsItem-container-img">
        <ImageBox source={img} width={92} height={92} />
        {num ? (
          <Text
            style={{ position: 'absolute', right: 0, bottom: 0, color: '#252D37', fontSize: pxTransform(12) }}
          >{`x${num}`}</Text>
        ) : null}
      </View>
      <View className="marketingCard-goodsItem-container-row">
        <View className="marketingCard-goodsItem-container-product-name">{productName}</View>
        {tags && tags.length > 0 ? (
          <View style={{ display: 'flex' }}>
            {tags.map((tagsItem) => (
              <View className="marketingCard-goodsItem-container-tag">
                <Text className="marketingCard-goodsItem-container-tag-text">{tagsItem}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View
          className="marketingCard-goodsItem-container-price"
          style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
        >
          {_discountPrice}
          {originalPrice ? (
            <Text className="marketingCard-goodsItem-container-price-originalPrice">{`${intl.formatMessage({
              id: 'currency',
            })}${originalPrice}`}</Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}

GoodsItem.defaultProps = {
  info: '',
  originalPrice: '',
  discountPrice: '',
}

export default GoodsItem
