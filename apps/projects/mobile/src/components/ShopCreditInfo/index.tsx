import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Image, Text, Rate } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import './index.scss'

const creditIcon = getOssUrlPath('/miniprogram/assets/images/credit.png')

interface ShopCreditInfoPropsType {
  creditPoint: number
  registerYears: number
  hideYear?: boolean
  avgTradeCommentStar?: number
  showStar?: boolean
}

const ShopCreditInfo = (props: ShopCreditInfoPropsType) => {
  const { creditPoint, registerYears, hideYear, showStar, avgTradeCommentStar } = props
  const intl = useIntl()

  return (
    <View className="shop-detail">
      <View className="shop-detail-info">
        <Image src={creditIcon} className="shop-icon" />
        <View className="credit-bg">
          <Text className="tag-text">{creditPoint || 0}</Text>
        </View>
      </View>
      {!hideYear ? (
        <View className="shop-detail-info year-detail">
          <Text className="tag-text year-text">
            {intl.formatMessage({
              id: 'shopCreditInfo_register_year',
              defaultMessage: '入驻{{year}}年',
              year: registerYears || 0,
            })}
          </Text>
        </View>
      ) : null}
      {showStar && <Rate size={14} value={avgTradeCommentStar} margin={1} />}
    </View>
  )
}

ShopCreditInfo.defaultProps = {
  hideYear: false,
  showStar: false,
}

export default ShopCreditInfo
