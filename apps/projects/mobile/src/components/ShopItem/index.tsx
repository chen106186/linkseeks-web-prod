import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import Router from '@/utils/router'
import ImageBox from '@/components/ImageBox'
import ShopCreditInfo from '@/components/ShopCreditInfo'
import { priceFormat } from '@/utils/numberFormat'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { useIntl } from '@linkseeks/i18n'
import { getShopItemJumpMode, SHOP_ITEM_JUMP_MODE } from './jump'
import './index.scss'

export interface ShopItemProps {
  productIds: number[]
  productList: any
  id: number
  creditPoint: number
  logo: string
  memberName: string
  name: string
  registerYears: number
  contextShopId?: number
  contextProvinceCode?: string
  contextCityCode?: string
}

const ShopItem: React.FC<ShopItemProps> = (props) => {
  const {
    id,
    logo,
    name,
    creditPoint,
    memberName,
    registerYears,
    productList,
    contextShopId,
    contextProvinceCode,
    contextCityCode,
  } = props
  const intl = useIntl()
  const { jmpProductDetail, jmpProductDetailGroup, jmpSpotDetailByCommodity } = useProductDetailJump()

  const renderPriceByType = (priceType: number, price: any) => {
    switch (priceType) {
      case 2:
        return (
          <View className="product-list-item-extra-left">
            <View className="ask-commodity-price">
              <Text className="ask-commodity-price-text">
                {intl.formatMessage({ id: 'shopItem_price_inquiry', defaultMessage: '在线询价' })}
              </Text>
            </View>
          </View>
        )
      case 3:
        return (
          <View className="goods-price-wrap">
            <Text className="goods-price">{`${price} ${intl.formatMessage({
              id: 'integral.jifen1',
              defaultMessage: '积分',
            })}`}</Text>
          </View>
        )
      default:
        return (
          <View className="goods-price-wrap">
            <Text className="goods-price-unit">{intl.formatMessage({ id: 'currency' })}</Text>
            <Text className="goods-price">{priceFormat(price)}</Text>
          </View>
        )
    }
  }

  /**
   * 店铺卡片内的商品数据经常只有基础字段，现货商品点击时统一走补偿查询，避免拼团状态误判。
   * @author guanxiaomign
   */
  const handleClickCommodity = (productItem: any) => {
    const jumpMode = getShopItemJumpMode(productItem)

    if (jumpMode === SHOP_ITEM_JUMP_MODE.SPOT_BY_COMMODITY) {
      void jmpSpotDetailByCommodity({
        commodityId: productItem.id,
        shopId: contextShopId,
        provinceCode: contextProvinceCode,
        cityCode: contextCityCode,
      })
      return
    }

    if (jumpMode === SHOP_ITEM_JUMP_MODE.GROUP_DETAIL) {
      jmpProductDetailGroup({ commodityId: productItem.id })
      return
    }

    jmpProductDetail(productItem.priceType || PRICE_TYPE_ENUM.SPOT, { commodityId: productItem.id })
  }

  return (
    <View
      key={id}
      className="shop-item"
      onClick={() => {
        Router.navigateTo('shop/home', { id })
      }}
    >
      <View className="shop-header">
        <View className="shop-logo">
          <ImageBox width={40} height={40} source={logo} />
        </View>
        <View className="shop-info">
          <View className="shop-name-wrapper">
            <Text className="shop-name">{name || memberName}</Text>
          </View>
          <ShopCreditInfo creditPoint={creditPoint || 0} registerYears={registerYears || 0} />
        </View>
        <View className="enter-shop-btn">
          <Text className="enter-shop-btn-text">
            {intl.formatMessage({ id: 'shopItem_enterBtn', defaultMessage: '进店' })}
          </Text>
        </View>
      </View>
      {productList && productList.length > 0 && (
        <View className="goods-list">
          {productList.map(
            (productItem: any, productItemIndex: number) =>
              productItemIndex < 3 && (
                <View
                  className="goods-item"
                  key={productItem.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClickCommodity(productItem)
                  }}
                >
                  <ImageBox width={106} height={106} source={productItem.mainPic || ''} />
                  <Text className="goods-name">{productItem.name}</Text>
                  {renderPriceByType(productItem.priceType || 1, productItem.price || productItem.min)}
                </View>
              ),
          )}
        </View>
      )}
    </View>
  )
}

export default ShopItem
