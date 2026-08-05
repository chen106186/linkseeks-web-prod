import React, { CSSProperties } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image } from '@apps/mobile-ui'
import { ScrollView } from '@tarojs/components'
import Router from '@/utils/router'
import PriceWrap from '@/components/PriceWrap'
import { ORDER_TYPE_VALUE_MAP } from '@/constants/const/order'
import styles from './index.module.scss'

export type btnType = {
  name: string
  onClick: Function
  style?: React.CSSProperties
}

export type OrderItemCardType = {
  itemData: any
  hideHeader?: boolean
  hideFooter?: boolean
  customStyle?: CSSProperties
  btnConfig?: btnType[]
  onClick?: () => void
  showEditPrice?: boolean
  showMoreProducts?: boolean
  showInnerStatus?: boolean
}

const OrderItemCard = (props: OrderItemCardType) => {
  const intl = useIntl()
  const {
    itemData,
    hideHeader,
    hideFooter,
    customStyle,
    btnConfig,
    onClick,
    showEditPrice,
    showMoreProducts,
    showInnerStatus,
  } = props

  const ORDER_VALUE_TYPE = {
    [ORDER_TYPE_VALUE_MAP.STORE_PURCHASE]: intl.formatMessage({
      id: 'order.storePurchase',
      defaultMessage: '现货采购',
    }),
    [ORDER_TYPE_VALUE_MAP.INQUIRY_PURCHASE]: intl.formatMessage({
      id: 'order.inquiryPurchase',
      defaultMessage: '询价采购',
    }),
    [ORDER_TYPE_VALUE_MAP.CHANNEL_PURCHASE]: intl.formatMessage({
      id: 'order.channelPurchase',
      defaultMessage: '渠道直采',
    }),
    [ORDER_TYPE_VALUE_MAP.CHANNEL_STORE]: intl.formatMessage({
      id: 'order.channelStore',
      defaultMessage: '渠道现货',
    }),
  }

  return (
    <View className={styles['order-item-card']} onClick={() => onClick?.()} style={customStyle}>
      {!hideHeader && (
        <View className={styles['card-header']}>
          <Text>
            {intl.formatMessage({ id: 'order.orderNumber', defaultMessage: '订单号' })}：{itemData.orderNo}
          </Text>
          <Text>{showInnerStatus ? itemData.innerStatusName : itemData.outerStatusName}</Text>
        </View>
      )}
      <View className={styles['card-body']}>
        {showMoreProducts && itemData.products?.length > 1 ? (
          <ScrollView scrollX>
            <View className={styles['image-box']}>
              {itemData.products.map((item) => (
                <View key={item.skuId} className={styles['image-box-item']}>
                  <Image src={item.logo} className={styles['image']} />
                </View>
              ))}
            </View>
          </ScrollView>
        ) : itemData.products?.[0] ? (
          <>
            <Image src={itemData.products[0].logo} className={styles['image']} />
            <View className={styles['card-body-info']}>
              <View className={styles['info-title']}>{itemData.products[0].name}</View>
              <View className={styles['info-specs']}>{itemData.products[0].spec}</View>
              {
                // 配置了展示修改单价且数据显示可修改
                showEditPrice && itemData.products[0].showModifyPrice ? (
                  <View className={styles['info-price-wrap']}>
                    <View className={styles['price-number']}>
                      <PriceWrap money={itemData.products[0].refPrice} unit={itemData.products[0].unit} />
                      <View>x{itemData.products[0].quantity}</View>
                    </View>
                    <View
                      className={styles['edit-price-btn']}
                      onClick={() => {
                        Router.navigateTo('root/orderExamine/orderEditPrice', {
                          orderId: itemData.orderId,
                          orderProductId: itemData.products[0].orderProductId,
                        })
                      }}
                    >
                      {intl.formatMessage({ id: 'order.editPrice', defaultMessage: '修改单价' })}
                    </View>
                  </View>
                ) : (
                  <View className={styles['info-price-wrap']}>
                    <PriceWrap
                      money={itemData.products[0].refPrice}
                      unit={intl.formatMessage({ id: 'order.piece', defaultMessage: '件' })}
                    />
                    <View>x{itemData.products[0].quantity}</View>
                  </View>
                )
              }
            </View>
          </>
        ) : null}
      </View>
      {!hideFooter && (
        <View className={styles['card-footer']}>
          <Text className={styles['order-type']}>{ORDER_VALUE_TYPE[itemData.orderType]}</Text>
          <PriceWrap
            money={itemData.totalAmount}
            addonBefore={`${intl.formatMessage({ id: 'order.total', defaultMessage: '共' })}${
              itemData.quantities
            }${intl.formatMessage({ id: 'order.piece', defaultMessage: '件' })} ${intl.formatMessage({
              id: 'order.paid',
              defaultMessage: '实付',
            })}：`}
          />
        </View>
      )}
      {!!btnConfig?.length && (
        <View className={styles['btn-wrap']}>
          {btnConfig.map((item) => (
            <View className={styles['btn']} key={item.name} onClick={() => item.onClick?.()} style={item.style}>
              {item.name}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

OrderItemCard.defaultProps = {
  itemData: {},
  hideHeader: false,
  hideFooter: false,
  customStyle: {},
  btnConfig: [],
  showEditPrice: false,
  showInnerStatus: false,
}

export default OrderItemCard
