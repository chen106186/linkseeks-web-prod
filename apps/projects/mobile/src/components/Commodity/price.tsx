import React, { useMemo } from 'react'
import { numFormat, priceFormat1 } from '@/utils/numberFormat'
import { useIntl } from '@linkseeks/i18n'
import { View, Text } from '@apps/mobile-ui'
import './price.scss'

interface Iprops {
  /** 原价 */
  originalPrice?: number
  /** 折扣价 */
  discount: number
  /** 方向, 竖向更横向 */
  direction?: 'vertical' | 'horizontal'
  priceType?: number
  max?: number
  min?: number
  /** 活动标签 */
  saleTags?: string[]
  /** 活动类型列表 */
  activityTypeList?: number[]
  /** 价格 */
  price?: number
  /** 单位 */
  unit?: string
}

const Price: React.FC<Iprops> = (props: Iprops) => {
  const {
    originalPrice,
    discount,
    direction = 'horizontal',
    priceType = 1,
    max,
    min,
    saleTags,
    activityTypeList,
    price,
    unit,
  } = props

  // console.log('Price props', props)
  const intl = useIntl()

  const verticalStyle = useMemo(() => {
    if (direction === 'vertical') {
      return {
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
    return {}
  }, [direction])

  const renderPriceByType = () => {
    // console.log('priceType', priceType)
    switch (priceType) {
      case 1: {
        const isFullMoneyReduce =
          Array.isArray(saleTags) && saleTags.some((tag) => typeof tag === 'string' && tag.includes('满额减'))

        let minPrice = min || discount

        // 满额减：列表页不直接展示减后的活动价，保持和详情页一致用原价区间
        if (!isFullMoneyReduce && price && max && price < max) {
          minPrice = price
        }

        if (activityTypeList && Array.isArray(activityTypeList) && activityTypeList.includes(7)) {
          minPrice = min || discount
        }

        const minPriceFormatted = priceFormat1(minPrice || 0)
        const [minInteger, minDecimal] = minPriceFormatted.split('.')

        return (
          <View className="discount">
            <Text className="currency">{intl.formatMessage({ id: 'currency' })}</Text>
            <Text className="big">{minInteger}</Text>
            <Text className="small">.{(minDecimal || '00').substring(0, 2)}</Text>
            {unit && <Text className="unit">/{unit}</Text>}
          </View>
        )
      }
      case 2:
        return (
          <View className="discount">
            <View className="inquiry">
              {intl.formatMessage({ id: 'integral.zaixianxunjia', defaultMessage: '在线询价' })}
            </View>
          </View>
        )
      case 3:
        return (
          <View className="discount">
            <Text className="integral">{numFormat(min || 0)}</Text>
            {min !== max && (
              <>
                <Text className="integral">-</Text>
                <Text className="integral">{numFormat(max || 0)}</Text>
              </>
            )}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <View className="price" style={verticalStyle}>
      {/* <View className='discount'>
        <Text className='currency'>{intl.formatMessage({id: 'currency'})}</Text>
        <Text className='big'>{discountFormated[0]}</Text>
        <Text className='small'>.{((discountFormated[1] as string).substring(0,2))}</Text>
      </View> */}
      {renderPriceByType()}
      {(originalPrice !== discount && discount && (
        <Text className="originalPrice">
          {originalPrice && `${intl.formatMessage({ id: 'currency' })}${originalPrice}`}
        </Text>
      )) ||
        null}
    </View>
  )
}

export default Price
