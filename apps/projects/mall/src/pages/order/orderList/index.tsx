/*
 * @Description: 订单信息组件
 */
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { Button, Popover } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { DELIVERY_TYPE_LOGISTICS_AND_SELF, ORDER_TYPE } from '@/types/order'
import groupBy from 'lodash/groupBy'
import ImageBox from '@apps/components/src/web/ImageBox'
import { numFormat, priceFormat } from '@apps/utils'
import AdditionalInfo from '../components/additionalInfo'
import {
  OrderGroupItemInfoType,
  OrderInfoType,
  OrderItemInfoType,
  ProductGroupItemType,
  ProductItemType,
  PromotionsCommodityType,
  PromotionsType,
  StoreAddressItemType,
} from '../types'
import SelectAddress from '../components/selectAddress'
import { AddressItemType } from '../address'
import styles from './index.module.less'

const SHOW_COUNT = 2

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
  getLogisticsFeeAnync: (selectAddressInfo: AddressItemType | undefined) => void
}

const OrderList: React.FC<IProps> = (props) => {
  const { shopId, orderInfo, onOrderChange, getLogisticsFeeAnync, shippingAddress } = props
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [storeAddressList, setStoreAddressList] = useState<StoreAddressItemType[]>([])
  const [selectStoreAddressId, setSelectStoreAddressId] = useState<number>()
  const [selectProductIds, setselectProductIds] = useState<number[]>([])
  const [orderGroupList, setOrderGroupList] = useState<OrderGroupItemInfoType[]>([])
  const [expandObj, setExpandObj] = useState<any>({})
  const translate = getWebIntl()

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

    // 如果订单中没有物流的配送方式，则运费设为0，否则重新请求运费
    const hasLogisticsFee = tempOrder.orderList.some((item) =>
      item.orderList.some((child) => child.selectDeliveryType === 1),
    )
    if (!hasLogisticsFee) {
      getLogisticsFeeAnync(undefined)
    } else {
      getLogisticsFeeAnync(shippingAddress)
    }
    onOrderChange(tempOrder)
  }

  const handleAdreeChange = (address: StoreAddressItemType, productIds: number[]) => {
    const tempOrder = { ...orderInfo }
    tempOrder.orderList = tempOrder.orderList.map((item) => {
      return {
        ...item,
        orderList: item.orderList.map((productItem) => {
          if (productIds.includes(productItem.id)) {
            productItem['pickUpAddress'] = address
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
    const newGroupList = storeList.map((storeItem) => {
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
              [...groupList]
                .reverse()
                .filter((item) => item.logistics.deliveryType === DELIVERY_TYPE_LOGISTICS_AND_SELF)[0] || groupList[0]

            return {
              logistics: groupItem.logistics,
              pickUpAddress: groupItem?.pickUpAddress,
              selectDeliveryType: groupItem?.selectDeliveryType,
              commodityList: groupList,
            }
          })
          .sort((a, b) => (b.commodityList.length > a.commodityList.length ? 1 : -1)),
      }
    }) as OrderGroupItemInfoType[]
    setOrderGroupList(newGroupList)
  }

  useEffect(() => {
    if (orderInfo && orderInfo?.orderList && orderInfo.orderList.length > 0) {
      groupByDeliveryType(orderInfo?.orderList)
    }
  }, [orderInfo])

  // 根据收货地址判断自提地址是否匹配
  // const judegeAddressIsMatch = useCallback(
  //   (storeItem: OrderGroupItemInfoType, pickUpAddress: StoreAddressItemType | undefined) => {
  //     if (storeItem.storeList && storeItem.storeList.length > 0 && shippingAddress && pickUpAddress) {
  //       if (
  //         pickUpAddress.provinceCode !== shippingAddress.provinceCode ||
  //         pickUpAddress.cityCode !== shippingAddress.cityCode ||
  //         pickUpAddress.districtCode !== shippingAddress.districtCode
  //       ) {
  //         onAddressChange && onAddressChange(false)
  //         return false
  //       }
  //     }
  //     onAddressChange && onAddressChange(true)
  //     return true
  //   },
  //   [shippingAddress],
  // )

  // mro模式仓位相关
  /**
   * 列表展开
   * @param key
   */
  const setExpand = (key: string) => {
    let _obj = { ...expandObj }
    if (_obj[key]) {
      _obj[key] = false
    } else {
      _obj[key] = true
    }
    setExpandObj(_obj)
  }

  /**
   * 仓位地址
   * @param warehouseAddress
   */
  const renderContent = (warehouseAddress: string) => {
    return (
      <div className={styles.renderContent}>
        <div className={styles.renderContent_left}>{translate('web.common.address')}：</div>
        <div className={styles.renderContent_right}>{warehouseAddress}</div>
      </div>
    )
  }

  /**
   * 展示赠品
   */
  const renderGiftCommodity = (productItem: ProductItemType, amount: number) => {
    const promotions = (productItem?.promotions || []) as unknown as PromotionsType[]
    // 查询赠品信息
    const promotionsItem = promotions.find((item) => item.promotionType === 6)
    const sortLadders =
      promotionsItem?.ladders && promotionsItem?.ladders.length > 0
        ? promotionsItem?.ladders.sort((a, b) => (b.limitValue < a.limitValue ? -1 : 0))
        : []

    // 符合赠送条件的赠品信息
    let giftList: PromotionsCommodityType[] = []
    const allGift: PromotionsCommodityType[] = []
    if (sortLadders.length > 0) {
      for (const ladderItem of sortLadders) {
        for (const listItem of ladderItem.list) {
          if (allGift.every((item) => item.skuId !== listItem.skuId)) {
            allGift.push(listItem)
          }
        }
      }
    }
    if (productItem.giveList && productItem.giveList.length > 0) {
      for (const giveItem of productItem.giveList) {
        const commonItem = allGift.find((item) => item.skuId === giveItem.id)
        if (commonItem) {
          giftList.push({
            ...commonItem,
            num: giveItem.num,
          })
        }
      }
    }
    if (giftList.length > 0) {
      return (
        <div className={styles['gift-list']}>
          {giftList.map(
            (giftItem) =>
              giftItem.productName && (
                <div className={styles['gift-list-item']} key={giftItem.id}>
                  <div className={styles['gift-list-item-img']}>
                    <ImageBox width={56} height={56} src={giftItem.productImgUrl} />
                    <div className={styles['gift-list-item-img-tag']}>
                      {translate('web.resource.commodity.zengpin')}
                    </div>
                  </div>
                  <div className={styles['gift-list-item-name']}>
                    {giftItem.productName} X {giftItem.num}/{giftItem.unit}
                  </div>
                  <div className={styles['gift-list-item-amount']}>￥ 0.00</div>
                </div>
              ),
          )}
        </div>
      )
    }
    return null
  }

  return orderGroupList && orderGroupList.length > 0 ? (
    <>
      {orderGroupList.map((storeItem, storeItemIndex: number) => (
        <div key={`store_${storeItem.id}`} className={styles.order_info}>
          <div className={styles.common_title}>
            <span>{storeItem.shopname}</span>
          </div>
          <div className={styles.order_tb_title}>
            <div className={cx(styles.order_tb_title_item, styles.goods_info)}>
              {translate('web.resource.mall.commodity')}
            </div>
            <div className={styles.order_tb_title_item}>
              {orderInfo?.orderType === ORDER_TYPE.integral
                ? translate('web.resource.commodity.suoxujifen')
                : translate('web.resource.mall.danjiayuan')}
            </div>
            <div className={cx(styles.order_tb_title_item, styles.count)}>
              {orderInfo?.orderType === ORDER_TYPE.integral
                ? translate('web.resource.mall.duihuanshuliang')
                : translate('web.resource.mall.shuliang')}
            </div>
            <div className={styles.order_tb_title_item}>
              {translate('web.resource.mall.xiaoji')}
              {orderInfo?.orderType === ORDER_TYPE.integral ? '' : translate('web.common.yuan')}
            </div>
          </div>
          <div className={styles.order_list} key={`order_list_item_${storeItemIndex}`}>
            {storeItem.orderList &&
              storeItem.orderList.length > 0 &&
              storeItem.orderList.map((orderItem: ProductGroupItemType, orderItemIndex: number) => (
                <Fragment key={`orderItem-${orderItemIndex}`}>
                  {orderItem.commodityList.map((productItem, productIndex) => (
                    <div key={productItem.id}>
                      {productItem.groupNo && productItem.isMain && (
                        <div className={`${styles.mealPriceMain} ${styles.order_list_group}`}>
                          <div>{translate('web.resource.mall.taocanhuodong')}</div>
                          <div>
                            <div className={styles.mealPriceWarp}>
                              {translate('web.resource.mall.taocanzongjia')}:{' '}
                              <b className={styles.mealPrice}>
                                {translate('web.common.currencySymbol')}
                                {storeItem.orderList[0].commodityList[0]?.groupHandPrice}
                              </b>
                            </div>
                            <div className={styles.alreadlyLess}>
                              {translate('web.resource.mall.yijian')}
                              {storeItem.orderList[0].commodityList[0]?.saleTotalAmount}
                            </div>
                          </div>
                        </div>
                      )}
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
                          {productItem?.orderProductPositionVOS?.length > 0 ? (
                            productItem?.orderProductPositionVOS?.map((_item: any) => (
                              <div>
                                <Popover
                                  placement="bottomLeft"
                                  title={_item?.warehouseAddress.split(',')[0]}
                                  content={renderContent(_item?.warehouseAddress.split(',')[1])}
                                >
                                  <div className={styles.warehouseAddress}>{_item?.warehouseAddress.split(',')[0]}</div>
                                  <div className={styles.warehouseAddressStock}>
                                    共 {_item?.positionQuantity} {productItem.unitName}
                                  </div>
                                </Popover>
                              </div>
                            ))
                          ) : (
                            <span>
                              {numFormat(productItem.count)} {productItem.unitName}
                            </span>
                          )}
                          {productItem?.orderProductPositionVOS?.length > SHOW_COUNT && (
                            <div
                              className={styles.product_promotion_expand}
                              onClick={() => setExpand(`${productItem.id}_${productIndex}`)}
                            >
                              <span>
                                {expandObj?.[`${productItem.id}_${productIndex}`]
                                  ? translate('web.resource.mall.shouqi')
                                  : translate('web.resource.mall.zhankai')}
                              </span>
                              {expandObj?.[`${productItem.id}_${productIndex}`] ? (
                                <CaretUpOutlined className={styles.product_promotion_expand_icon} />
                              ) : (
                                <CaretDownOutlined className={styles.product_promotion_expand_icon} />
                              )}
                            </div>
                          )}
                        </div>
                        <div className={styles.order_list_item_item}>
                          <span className={styles.order_list_item_item_price}>
                            {orderInfo?.orderType === ORDER_TYPE.integral
                              ? `${numFormat(productItem.unitPrice * productItem.count)}`
                              : priceFormat(productItem.unitPrice * productItem.count)}
                          </span>
                        </div>
                      </div>
                      {/* 赠品 */}
                      {productItem?.promotions &&
                        productItem?.promotions?.some((promotionsItem) => promotionsItem.promotionType === 6) &&
                        renderGiftCommodity(productItem, productItem.unitPrice * productItem.count)}
                      {orderItem?.selectDeliveryType === 2 &&
                        productItem?.pickUpAddress &&
                        orderItem.pickUpAddress?.id !== productItem?.pickUpAddress.id && (
                          <div className={styles.additional_row} style={{ marginBottom: 0 }}>
                            <div className={styles.additional_row_title}>
                              {translate('web.resource.mall.zitidizhi')}
                            </div>
                            <div className={styles.additional_row_content}>
                              <div>
                                <span>
                                  {productItem?.pickUpAddress.provinceName}
                                  {productItem?.pickUpAddress.cityName}
                                  {productItem?.pickUpAddress.districtName}
                                  {productItem?.pickUpAddress.streetName}
                                  {productItem?.pickUpAddress.address}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                  {(orderItem.logistics.deliveryType === 2 || orderItem.logistics.deliveryType === 4) && (
                    <div className={styles.order_logistics}>
                      <div className={styles.additional_row}>
                        <div className={styles.additional_row_title}>
                          {translate('web.resource.logistics.peisongfangshi')}
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
                              {translate('web.resource.mall.wuliu')}
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
                            {translate('web.resource.mall.ziti')}
                          </div>
                        </div>
                      </div>
                      {orderItem?.selectDeliveryType === 2 && (
                        <>
                          <div className={styles.additional_row} style={{ marginBottom: 0 }}>
                            <div className={styles.additional_row_title}>
                              {translate('web.resource.mall.zitidizhi')}
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
                                      {translate('web.common.change')}
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <span className={styles.logistics_miss_match_text}>
                                  {translate('web.resource.mall.gaiquyubuzhichiziti')}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* {!judegeAddressIsMatch(storeItem, orderItem?.pickUpAddress) && (
                            <div className={styles.additional_row}>
                              <div className={styles.additional_row_title}></div>
                              <div className={styles.additional_row_content}>
                                <span className={styles.logistics_miss_match_text}>
                                  {translate('web.resource.mall.gaiquyubuzhichiziti')}
                                </span>
                              </div>
                            </div>
                          )} */}
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
