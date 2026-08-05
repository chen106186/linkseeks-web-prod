/*
 * @Description: 优惠套餐 Popup
 */
import React, { useState, useEffect } from 'react'
import { showToast, hideToast, pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Button, Icons } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import useStores from '@/store/useStores'
import { useSafeArea } from '@apps/mobile-services'
import { useIntl } from '@linkseeks/i18n'
import useCartType from '@/hooks/useCartType'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { themeLayout } from '@/constants/theme'
import Popup from '@/components/Popup'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import Label from '@/components/Label'
import Loading from '@/components/Loading'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import {
  postMarketingMobileActivityGoodsSetmealList,
  PostMarketingMobileActivityGoodsSetmealListResponse,
} from '@apps/apis'
import { postProductMobileShopPurchaseSavePurchaseBatch } from '@apps/apis'
import './index.scss'

interface IProps {
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
   * 是否显示
   */
  visible: boolean
  /**
   * 关闭触发事件
   */
  onClose: () => void
}

const DiscountPackagePopup: React.FC<IProps> = (props: IProps) => {
  const { activityId, belongType, skuId, visible, onClose } = props
  const [packages, setPackages] = useState<PostMarketingMobileActivityGoodsSetmealListResponse>([])
  const [loading, setLoading] = useState(false)
  const [loadingKey, setLoadingKey] = useState(0)

  const { safeBottomHeight } = useSafeArea()
  const { jmpProductDetail } = useProductDetailJump()
  const {
    userStore: { shopAndSite },
  } = useStores()

  const intl = useIntl()

  const { cartAddName } = useCartType()

  /**
   * 获取套装信息
   */
  const fetchPackagesList = () => {
    if (!shopAndSite || !shopAndSite.id || !activityId || !belongType || !skuId) {
      return
    }
    setLoading(true)
    postMarketingMobileActivityGoodsSetmealList({
      shopId: shopAndSite.id,
      activityId,
      belongType,
      skuId,
    })
      .then((res) => {
        if (res.code === 1000 && res.data) {
          setPackages(res.data)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (visible) {
      fetchPackagesList()
    }
  }, [shopAndSite, activityId, belongType, skuId, visible])

  const handleClose = () => {
    onClose?.()
  }

  /**
   * 跳转现货商品详情
   * @param goodSkuId skuId
   */
  const handleJump = (good: PostMarketingMobileActivityGoodsSetmealListResponse[0]['goodsList'][0]) => {
    jmpProductDetail(PRICE_TYPE_ENUM.SPOT, { commodityId: good.productId!, skuId: good.skuId })
  }

  const handleAddtoCart = (record: PostMarketingMobileActivityGoodsSetmealListResponse[0]) => {
    setLoadingKey(record.groupNo)
    const purchaseBatchList = record.goodsList.map((item, index) => ({
      id: 0,
      commoditySkuId: item.skuId,
      setMealId: record.groupNo,
      setMealName: '',
      count: item.num,
      isMain: index === 0, // index = 0 为主商品
      purchaseCommodityType: 2, // 套餐商品
      parentSkuId: index === 0 ? undefined : record.goodsList[0].skuId,
    }))
    postProductMobileShopPurchaseSavePurchaseBatch({
      purchaseBatchList,
    })
      .then((res) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.success',
              defaultMessage: '添加成功',
            }),
            icon: 'none',
          })
        }
        if (res.code !== 1000 && res.message) {
          showToast({ title: res.message, icon: 'none' })
        }
      })
      .finally(() => {
        setLoadingKey(0)
      })
  }

  return (
    <Popup
      visible={visible}
      onClose={handleClose}
      customClassName="popup"
      title={intl.formatMessage({
        id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.title',
        defaultMessage: '优惠套餐',
      })}
    >
      <ScrollView className="package-popup-list" style={{ height: `calc(100vh - 280px)` }} scrollY>
        {packages.map((item) => (
          <MellowCard
            key={item.groupNo}
            title={`${intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.title',
              defaultMessage: '优惠套餐',
            })} ${item.groupNo}`}
            bodyStyle={{ paddingTop: pxTransform(0), paddingBottom: pxTransform(0) }}
            headStyle={{
              borderBottomWidth: pxTransform(0),
            }}
            className="package-popup-list-item"
          >
            <ScrollView scrollX>
              <View className="package-popup-list-item-products">
                {item.goodsList.map((good, goodIndex) => (
                  <View
                    key={goodIndex}
                    onClick={() => goodIndex !== 0 && handleJump(good)}
                    className="package-popup-list-item-products-item"
                  >
                    <View className="package-popup-list-item-products-item-imgWrap">
                      <ImageBox
                        width="100%"
                        height="100%"
                        source={good.productImgUrl as string}
                        className="package-popup-list-item-products-item-img"
                      />
                      {goodIndex === 0 ? (
                        <Text className="package-popup-list-item-products-item-current">
                          {intl.formatMessage({
                            id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.current',
                            defaultMessage: '当前商品',
                          })}
                        </Text>
                      ) : (
                        <Text className="package-popup-list-item-products-item-quantity">x{good.num}</Text>
                      )}
                    </View>
                    <View className="package-popup-list-item-products-item-name">{good.productName}</View>
                    {good.type ? (
                      <View className="package-popup-list-item-products-item-checkedWrap">
                        <View className="package-popup-list-item-products-item-checked">{good.type}</View>
                        {goodIndex !== 0 ? (
                          <View className="list-item-products-item-arrow">
                            <Icons name="ChevronDown" color="#91959B" size={12} />
                          </View>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </ScrollView>
            <View className="package-popup-list-item-foot">
              <View className="package-popup-list-item-foot-left">
                <View className="package-popup-list-item-total">
                  <Text className="package-popup-list-item-total-text">
                    {intl.formatMessage({
                      id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.quantity',
                      quantity: item.totalNum,
                    })}
                  </Text>
                </View>
                <View className="package-popup-list-item-foot-left-wrap">
                  <Text className="package-popup-list-item-quantity">
                    {`${intl.formatMessage({
                      id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.price',
                      defaultMessage: '套餐价',
                    })}:`}
                  </Text>
                  <Text className="package-popup-list-item-amount">
                    {`${intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}${item.totalAmount}`}
                  </Text>
                  <Label
                    name={intl.formatMessage({
                      id: 'commodityMerge.stocksSourcing.components.discountPackagePopup.save',
                      currency: intl.formatMessage({ id: 'currency' }),
                      amount: item.discountAmount,
                    })}
                    type="primary"
                  />
                </View>
              </View>
              <View className="package-popup-list-item-foot-right">
                <Button
                  type="primary"
                  size="small"
                  loading={item.groupNo === loadingKey}
                  onClick={() => handleAddtoCart(item)}
                >
                  {cartAddName}
                </Button>
              </View>
            </View>
          </MellowCard>
        ))}
        <Loading loading={loading} />
        <View
          style={{ paddingBottom: safeBottomHeight ? `${safeBottomHeight}PX` : pxTransform(themeLayout['padding-l']) }}
        />
      </ScrollView>
    </Popup>
  )
}

export default DiscountPackagePopup
