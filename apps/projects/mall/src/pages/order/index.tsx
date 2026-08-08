import React, { useMemo, useState } from 'react'
import { Button, Spin, message } from 'antd'
import CommonHeader from '@/components/CommonHeader'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import { postMemberLifecycleRuleCheckSubMemberOrderPermission } from '@apps/apis'
import HelmetProvider from '@/context/helmetProvider'
import { DELIVERY_TYPE_NO_DELIVERY, ORDER_TYPE } from '@/types/order'
import { accMul, priceFormat } from '@apps/utils'
import Address, { AddressItemType } from './address'
import PayWay, { SeletePayWayItemType } from './payway'
import Invoice from './invoice'
import OrderList from './orderList'
import CouponSelect from './coupon'
import OrderMessage from './orderMessage'
import useOrderPrice from './hooks/useOrderPrice'
import useOrderInfo from './hooks/useOrderInfo'
import useCreateOrder from './hooks/useCreateOrder'
import ContractInfo from './components/contractInfo'
import { CONTRACT_TYPE } from './types'
import styles from './index.module.less'

const Order: React.FC = () => {
  const translate = getWebIntl()
  const { mallInfo } = useGlobalConext()
  const [selectPayWay, setSelectPayWay] = useState<SeletePayWayItemType>()
  const [needTheInvoice, setNeedTheInvoice] = useState<boolean>(false)
  const [needConpon, setNeedConpon] = useState<boolean>(false)
  const [selectAddressInfo, setSelectAddressInfo] = useState<AddressItemType>()
  const [selectInvoiceInfo, setSelectInvoiceInfo] = useState<any>()
  const [selectCouponList, setSelectCouponList] = useState<any>([])
  const [selectIntegralList, setSelectIntegralList] = useState<any>([])
  // 合同类型
  const [contractType, setContractType] = useState<CONTRACT_TYPE>()

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
  } = useOrderInfo({ selectAddressInfo })
  const {
    logisticsFee,
    totalAmount,
    couponAmount,
    integralAmount,
    promotionAmount,
    orderAmountPrice,
    taxFee,
    meberAllDisCountAmount,
    getLogisticsFeeAnync,
  } = useOrderPrice({ orderInfo, selectCouponList, selectIntegralList })
  const { verifyOrder, createOrder, confirmLoading } = useCreateOrder({
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
    contractType,
    orderModel,
    priceMap: {
      logisticsFee,
      totalAmount,
      couponAmount,
      promotionAmount,
      taxFee,
    },
  })

  /** 提交订单 */
  const submitOrder = async () => {
    if (!orderInfo) return
    const param = { memberList: [{ memberId: orderInfo?.supplyMembersId, roleId: orderInfo?.supplyMembersRoleId }] }
    /* 校验会员是否允许参与寻源 */
    const res = await postMemberLifecycleRuleCheckSubMemberOrderPermission(param, { ctlType: 'none' })
    if (res.code === 1000) {
      if (!res.data) {
        message.error(translate('web.resource.mall.dangqianshengmingzhouqijieduanzanbuyunxutijiao'))
      } else {
        if (await verifyOrder()) {
          createOrder()
        }
      }
    } else {
      message.error(res.message)
    }
  }

  const _showPayNode = useMemo(() => {
    if (orderInfo && orderInfo.requiredPay && orderInfo.payNodes && orderInfo.payNodes.length > 0) {
      const payCount = orderInfo.payNodes.length
      const payTip = orderInfo.payNodes
        .map((nodeItem) => {
          return `${nodeItem.payNode}${accMul(nodeItem.payRate, 100)}%`
        })
        .join('、')

      const result = translate('web.resource.mall.dingdanjinefencountcizhifu', { count: payCount })
      return `${result}，${payTip}`
    }
    return null
  }, [orderInfo])

  return (
    <HelmetProvider title={`${translate('web.resource.mall.dingdanjiesuan')}-${mallInfo?.name}`}>
      <Spin spinning={spinningState}>
        <div className={styles.order}>
          <CommonHeader logoUrl={mallInfo?.logoUrl} title={translate('web.resource.mall.dingdanjiesuan')} />
          {orderInfo ? (
            <div className={styles.order_container}>
              {/* 收货地址 */}
              <Address
                visible={orderInfo.logistics.deliveryType !== DELIVERY_TYPE_NO_DELIVERY}
                orderInfo={orderInfo}
                onChange={(selectItem: AddressItemType | undefined, isInArea?: boolean) => {
                  setSelectAddressInfo(selectItem)
                  getLogisticsFeeAnync(selectItem)
                  dispatchSubmitState(!isInArea)
                }}
                onHideLoading={() => dispatchSpin(false)}
              />
              {/* 支付方式 */}
              <PayWay
                visible={orderInfo.requiredPay}
                balanceInfo={balanceInfo}
                supplyMembersId={orderInfo.supplyMembersId}
                deliveryType={orderInfo.logistics.deliveryType}
                supplyMembersRoleId={orderInfo.supplyMembersRoleId}
                selectItem={selectPayWay}
                payWayList={orderInfo.payWayList}
                onChange={(val) => setSelectPayWay(val)}
              />
              {/* 发票信息(积分订单不显示发票信息) */}
              <Invoice
                visible={orderInfo.isInvoice && orderInfo.orderType !== ORDER_TYPE.integral}
                state={needTheInvoice}
                onChange={(val: boolean) => setNeedTheInvoice(val)}
                onSelect={(val: any) => {
                  setSelectInvoiceInfo(val)
                }}
              />
              {/* 合同信息 */}
              <ContractInfo visible={orderInfo.hasContract} contractType={contractType} onChange={setContractType} />
              {/* 订单商品数据 */}
              <OrderList
                shopId={orderInfo.shopId}
                orderInfo={orderInfo}
                shippingAddress={selectAddressInfo}
                onOrderChange={dispatchOrderInfo}
                getLogisticsFeeAnync={getLogisticsFeeAnync}
                onAddressChange={(state) => {
                  dispatchSubmitState(!state)
                }}
              />
              {/* 优惠券 (积分订单和拼团订单不适用优惠券/积分) */}
              {![ORDER_TYPE.group, ORDER_TYPE.integral].includes(orderInfo.orderType || ORDER_TYPE.normal) && (
                <CouponSelect
                  shopId={orderInfo.shopId}
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
                meberAllDisCountAmount={priceFormat(meberAllDisCountAmount)}
                taxFee={taxFee}
              />
              <div className={styles.settlement_box}>
                <div className={styles.settlement_box_item}>
                  <div className={styles.settlement_box_item_price}>
                    <div className={styles['shallow-tips']}>{_showPayNode}</div>
                  </div>
                  <Button
                    disabled={submitDisabled}
                    loading={confirmLoading}
                    className={styles.settlement_box_item_btn}
                    onClick={() => submitOrder()}
                  >
                    {orderInfo?.orderType === ORDER_TYPE.integral
                      ? translate('web.resource.mall.tijiaojifendingdan')
                      : translate('web.resource.mall.tijiaodingdan')}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </Spin>
    </HelmetProvider>
  )
}

export default Order
