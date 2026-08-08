/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 10:21:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-30 14:01:28
 * @Description: 营销活动信息
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import { CouponDataType } from '@/components/Coupon'
import Bookshelf from '../../../../components/Bookshelf'
import Coupons from '../Coupons'
import Campaigns from '../Campaigns'
import { PromotionItem } from '../MarketingPopup'
import './index.scss'

export type MarketingCampaignType = {
  /**
   * 优惠券数据
   */
  couponList: CouponDataType[]
  /**
   * 活动标签详情信息
   */
  tagDetailList: PromotionItem[]
}

interface IProps {
  /**
   * 数据
   */
  data: MarketingCampaignType
  /**
   * 自定义外部样式
   */
  wrapStyle?: React.CSSProperties
  /**
   * 点击触发事件
   */
  onClick?: () => void
}

const MarketingCampaign: React.FC<IProps> = (props: IProps) => {
  const {
    data: { couponList, tagDetailList },
    wrapStyle,
    onClick,
  } = props

  const intl = useIntl()

  const handlePress = () => {
    onClick?.()
  }

  const bookshelfItemLayout: React.CSSProperties = {
    position: 'relative',
    top: pxTransform(3),
  }

  return (
    <>
      <MellowCard
        style={wrapStyle}
        bodyStyle={{
          paddingTop: pxTransform(0),
          paddingBottom: pxTransform(0),
        }}
      >
        <Bookshelf
          labelWidth={64}
          customStyle={{
            paddingLeft: pxTransform(0),
            paddingRight: pxTransform(0),
          }}
        >
          <Bookshelf.Item
            label={intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.marketingCampaign.title',
              defaultMessage: '优惠',
            })}
            content={
              <>
                {couponList && couponList.length ? (
                  <Coupons dataSource={couponList.map((item) => ({ id: item.id, name: item.name }))} />
                ) : null}
                {couponList && couponList.length && tagDetailList && tagDetailList.length ? (
                  <View className="marketing-campaign-gap" />
                ) : null}
                <Campaigns
                  dataSource={tagDetailList.map((item) => ({
                    id: item.activityId,
                    name: item.preferentialTagDesc,
                    type: item.belongType,
                    typeName: item.preferentialTag,
                  }))}
                />
              </>
            }
            onPress={handlePress}
            labelStyle={bookshelfItemLayout}
            customStyle={{
              alignItems: 'flex-start',
            }}
            customLinkStyle={bookshelfItemLayout}
            isLink
          />
        </Bookshelf>
      </MellowCard>
    </>
  )
}

MarketingCampaign.defaultProps = {
  wrapStyle: {},
}

export default MarketingCampaign
