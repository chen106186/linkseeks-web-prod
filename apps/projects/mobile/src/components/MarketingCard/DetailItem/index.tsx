import React, { useMemo, CSSProperties } from 'react'
import { Image, View, Text } from '@apps/mobile-ui'
import { LAYOUT_TYPE } from '@/constants/const/shop'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { getSystemInfoSync, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'

import useCountDown from '../hooks/useCountDown'

import './index.scss'

interface DetailItemDetailProps {
  img: any
  title: string
  // 折扣价
  discountPrice?: string
  // 原价
  originalPrice?: string | number
  // 结束时间
  endTime?: number
  // 剩余人数
  people?: number
  // 已购数量
  buy?: number
  layoutType?: LAYOUT_TYPE
  [key: string]: any
}

export interface DetailItemProps {
  // 商品详情
  detail: DetailItemDetailProps
  // 展示类型
  detailType: 'collage' | 'package' | 'give'
  // 容器样式
  containStyle?: CSSProperties
  // 图片tag
  tag?: string
  // 图片tag样式
  tagStyle?: CSSProperties
  tagColor?: any
  // left tag
  leftTag?: string
  // needBtn
  needBtn?: boolean
  customImageWidth?: number
  [key: string]: any
}

const DetailItem: React.FC<DetailItemProps> = (props: DetailItemProps) => {
  const intl = useIntl()
  const { jmpProductDetail } = useProductDetailJump()
  const {
    detail,
    detailType = 'collage',
    customImageWidth,
    layoutType,
    containStyle = {},
    tag,
    tagStyle,
    tagColor,
    leftTag,
    needBtn,
  } = props
  const windowWidth = getSystemInfoSync().windowWidth
  const imageWidth = windowWidth / 3.6
  const [hour, minute] = useCountDown(detail?.endTime || new Date().getTime() / 1000)
  const _discountPrice = useMemo(() => {
    if (typeof detail?.discountPrice === 'number' && detail?.discountPrice === 0) {
      return (
        <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice-inner">0</Text>
          .00
        </Text>
      )
    } else if (typeof detail?.discountPrice === 'string') {
      const _text = detail?.discountPrice?.split('.')
      if (_text && _text.length > 0) {
        return (
          <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice">
            {intl.formatMessage({ id: 'currency' })}
            <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice-inner">{_text?.[0]}</Text>
            {`.${_text?.[1] || '00'}`}
          </Text>
        )
      }
    } else if (typeof detail?.discountPrice === 'number') {
      return (
        <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice">
          {intl.formatMessage({ id: 'currency' })}
          <Text className="marketingCard-detailItem-container-detail-moneyBox-discountPrice-inner">
            {detail?.discountPrice}
          </Text>
        </Text>
      )
    }

    return null
  }, [detail?.discountPrice])

  const _infoLeft = useMemo(() => {
    if (detailType === 'collage' && detail?.label) {
      return (
        <View className="marketingCard-detailItem-container-detail-info-left-count-tag">
          <Text>{detail?.label}</Text>
        </View>
      )
    }
    if (detailType === 'package') {
      return (
        <Text className="marketingCard-detailItem-container-detail-info-left">
          {intl.formatMessage({ id: 'components.marketingCard.detailItem.package.infoLeft' })}
          <Text className="marketingCard-detailItem-container-detail-info-left-inner">{detail?.buy}</Text>
          {intl.formatMessage({ id: 'components.marketingCard.detailItem.package.infoLeftInner' })}
        </Text>
      )
    }
    if (detailType === 'give') {
      return (
        <View className="marketingCard-detailItem-container-detail-info-giveTag">
          <Text className="marketingCard-detailItem-container-detail-info-giveTag-text">{leftTag}</Text>
        </View>
      )
    }
    return null
  }, [detail, detailType, hour, minute, leftTag])

  const _tab = () => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: detail.productId })
  }

  const _returnLinearGradient = (colors: string[]) => {
    return {
      backgroundImage: `linear-gradient(to right,${colors[0]} , ${colors[1]})`,
    }
  }

  return (
    <View
      className="marketingCard-detailItem-container"
      style={{
        ..._returnLinearGradient(
          detailType === 'collage' && layoutType !== LAYOUT_TYPE.shop
            ? ['rgba(253,88,0,0.24)', 'rgba(255,255,255,0.00)']
            : ['#fff', '#fff'],
        ),
        ...containStyle,
      }}
    >
      <View style={{ position: 'relative' }}>
        {tag ? (
          <View
            className="marketingCard-detailItem-container-tag"
            style={{ ..._returnLinearGradient(tagColor || ['#E0B26C', '#F6CF85']), ...tagStyle }}
          >
            <Text className="marketingCard-detailItem-container-tag-text">{tag}</Text>
          </View>
        ) : null}
        <Image
          className="marketingCard-detailItem-container-image"
          src={detail?.img}
          style={{
            width: pxTransform(customImageWidth || imageWidth),
            height: pxTransform(customImageWidth || imageWidth),
          }}
        />
      </View>
      <View className="marketingCard-detailItem-container-detail" style={{ height: pxTransform(imageWidth) }}>
        <Text className="marketingCard-detailItem-container-detail-title">{detail?.title || detail?.productName}</Text>
        <View className="marketingCard-detailItem-container-detail-info">{_infoLeft}</View>
        <View className="marketingCard-detailItem-container-detail-moneyBox">
          {_discountPrice}
          {detail?.originalPrice && (
            <Text className="marketingCard-detailItem-container-detail-moneyBox-originalPrice">
              {detail?.originalPrice}
            </Text>
          )}
          {needBtn && (
            <View
              onClick={_tab}
              className="marketingCard-detailItem-container-detail-moneyBox-needBtn"
              style={_returnLinearGradient(['#F87362', '#EF3346'])}
            >
              <Text className="marketingCard-detailItem-container-detail-moneyBox-needBtn-text">
                {intl.formatMessage({ id: 'components.marketingCard.detailItem.button' })}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

DetailItem.defaultProps = {
  containStyle: {},
  tag: '',
  tagStyle: {},
}

export default DetailItem
