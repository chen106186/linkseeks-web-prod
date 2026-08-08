/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-24 11:21:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-01 16:03:12
 * @Description: 优惠Popup
 */
import React, { useState, useEffect, useRef } from 'react'
import { showLoading, hideLoading, showToast, hideToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { ACTIVITY_FULLSWAP_NUMBER } from '@/constants/const/activity'
import { postMarketingMobileCouponReceive } from '@apps/apis'
import Popup from '@/components/Popup'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Coupon, { CouponDataType } from '@/components/Coupon'
import Tags from '@/components/ProductList/components/Tags'
import './index.scss'

let toastIns: any = null

export type PromotionItem = {
  /**
   * 活动id
   */
  activityId: number
  /**
   * 活动类型
   */
  activityType: number
  /**
   * 活动归属
   */
  belongType: number
  /**
   * 优惠标签
   */
  preferentialTag: string
  /**
   * 优惠标签描述
   */
  preferentialTagDesc: string
  /**
   * 是否可跳转商品列表0-否1-是
   */
  jumpToProductPage: number
  /**
   * 活动开始时间，下单那边需要
   */
  startTime: number
  /**
   * 活动结束时间，下单那边需要
   */
  endTime: number
}

interface IProps {
  /**
   * 数据
   */
  data: {
    /**
     * 优惠券数据
     */
    couponList: CouponDataType[]
    /**
     * 限时促销列表
     */
    tagDetailList: PromotionItem[]
  }
  /**
   * 是否显示
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 商城id
   */
  shopId: number
  /**
   * 当前商品skuId
   */
  skuId: number
}

const MarketingPopup: React.FC<IProps> = (props: IProps) => {
  const {
    data: { couponList = [], tagDetailList = [] },
    visible,
    onClose,
    shopId,
    skuId,
  } = props
  const [innerCouponList, setInnerCouponList] = useState<CouponDataType[]>([])

  const receiveLock = useRef(false)

  const { safeBottomHeight } = useSafeArea()
  const intl = useIntl()

  useEffect(() => {
    if (couponList && couponList.length) {
      setInnerCouponList(couponList)
    }
  }, [couponList])

  const handleClose = () => {
    onClose?.()
  }

  const handleJumpSalesCampaignList = (record: PromotionItem) => {
    if (!record.jumpToProductPage) {
      return
    }
    if (record.activityType === ACTIVITY_FULLSWAP_NUMBER) {
      Router.navigateTo('commodityMerge/stocksSourcing/changeProduct', {
        activityId: record.activityId,
        belongType: record.belongType,
        skuId,
      })
      return
    }
    Router.navigateTo('commodityMerge/stocksSourcing/salesCampaignList', {
      activityId: record.activityId,
      belongType: record.belongType,
      skuId,
    })
  }

  const handleClickCoupon = (couponData: CouponDataType) => {
    if (couponData.status === 0) {
      if (receiveLock.current) {
        return
      }
      receiveLock.current = true
      showLoading({
        title: intl.formatMessage({
          id: 'commodityMerge.stocksSourcing.components.marketingPopup.receiving',
          defaultMessage: '领取中...',
        }),
      })
      postMarketingMobileCouponReceive(
        {
          shopId,
          belongType: couponData.belongType,
          couponId: couponData.id,
        },
        { ctlType: 'none' },
      )
        .then((res) => {
          if (res.code === 1000) {
            const newData = [...innerCouponList]
            const index = newData.findIndex((item) => item.id === couponData.id)
            if (index !== -1) {
              newData.splice(index, 1, {
                ...newData[index],
                status: res.data.canReceive === 3 ? 1 : 0,
              })
            }
            setInnerCouponList(newData)
            hideLoading()
            showToast({
              title:
                res.data.canReceive === 1
                  ? res.message
                  : intl.formatMessage({
                      id: 'commodityMerge.stocksSourcing.components.marketingPopup.receiving.success',
                      defaultMessage: '领取成功',
                    }),
              icon: 'none',
            })
          } else {
            hideLoading()
            showToast({
              title: res.message,
              icon: 'error',
            })
          }
        })
        .finally(() => {
          receiveLock.current = false
        })
    } else {
      // 平台优惠券 跳转到 现货列表，否则 跳转到 可用商品列表
      if (couponData.belongType === 1) {
        Router.navigateTo('commodityMerge/stocksSourcing/index')
        return
      }
      Router.navigateTo('commodityMerge/stocksSourcing/conponSimilarList', {
        couponId: couponData.id,
        belongType: couponData.belongType,
      })
    }
  }

  return (
    <Popup
      visible={visible}
      title={intl.formatMessage({
        id: 'commodityMerge.stocksSourcing.components.marketingPopup.title',
        defaultMessage: '优惠',
      })}
      onClose={handleClose}
      zIndex={100}
    >
      <View className="marketing-popup-scrollView" style={{ maxHeight: `calc(100vh - 280px)` }}>
        <View className="marketing-popup-list">
          {tagDetailList && tagDetailList.length > 0 && (
            <View className="marketing-popup-list-item-promotion">
              <View className="marketing-popup-list-item-title">
                {intl.formatMessage({
                  id: 'commodityMerge.stocksSourcing.components.marketingPopup.activities',
                  defaultMessage: '限时促销',
                })}
              </View>
              <MellowCard bodyStyle={{ padding: 0 }}>
                <Cell>
                  {tagDetailList.map((dataItem) => (
                    <Cell.Item
                      key={dataItem.activityId}
                      title={dataItem.preferentialTagDesc}
                      customIcon={
                        <Tags
                          dataSource={[dataItem.preferentialTag]}
                          customStyle={{
                            marginTop: pxTransform(2),
                          }}
                          size="large"
                        />
                      }
                      customHeadStyle={{
                        paddingTop: pxTransform(themeLayout['padding-m'] - 2),
                        paddingBottom: pxTransform(themeLayout['padding-m'] - 2),
                      }}
                      onPress={() => handleJumpSalesCampaignList(dataItem)}
                      hasArrow={!!dataItem.jumpToProductPage}
                      clickable={!!dataItem.jumpToProductPage}
                    />
                  ))}
                </Cell>
              </MellowCard>
            </View>
          )}
          {innerCouponList && innerCouponList.length > 0 && (
            <View>
              <View className="marketing-popup-list-item-title">
                {intl.formatMessage({
                  id: 'commodityMerge.stocksSourcing.components.marketingPopup.coupons',
                  defaultMessage: '可领优惠券',
                })}
              </View>
              <Coupon.List dataSource={innerCouponList} onClick={handleClickCoupon} />
            </View>
          )}
        </View>
      </View>
      <View
        className="marketing-popup-action"
        style={{
          paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-xs']),
        }}
      >
        <Button type="primary" onClick={handleClose}>
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.marketingPopup.ok',
            defaultMessage: '完成',
          })}
        </Button>
      </View>
    </Popup>
  )
}

export default React.memo(MarketingPopup)
