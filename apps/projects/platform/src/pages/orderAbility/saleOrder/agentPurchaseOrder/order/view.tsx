import React, { useState } from 'react'
import { Button, Spin } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import Address, { AddressItemType } from './address'
import PayWay, { SeletePayWayItemType } from './payway'
// import Contract from "./contract";
import Invoice from './invoice'
import styles from './index.less'
// import SignModal from "@/components/SignModal";
import { DELIVERY_TYPE_NO_DELIVERY, ORDER_TYPE } from '../constants/order'
import OrderList from './orderList'
import CouponSelect from './coupon'
import OrderMessage from './orderMessage'
import useOrderPrice from './hooks/useOrderPrice'
import useOrderInfo from './hooks/useOrderInfo'
import useCreateOrder from './hooks/useCreateOrder'
import { priceFormat } from '../utils/numFormat'
import { useIntl } from '@linkseeks/i18n'
import { LAYOUT_TYPE } from '@/constants'
import { authService } from '@apps/services'
import useAgentInfo from '../hooks/useAgentInfo'
import { PageHeaderWrapper } from '@apps/components'

interface OrderPropsType {
  location: any
  shopInfo: any
  layoutType: LAYOUT_TYPE
  shopUrlParam: string
  shopId: number
  getOrderInfo: (sessionKey: string) => Promise<any>
  removeOrderInfo: (sessionKey: string) => Promise<any>
}

const Order: React.FC<OrderPropsType> = (props: any) => {
  const { spam_id } = useQuery()
  const intl = useIntl()
  const [selectPayWay, setSelectPayWay] = useState<SeletePayWayItemType>()
  const [needTheInvoice, setNeedTheInvoice] = useState<boolean>(false)
  const [needConpon, setNeedConpon] = useState<boolean>(false)
  const [needTheContract] = useState<boolean>(false)
  const [selectAddressInfo, setSelectAddressInfo] = useState<AddressItemType>()
  const [selectInvoiceInfo, setSelectInvoiceInfo] = useState<any>()
  const [selectCouponList, setSelectCouponList] = useState<any>([])
  const [selectIntegralList, setSelectIntegralList] = useState<any>([])
  const userInfo = authService.getAuth()
  const { agentPurchaseOrderInfo } = useAgentInfo({ check: true })
  const mallInfo = {
    ...agentPurchaseOrderInfo,
    name: agentPurchaseOrderInfo?.shopName,
  }

  const {
    orderInfo,
    contractInfo,
    spinningState,
    orderProduct,
    balanceInfo,
    orderModel,
    submitDisabled,
    dispatchSpin,
    dispatchOrderInfo,
    dispatchSubmitState,
  } = useOrderInfo({ selectAddressInfo, spamId: spam_id, buyerInfo: agentPurchaseOrderInfo })
  const { logisticsFee, totalAmount, couponAmount, integralAmount, promotionAmount, orderAmountPrice, taxFee } =
    useOrderPrice({ orderInfo, selectAddressInfo, selectCouponList, selectIntegralList })
  const { verifyOrder, createOrder, confirmLoading } = useCreateOrder({
    buyerInfo: agentPurchaseOrderInfo,
    userInfo,
    mallInfo,
    orderInfo,
    orderProduct,
    contractInfo,
    balanceInfo,
    selectCouponList,
    selectIntegralList,
    selectPayWay,
    selectInvoiceInfo,
    selectAddressInfo,
    needTheInvoice,
    needTheContract,
    orderModel,
  })

  /** 提交订单 */
  const submitOrder = async () => {
    if (!orderInfo) return
    if (await verifyOrder()) {
      createOrder()
    }
  }

  return (
    <PageHeaderWrapper>
      <Spin spinning={spinningState}>
        <div className={styles.order}>
          {orderInfo ? (
            <div className={styles.order_container}>
              {/* 收货地址 */}
              <Address
                buyerInfo={agentPurchaseOrderInfo}
                visible={orderInfo.logistics.deliveryType !== DELIVERY_TYPE_NO_DELIVERY}
                orderInfo={orderInfo}
                onChange={(selectItem: AddressItemType | undefined, isInArea?: boolean) => {
                  setSelectAddressInfo(selectItem)
                  dispatchSubmitState(!isInArea)
                }}
                onHideLoading={() => dispatchSpin(false)}
              />
              {/* 支付方式 */}
              <PayWay
                visible={orderInfo.requiredPay}
                balanceInfo={balanceInfo}
                buyerInfo={agentPurchaseOrderInfo}
                supplyMembersId={orderInfo.supplyMembersId}
                deliveryType={orderInfo.logistics.deliveryType}
                supplyMembersRoleId={orderInfo.supplyMembersRoleId}
                selectItem={selectPayWay}
                payWayList={orderInfo.payWayList}
                onChange={(val) => setSelectPayWay(val)}
              />
              {/* 发票信息(积分订单不显示发票信息) */}
              <Invoice
                buyerInfo={agentPurchaseOrderInfo}
                visible={orderInfo.isInvoice && orderInfo.orderType !== ORDER_TYPE.integral}
                state={needTheInvoice}
                onChange={(val: boolean) => setNeedTheInvoice(val)}
                onSelect={(val: any) => {
                  setSelectInvoiceInfo(val)
                }}
              />
              {/* 订单商品数据 */}
              <OrderList
                shopId={orderInfo.shopId}
                orderInfo={orderInfo}
                shippingAddress={selectAddressInfo}
                onOrderChange={dispatchOrderInfo}
                onAddressChange={(state) => {
                  dispatchSubmitState(!state)
                }}
              />
              {/* 优惠券 (积分订单和拼团订单不适用优惠券/积分) */}
              {![ORDER_TYPE.group, ORDER_TYPE.integral].includes(orderInfo.orderType || ORDER_TYPE.normal) && (
                <CouponSelect
                  shopId={orderInfo.shopId}
                  buyerInfo={agentPurchaseOrderInfo}
                  state={needConpon}
                  orderInfo={orderInfo}
                  orderAmount={totalAmount}
                  onChange={(val: boolean) => setNeedConpon(val)}
                  fnDetermineCallBlack={(selectCouponDesc: any, type: string) => {
                    type === 'coupon' ? setSelectCouponList(selectCouponDesc) : setSelectIntegralList(selectCouponDesc)
                  }}
                />
              )}
              <OrderMessage
                visible={orderInfo.orderType !== ORDER_TYPE.integral}
                allMoney={priceFormat(orderAmountPrice)}
                logisticsFee={priceFormat(logisticsFee)}
                promotion={promotionAmount}
                couponMoney={priceFormat(couponAmount)}
                integralMoney={priceFormat(integralAmount)}
                orderInfo={orderInfo}
                allHandMoney={priceFormat(totalAmount)}
                taxFee={taxFee}
              />
              <div className={styles.settlement_box}>
                <div className={styles.settlement_box_item}>
                  <div className={styles.settlement_box_item_price}>
                    <span>
                      {orderInfo?.orderType === ORDER_TYPE.integral
                        ? intl.formatMessage({ id: 'order.index.TotalPoints' })
                        : intl.formatMessage({ id: 'order.index.TotalPayment' })}
                    </span>
                    <b className={styles.settlement_box_item_price_total}>
                      {orderInfo?.orderType === ORDER_TYPE.integral ? totalAmount : priceFormat(totalAmount)}
                    </b>
                  </div>
                  <Button
                    disabled={submitDisabled}
                    loading={confirmLoading}
                    className={styles.settlement_box_item_btn}
                    onClick={() => submitOrder()}
                  >
                    {orderInfo?.orderType === ORDER_TYPE.integral
                      ? intl.formatMessage({ id: 'order.index.SubmitPoints' })
                      : intl.formatMessage({ id: 'order.index.placeOrder' })}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default Order
