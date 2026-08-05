/*
 * @Author: GHua
 * @Date: 2022-02-23 16:27:59
 * @LastEditTime: 2022-04-01 15:33:25
 * @LastEditors: GHua
 * @Description: 订单信息组件
 */
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import AdditionalInfo from '../components/additionalInfo'
import { DELIVERY_TYPE_LOGISTICS_AND_SELF, ORDER_TYPE } from '../../constants/order'
import { numFormat, priceFormat } from '../../utils/numFormat'
import { useIntl } from '@linkseeks/i18n'
import type {
  OrderGroupItemInfoType,
  OrderInfoType,
  OrderItemInfoType,
  ProductGroupItemType,
  StoreAddressItemType,
} from '../types'
import SelectAddress from '../components/selectAddress'
import { Button } from 'antd'
import { groupBy } from 'lodash'
import type { AddressItemType } from '../address'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
type DeliverTimesItemType = {
  vendorMemberId: number
  vendorRoleId: number
  deliverTime: string | undefined
  remark: string | undefined
}

export type OrderItemType = any

interface IProps {
  shopId: number
  orderInfo: OrderInfoType
  shippingAddress: AddressItemType | undefined
  onOrderChange: (newOrderInfo: OrderInfoType) => void
  onAddressChange: (state: boolean) => void
}

const OrderList: React.FC<IProps> = (props) => {
  const { shopId, orderInfo, onOrderChange, onAddressChange, shippingAddress } = props
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [storeAddressList, setStoreAddressList] = useState<StoreAddressItemType[]>([])
  const [selectStoreAddressId, setSelectStoreAddressId] = useState<number>()
  const [selectProductIds, setselectProductIds] = useState<number[]>([])
  const [orderGroupList, setOrderGroupList] = useState<OrderGroupItemInfoType[]>([])
  const intl = useIntl()

  // 送货时间及备注数据回调，替换 deliverTime 字段内容
  const additionalInfoChange = (values: DeliverTimesItemType, storeId: number) => {
    const tempOrder = { ...orderInfo }
    tempOrder.orderList = tempOrder.orderList.map((item) => {
      if (item.id === storeId) {
        item.deliverTime = values
      }
      return item
    })
    onOrderChange(tempOrder)
  }

  const handleChangeDeliveryType = (type: number, productIds: number[]) => {
    const tempOrder = { ...orderInfo }
    tempOrder.orderList = tempOrder.orderList.map((item) => {
      return {
        ...item,
        orderList: item.orderList.map((productItem) => {
          if (productIds.includes(productItem.id)) {
            productItem.selectDeliveryType = type
          }
          return productItem
        }),
      }
    })
    onOrderChange(tempOrder)
  }

  const handleAdreeChange = (address: StoreAddressItemType, productIds: number[]) => {
    const tempOrder = { ...orderInfo }
    tempOrder.orderList = tempOrder.orderList.map((item) => {
      return {
        ...item,
        orderList: item.orderList.map((productItem) => {
          if (productIds.includes(productItem.id)) {
            productItem.pickUpAddress = address
          }
          return productItem
        }),
      }
    })
    onOrderChange(tempOrder)
  }

  const handleCloseModal = () => {
    setStoreAddressList([])
    setselectProductIds([])
    setSelectStoreAddressId(undefined)
    setModalVisible(false)
  }

  const handleSelectConfirm = (addressInfo: StoreAddressItemType) => {
    if (addressInfo && selectProductIds && selectProductIds.length > 0) {
      handleAdreeChange(addressInfo, selectProductIds)
    }
    setModalVisible(false)
  }

  // 根据物流方式对同个供应商的商品进行分组显示
  const groupByDeliveryType = (storeList: OrderItemInfoType[]) => {
    const newGroupList: any[] = storeList.map((storeItem) => {
      const groupMap = groupBy(storeItem.orderList, (value) => {
        if (
          value.logistics.deliveryType !== value.selectDeliveryType &&
          value.logistics.deliveryType !== DELIVERY_TYPE_LOGISTICS_AND_SELF
        ) {
          value.selectDeliveryType = value.logistics.deliveryType
        }
        return value.selectDeliveryType
      })
      return {
        ...storeItem,
        orderList: Object.keys(groupMap)
          .map((key) => {
            const groupList = groupMap[key]
            // 先过滤出配送方式是物流+自提的作为主要的配送方式
            const groupItem =
              groupList.filter((item) => item.logistics.deliveryType === DELIVERY_TYPE_LOGISTICS_AND_SELF)[0] ||
              groupList[0]
            return {
              logistics: groupItem.logistics,
              pickUpAddress: groupItem?.pickUpAddress,
              selectDeliveryType: groupItem?.selectDeliveryType,
              commodityList: groupList,
            }
          })
          .sort((a, b) => (b.commodityList.length > a.commodityList.length ? 1 : -1)),
      }
    })
    setOrderGroupList(newGroupList)
  }

  useEffect(() => {
    if (orderInfo && orderInfo?.orderList && orderInfo.orderList.length > 0) {
      groupByDeliveryType(orderInfo?.orderList)
    }
  }, [orderInfo])

  // 根据收货地址判断自提地址是否匹配
  const judegeAddressIsMatch = useCallback(
    (storeItem: OrderGroupItemInfoType, pickUpAddress: StoreAddressItemType | undefined) => {
      if (storeItem.storeList && storeItem.storeList.length > 0 && shippingAddress && pickUpAddress) {
        if (
          pickUpAddress.provinceCode !== shippingAddress.provinceCode ||
          pickUpAddress.cityCode !== shippingAddress.cityCode ||
          pickUpAddress.districtCode !== shippingAddress.districtCode
        ) {
          onAddressChange && onAddressChange(false)
          return false
        }
      }
      onAddressChange && onAddressChange(true)
      return true
    },
    [shippingAddress],
  )

  return orderGroupList && orderGroupList.length > 0 ? (
    <>
      {orderGroupList.map((storeItem, storeItemIndex: number) => (
        <div key={`store_${storeItem.id}`} className={styles.order_info}>
          <div className={styles.common_title}>
            <span>{storeItem.shopname}</span>
          </div>
          {/* <div className={styles.order_tb_title}>
              <div className={cx(styles.order_tb_title_item, styles.goods_info)}>
                {intl.formatMessage({id: 'order.index.shop',defaultMessage: '商品})}
              </div>
              <div className={styles.order_tb_title_item}>
                {orderInfo?.orderType === ORDER_TYPE.integral
                  ? intl.formatMessage({id: 'order.index.nodeIntegral'})
                  : translate('web.common.currencySymbol')
              </div>
              <div className={cx(styles.order_tb_title_item, styles.count)}>
                {orderInfo?.orderType === ORDER_TYPE.integral
                  ? intl.formatMessage({id: 'order.index.ExchangeQuantity'})
                  : intl.formatMessage({id: 'order.index.quantity'})}
              </div>
              <div className={styles.order_tb_title_item}>
                {intl.formatMessage({id: 'order.index.Subtotal'})}
                {orderInfo?.orderType === ORDER_TYPE.integral
                  ? ""
                  : translate('web.common.currencySymbol')
              </div>
            </div> */}
          <div className={styles.order_list} key={`order_list_item_${storeItemIndex}`}>
            {storeItem.orderList &&
              storeItem.orderList.length > 0 &&
              storeItem.orderList.map((orderItem: ProductGroupItemType, orderItemIndex: number) => (
                <Fragment key={`orderItem-${orderItemIndex}`}>
                  {storeItem.orderList[0].commodityList[0]?.groupNo && (
                    <div className={styles.mealPriceMain}>
                      <div>套餐活动</div>
                      <div>
                        <div className={styles.mealPriceWarp}>
                          套餐总价:{' '}
                          <b className={styles.mealPrice}>¥{storeItem.orderList[0].commodityList[0]?.groupHandPrice}</b>
                        </div>
                        <div className={styles.alreadlyLess}>
                          已减{storeItem.orderList[0].commodityList[0]?.saleTotalAmount}
                        </div>
                      </div>
                    </div>
                  )}
                  {orderItem.commodityList.map((productItem) => (
                    <div key={productItem.id}>
                      <div
                        className={
                          productItem.groupNo
                            ? `${styles.order_list_item} ${styles.order_list_group}`
                            : styles.order_list_item
                        }
                      >
                        <div className={cx(styles.order_list_item_item, styles.goods_info)}>
                          <div className={styles.order_list_item_item_imgbox}>
                            <img width={80} height={80} src={productItem.commodityPic} />
                          </div>
                          <div>
                            <div className={styles.order_list_item_item_name}>{productItem.name}</div>
                            <div className={styles.order_list_item_item_category}>
                              {productItem.attribute.map((attrItem: any) => (
                                <span key={attrItem.id}>
                                  {attrItem.customerAttribute.name}：{attrItem.customerAttributeValue.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className={styles.order_list_item_item}>
                          <span className={styles.order_list_item_item_unitprice}>
                            <div className={styles.order_list_item_item_unitprice}>
                              {orderInfo?.orderType === ORDER_TYPE.integral
                                ? `${numFormat(productItem.unitPrice)}`
                                : `${translate('web.common.currencySymbol')} ${priceFormat(productItem.unitPrice)}`}
                            </div>
                          </span>
                        </div>
                        <div className={cx(styles.order_list_item_item, styles.count)}>
                          <span>
                            {numFormat(productItem.count)} {productItem.unitName}
                          </span>
                        </div>
                        <div className={styles.order_list_item_item}>
                          <span className={styles.order_list_item_item_price}>
                            {orderInfo?.orderType === ORDER_TYPE.integral
                              ? `${numFormat(productItem.unitPrice * productItem.count)}`
                              : priceFormat(productItem.unitPrice * productItem.count)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(orderItem.logistics.deliveryType === 2 || orderItem.logistics.deliveryType === 4) && (
                    <div className={styles.order_logistics}>
                      <div className={styles.additional_row}>
                        <div className={styles.additional_row_title}>
                          {intl.formatMessage({ id: 'order.delivery.way', defaultMessage: '配送方式' })}
                        </div>
                        <div className={styles.additional_row_content}>
                          {orderItem.logistics.deliveryType === 4 && (
                            <div
                              className={cx(
                                styles.deliveryType_btn,
                                orderItem?.selectDeliveryType === 1 && styles.active,
                              )}
                              onClick={() =>
                                handleChangeDeliveryType(
                                  1,
                                  orderItem.commodityList
                                    .filter((commodityItem) => commodityItem.logistics.deliveryType === 4)
                                    ?.map((commodityItem) => commodityItem.id),
                                )
                              }
                            >
                              {intl.formatMessage({ id: 'order.index.logistics' })}
                            </div>
                          )}
                          <div
                            className={cx(
                              styles.deliveryType_btn,
                              orderItem?.selectDeliveryType === 2 && styles.active,
                            )}
                            onClick={() =>
                              handleChangeDeliveryType(
                                2,
                                orderItem.commodityList
                                  .filter((commodityItem) => commodityItem.logistics.deliveryType === 4)
                                  ?.map((commodityItem) => commodityItem.id),
                              )
                            }
                          >
                            {intl.formatMessage({ id: 'order.index.SelfMention' })}
                          </div>
                        </div>
                      </div>
                      {orderItem?.selectDeliveryType === 2 && (
                        <>
                          <div className={styles.additional_row} style={{ marginBottom: 0 }}>
                            <div className={styles.additional_row_title}>
                              {intl.formatMessage({ id: 'order.delivery.way.addree', defaultMessage: '自提地址' })}
                            </div>
                            <div className={styles.additional_row_content}>
                              {orderItem?.pickUpAddress ? (
                                <div>
                                  <span>
                                    {orderItem?.pickUpAddress.provinceName}
                                    {orderItem?.pickUpAddress.cityName}
                                    {orderItem?.pickUpAddress.districtName}
                                    {orderItem?.pickUpAddress.streetName}
                                    {orderItem?.pickUpAddress.address}
                                  </span>
                                  {storeItem.storeList && storeItem.storeList.length > 1 && (
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        if (
                                          storeItem.storeList &&
                                          orderItem?.pickUpAddress &&
                                          orderItem?.pickUpAddress.id
                                        ) {
                                          setStoreAddressList(storeItem.storeList)
                                          setSelectStoreAddressId(orderItem?.pickUpAddress.id)
                                          setselectProductIds(
                                            orderItem.commodityList.map((commodityItem) => commodityItem.id),
                                          )
                                          setModalVisible(true)
                                        }
                                      }}
                                    >
                                      {intl.formatMessage({ id: 'btn.modify' })}
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <span className={styles.logistics_miss_match_text}>
                                  {intl.formatMessage({
                                    id: 'order.address.notSuport',
                                    defaultMessage: '该区域不支持自提！',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          {!judegeAddressIsMatch(storeItem, orderItem?.pickUpAddress) && (
                            <div className={styles.additional_row}>
                              <div className={styles.additional_row_title} />
                              <div className={styles.additional_row_content}>
                                <span className={styles.logistics_miss_match_text}>
                                  {intl.formatMessage({
                                    id: 'order.address.notSuport',
                                    defaultMessage: '该区域不支持自提！',
                                  })}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Fragment>
              ))}
          </div>
          <AdditionalInfo
            shopId={shopId}
            onChange={(values) => additionalInfoChange(values, storeItem.id)}
            vendorMemberId={storeItem.memberId}
            vendorRoleId={storeItem.memberRoleId}
          />
          <SelectAddress
            visible={modalVisible}
            value={selectStoreAddressId}
            onCancel={handleCloseModal}
            onOk={(address) => handleSelectConfirm(address)}
            addressList={storeAddressList}
          />
        </div>
      ))}
    </>
  ) : null
}

export default OrderList
