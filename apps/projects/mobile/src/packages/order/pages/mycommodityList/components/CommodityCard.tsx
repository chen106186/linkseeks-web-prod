/* eslint-disable no-nested-ternary */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import styles from './index.module.scss'
import cs from 'classnames'

interface Iprops {
  Item: any
  back?: React.ReactNode | string
  categoryIndex: number
}
const CommodityCard = (props: Iprops) => {
  const intl = useIntl()
  const { Item, back, categoryIndex } = props

  const Jump = () => {
    Router.navigateTo('order/mycommodityDetails', {
      categoryIndex,
      orderId: Item.orderId,
      showAfterSales: Item.showAfterSales,
      showCancel: Item.showCancel,
      noBtnClick: true,
    })
  }
  const first = (products: any) => (
    // eslint-disable-next-line no-nested-ternary
    <View>
      <View className={styles['OrderMian']}>
        <Image
          src={products.logo}
          style={{
            borderRadius: pxTransform(3),
            marginRight: pxTransform(10),
            width: pxTransform(80),
            height: pxTransform(80),
          }}
        />
        <View className={styles['Card']}>
          <View className={styles['CardText']}>{products.name}</View>
          <View className={styles['tag']}>{products.spec}</View>
          <View className={styles['Sku']}>
            <View className={styles['SkuText']}>
              {Item.orderMode === 10 || Item.orderMode === 11 ? null : (
                <Text
                  style={{
                    fontSize: pxTransform(10),
                    color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
                  }}
                >
                  {intl.formatMessage({ id: 'currency', defaultMessage: '￥' })}
                </Text>
              )}
              <Text
                style={{
                  fontSize: pxTransform(16),
                  color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
                }}
              >
                {products.refPrice.split('.')[0]}.
              </Text>
              <Text
                style={{
                  fontSize: pxTransform(10),
                  color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
                }}
              >
                {products.refPrice.split('.')[1]}
              </Text>
              <Text
                style={{
                  fontSize: pxTransform(10),
                  color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
                }}
              >{`/${
                Item.orderMode === 10 || Item.orderMode === 11
                  ? intl.formatMessage({ id: 'order.jifen', defaultMessage: '积分' })
                  : products.unit
              }`}</Text>
            </View>
            <Text className={styles['num']}>{`x${Item.quantities}`}</Text>
          </View>
        </View>
      </View>
    </View>
  )
  const MultipleLayouts = () => (
    <View className={styles['List']}>
      <ScrollView horizontal>
        {Item.products &&
          Item.products.map((item: any) => (
            <View key={item.id}>
              <View key={item.id} style={{ display: 'flex' }}>
                <Image
                  src={item?.logo}
                  style={{
                    borderRadius: pxTransform(3),
                    marginRight: pxTransform(10),
                    width: pxTransform(80),
                    height: pxTransform(80),
                  }}
                />
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  )
  return (
    <View className={styles['OrderItem']}>
      <View onClick={() => Jump()}>
        <View className={styles['OrderFlex']}>
          <View className={styles['logo']}>
            <Image
              src={Item.storeLogo || Item.logo}
              style={{
                borderRadius: pxTransform(3),
                marginRight: pxTransform(10),
                width: pxTransform(16),
                height: pxTransform(16),
              }}
            />
            <Text className={styles['label']}>{`${Item.pickupPointName ? Item.pickupPointName + ' x ' : ''}${
              Item.storeName || Item.shopName || Item.vendorMemberName
            }>`}</Text>
          </View>
          <View>
            <Text className={cs(styles['stauts'], Item.outerStatus === 13 && styles['oringe'])}>
              {Item.outerStatusName}
            </Text>
          </View>
        </View>
        {Item.products.length === 1 ? first(Item.products[0]) : MultipleLayouts()}
        <View className={styles['Totalprice']}>
          <Text
            style={{ fontSize: pxTransform(12), color: '#252D37', marginRight: pxTransform(5) }}
          >{`${intl.formatMessage({ id: 'order.gong', defaultMessage: '共' })}${
            Item.products.length
          }${intl.formatMessage({ id: 'order.jianshangpin', defaultMessage: '件商品' })}`}</Text>
          <Text style={{ fontSize: pxTransform(12), color: '#252D37' }}>
            {intl.formatMessage({ id: 'order.shifu', defaultMessage: '实付：' })}
          </Text>
          {Item.orderMode === 10 || Item.orderMode === 11 ? null : (
            <Text
              style={{
                fontSize: pxTransform(10),
                color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
              }}
            >
              {intl.formatMessage({ id: 'currency', defaultMessage: '¥' })}
            </Text>
          )}
          <Text
            style={{
              fontSize: pxTransform(16),
              color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
            }}
          >
            {Item.totalAmount.split('.')[0]}
          </Text>
          <Text
            style={{
              fontSize: pxTransform(10),
              color: Item.orderMode === 10 || Item.orderMode === 11 ? '#EB9B00' : '#EF3346',
            }}
          >{`.${Item.totalAmount.split('.')[1]}`}</Text>
          {Item.orderMode === 10 || Item.orderMode === 11 ? (
            <Text style={{ fontSize: pxTransform(10), color: '#EB9B00' }}>
              {intl.formatMessage({ id: 'order.jifen', defaultMessage: '积分' })}
            </Text>
          ) : null}
        </View>
      </View>
      {back}
    </View>
  )
}
CommodityCard.defaultProps = {
  // Item: {},
  back: null,
}
export default CommodityCard
