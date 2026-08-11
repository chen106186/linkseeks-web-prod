/**
 * @Description 套装列表组件
 */
import React, { useState, useEffect } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Icons } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import Shuttle from '@/components/Shuttle'
import ImageBox from '@/components/ImageBox'
import {
  postMarketingMobileActivityGoodsSetmealImgList,
  PostMarketingMobileActivityGoodsSetmealImgListResponse,
} from '@apps/apis'
import './index.scss'

interface DiscountPackageProps {
  /**
   * 活动id
   */
  activityId: number
  /**
   * belongType
   */
  belongType: number
  /**
   * 商品skuId
   */
  skuId: number
  /**
   * 自定义外部样式
   */
  wrapStyle?: React.CSSProperties
  /**
   * 点击跳转触发
   */
  onJump: () => void
}

const DiscountPackage: React.FC<DiscountPackageProps> = (props: DiscountPackageProps) => {
  const { activityId, belongType, skuId, wrapStyle, onJump } = props
  const [packages, setPackages] = useState<PostMarketingMobileActivityGoodsSetmealImgListResponse>([])

  const {
    userStore: { shopAndSite },
  } = useStores()

  const intl = useIntl()

  /**
   * 获取套装信息
   */
  const fetchPackagesList = () => {
    if (!shopAndSite || !shopAndSite.id || !activityId || !belongType || !skuId) {
      return
    }
    postMarketingMobileActivityGoodsSetmealImgList({
      shopId: shopAndSite.id,
      activityId,
      belongType,
      skuId,
    }).then((res) => {
      if (res.code === 1000 && res.data) {
        setPackages(res.data)
      }
    })
  }

  useEffect(() => {
    fetchPackagesList()
  }, [shopAndSite, activityId, belongType, skuId])

  return (
    <View onClick={onJump}>
      <MellowCard
        title={intl.formatMessage({
          id: 'commodityMerge.stocksSourcing.components.discountPackage.title',
          defaultMessage: '优惠套餐',
        })}
        extra={
          <Shuttle
            describe={intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.discountPackage.count',
              count: packages.length,
            })}
            onJump={onJump}
          />
        }
        headStyle={{
          borderBottomWidth: pxTransform(0),
        }}
        bodyStyle={{
          paddingTop: pxTransform(0),
        }}
        style={wrapStyle}
      >
        <ScrollView scrollX enhanced showScrollbar>
          <View className="package">
            {packages.map((item, index) => (
              <View key={item.groupNo} className="package-item">
                <View className="package-item-products">
                  {item.goodsList.map((good, goodIndex) => (
                    <View key={goodIndex} className="package-item-products-wrap">
                      <View className="package-item-products-imgWrap">
                        <ImageBox
                          width="100%"
                          height="100%"
                          source={good.productImgUrl as string}
                          className="package-item-products-img"
                        />
                      </View>
                      {goodIndex !== item.goodsList.length - 1 ? (
                        <View className="package-item-products-chain">
                          <Icons name="Plus" size={12} color="#8F7564" />
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
                <View className="package-item-desc">
                  <View className="package-item-quantity">
                    {intl.formatMessage({
                      id: 'commodityMerge.stocksSourcing.components.discountPackage.count',
                      count: item.totalNum,
                    })}
                  </View>
                  <View className="package-item-amount">
                    {`${intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}${item.totalAmount} `}
                  </View>
                </View>
                {index !== packages.length - 1 ? <View className="package-item-line" /> : null}
              </View>
            ))}
          </View>
        </ScrollView>
      </MellowCard>
    </View>
  )
}

export default DiscountPackage
