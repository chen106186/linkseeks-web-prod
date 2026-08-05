/*
 * @Author: GHua
 * @Date: 2022-02-23 16:59:39
 * @LastEditTime: 2022-04-08 10:02:16
 * @LastEditors: GHua
 * @Description: 创建订单相关hook
 */
import { useMemo, useState } from 'react'
import { message, Modal } from 'antd'
import { history } from '@linkseeks/router-manager'
import type { DeliverTimesItemType, OrderInfoType, OrderParamType, OrderProductType } from '../types'
import type { AddressItemType } from '../address'
import { dateFormat } from '@/utils/date'
import type { SeletePayWayItemType } from '../payway'
import { postOrderCreateAgentPurchase } from '@apps/apis'
import type { GetPayEAccountAllInPayGetUserBalanceResponse } from '@apps/apis'
import { getPayAllInPayGetMemberInfo } from '@apps/apis'
import { PayWayType } from '../../constants/pay'
import useOrderPrice from './useOrderPrice'
import { useIntl } from '@linkseeks/i18n'
import type { AgentPurchaseOrderInfoType } from '../../types'
import { AGENT_ORDER_KEY } from '../../hooks/useAgentInfo'

interface Iprops {
  buyerInfo: AgentPurchaseOrderInfoType
  userInfo: any
  mallInfo: any
  /** 订单信息 */
  orderInfo: OrderInfoType | undefined
  orderProduct: OrderProductType[]
  /** 合同信息 */
  contractInfo: any
  balanceInfo: GetPayEAccountAllInPayGetUserBalanceResponse | undefined
  /** 选中的优惠券 */
  selectCouponList: any[]
  /** 选中的积分券 */
  selectIntegralList: any[]
  /** 选中的支付方式 */
  selectPayWay: SeletePayWayItemType | undefined
  /** 选中的发票信息 */
  selectInvoiceInfo: any
  /** 收货地址 */
  selectAddressInfo: AddressItemType | undefined
  /** 是否需要发票 */
  needTheInvoice: boolean
  /** 是否需要合同 */
  needTheContract: boolean
  orderModel: number
}
interface CreateOrderReturnRes {
  verifyOrder: () => Promise<boolean>
  createOrder: (signatureLogId?: number, contractUrl?: string) => void
  confirmLoading: boolean
}

const useCreateOrder = (props: Iprops): CreateOrderReturnRes => {
  const {
    buyerInfo,
    userInfo,
    mallInfo,
    orderInfo,
    orderProduct,
    contractInfo,
    selectCouponList,
    selectIntegralList,
    selectAddressInfo,
    selectPayWay,
    selectInvoiceInfo,
    needTheInvoice,
    orderModel,
  } = props
  const intl = useIntl()
  // 通联支付方式集合
  const ALLINPAY_LIST = [11, 12, 13, 14, 15]
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { logisticsFee, totalAmount, couponAmount, promotionAmount, taxFee } = useOrderPrice({
    orderInfo,
    selectAddressInfo,
    selectCouponList,
    selectIntegralList,
  })
  /**
   * 校验订单数据
   */
  const verifyOrder = async () => {
    message.destroy()
    if (!orderInfo) {
      return false
    }
    // 如果是含有物流的配送方式则需要校验是否选择了收货地址
    if (orderInfo.logistics.deliveryType === 1 || orderInfo.logistics.deliveryType === 4) {
      if (!selectAddressInfo) {
        message.info(intl.formatMessage({ id: 'order.index.PinkAddress' }))
        return false
      }
    }

    // 如果需要支付则判断是否选中了支付方式
    if (orderInfo.requiredPay && !selectPayWay) {
      message.info(intl.formatMessage({ id: 'order.index.choicePay' }))
      return false
    }
    // 如果勾选了使用发票，则判断是否选用了发票信息
    if (needTheInvoice) {
      if (!selectInvoiceInfo) {
        message.info(intl.formatMessage({ id: 'order.index.choicInvoice' }))
        return false
      }
    }
    // 如果流程中含有合同则判断
    // if (orderInfo.hasContract && orderInfo.contractId && !needTheContract) {
    //   message.info(intl.formatMessage("order.index.ElectronicContract"));
    //   return false
    // }

    // 如果可以选择送货时间，则判断是否选择了送货时间
    if (orderInfo.orderList.some((item) => item.deliverTime?.needDeliverTimes)) {
      if (
        !orderInfo.orderList.every((item) => {
          return item.deliverTime && item.deliverTime.deliverTime
        })
      ) {
        message.info(intl.formatMessage({ id: 'addDeliveryTime.index.DeliveryTime.required' }))
        return false
      }
    }

    // 表示是通联支付
    if (selectPayWay && ALLINPAY_LIST.includes(selectPayWay.payChannel)) {
      setConfirmLoading(true)
      try {
        const { data } = await getPayAllInPayGetMemberInfo()
        setConfirmLoading(false)
        message.destroy()
        if (!data || data?.isSubmit !== 1 || !data.phone) {
          Modal.confirm({
            centered: true,
            className: 'mallComfirm',
            content: intl.formatMessage({
              id: 'order.index.allinpay.noAuth',
              defaultMessage: '您未完成通联支付认证，暂不可使用通联支付；',
            }),
            okText: intl.formatMessage({ id: 'order.index.auth.btn', defaultMessage: '前往认证' }),
            cancelText: intl.formatMessage({ id: 'enquiryOffer.index.Cancel' }),
            onOk: () => {
              history.push(`/payandSettle/paySetting/eAccountApprove`)
            },
          })
          return false
        } else {
          // 如果选择的是余额支付，则判断余额是否足够
          // if (
          //   selectPayWay.payChannel === PayWayType.allInPayBalance &&
          //   balanceInfo &&
          //   balanceInfo.availableAmount < totalAmount
          // ) {
          //   message.info(
          //     intl.formatMessage(
          //       "order.index.allinpay.balance.notenough",
          //       "通联账户余额不足"
          //     )
          //   );
          //   return false
          // }

          // 如果选择的是通联快捷支付，则判断是否个人认证账号
          if (
            selectPayWay.payChannel === PayWayType.allInPayQuick &&
            userInfo?.memberRoleType !== 2 &&
            userInfo?.memberRoleType !== 3
          ) {
            message.info(
              intl.formatMessage({
                id: 'order.index.allinpay.selectpayway.error',
                defaultMessage: '快捷支付方式只支持个人会员账号',
              }),
            )
            return false
          }
        }
      } catch (error) {
        setConfirmLoading(false)
      }
    }
    setConfirmLoading(false)
    return true
  }

  const deliverTimes = useMemo(() => {
    const deliverTimesRes: DeliverTimesItemType[] = []
    if (orderInfo) {
      orderInfo.orderList.forEach((orderItem) => {
        if (orderItem.deliverTime) {
          deliverTimesRes.push(orderItem.deliverTime)
        }
      })
    }
    return deliverTimesRes
  }, [orderInfo])

  const getStoreId = (): number | undefined => {
    let storeId: number | undefined = undefined
    if (orderInfo) {
      orderInfo.orderList.forEach((orderItem) => {
        orderItem.orderList.forEach((productItem) => {
          if (productItem.pickUpAddress && productItem.pickUpAddress?.storeId) {
            storeId = productItem.pickUpAddress.storeId
          }
        })
      })
    }
    return storeId
  }

  /**
   * 提交订单
   */
  const createOrder = (signatureLogId?: number, contractUrl?: string) => {
    if (!orderInfo) return
    const params: OrderParamType = {
      orderId: buyerInfo?.orderId,
      buyerMemberId: buyerInfo.memberId,
      buyerRoleId: buyerInfo.roleId,
      buyerMemberName: buyerInfo.memberName,
      orderMode: orderModel,
      storeId: getStoreId(),
      shopId: orderInfo.shopId,
      shopType: mallInfo.type,
      shopEnvironment: 1,
      shopName: mallInfo.name,
      deliverTimes,
      freight: logisticsFee,
      taxes: taxFee.show ? taxFee.fee : 0,
      payType: 0,
      payChannel: 0,
      promotionAmount: 0,
      couponAmount: 0,
      totalAmount: 0,
      products: [],
    }

    if (selectPayWay && orderInfo.requiredPay) {
      params.payType = selectPayWay.payType // 支付方式
      params.payChannel = selectPayWay.payChannel // 支付渠道
    }

    // 收货地址
    if ((orderInfo.logistics.deliveryType === 1 || orderInfo.logistics.deliveryType === 4) && selectAddressInfo) {
      params.consignee = {
        consigneeId: selectAddressInfo.id,
        consignee: selectAddressInfo.receiverName,
        provinceCode: selectAddressInfo.provinceCode,
        cityCode: selectAddressInfo.cityCode,
        districtCode: selectAddressInfo.districtCode,
        address: selectAddressInfo.address,
        streetCode: selectAddressInfo.streetCode,
        postalCode: selectAddressInfo.postalCode,
        countryCode: '86',
        phone: selectAddressInfo.phone,
        telephone: selectAddressInfo.tel,
        defaultConsignee: selectAddressInfo.isDefault === 1 ? true : false,
      }
    }

    // 发票信息
    if (needTheInvoice) {
      params.hasInvoice = true // 是否有发票
      params.invoice = {
        invoiceId: selectInvoiceInfo.id,
        invoiceKind: selectInvoiceInfo.type, // 发票种类，1-企业，2-个人
        invoiceType: selectInvoiceInfo.kind, // 发票类型，1-增值税普通发票，2-增值税专用发票
        title: selectInvoiceInfo.invoiceTitle, // 发票台头
        taxNo: selectInvoiceInfo.taxNo, // 纳税号
        bank: selectInvoiceInfo.bankOfDeposit, // 开户银行
        account: selectInvoiceInfo.account, // 账号
        address: selectInvoiceInfo.address, // 地址
        phone: selectInvoiceInfo.tel, // 电话
        defaultInvoice: selectInvoiceInfo.isDefault === 1 ? true : false, // 是否默认，true-是，false-否
      }
    } else {
      params.hasInvoice = false // 是否有发票
    }

    // 合同信息
    if (signatureLogId) {
      params.contract = {
        id: signatureLogId,
        fileName: contractInfo.contractName,
        url: contractUrl || '',
      }
    }
    // 活动、优惠券相关字段 todo
    params.promotionAmount = promotionAmount // 促销活动优惠总金额
    params.couponAmount = couponAmount // 优惠券优惠总金额
    params.totalAmount = totalAmount // 订单实付总金额
    params.products = orderProduct

    if (selectCouponList.length > 0) {
      params.coupons = []
      selectCouponList.forEach((item: any) => {
        if (!item.couponId) {
          return
        }
        const obj = {
          vendorMemberId: item.memberId, // 优惠券归属的供应会员（店铺）Id
          vendorRoleId: item.roleId, // 优惠券归属的供应会员（店铺）角色Id
          skuId: item.selectSkuId, // 优惠券适用商品的SkuId，如果不是商品优惠券，为空或Null或0
          couponId: item.id, // 优惠券领取id
          name: item.name, // 优惠券名称
          couponType: item.type, // 优惠券类型枚举
          belongType: item.belongType, // 优惠券归属类型枚举
          amount: item.denomination, // 优惠券面额
          startTime: dateFormat(new Date(item.validTimeStart), 'YY-MM-DD HH:mm:ss'), // 优惠券有效期起始时间，格式为yyyy-MM-ddHH:mm:ss
          expireTime: dateFormat(new Date(item.validTimeEnd), 'YY-MM-DD HH:mm:ss'), // 优惠券有效期结束时间，格式为yyyy-MM-ddHH:mm:ss
        }
        params.coupons && params.coupons.push(obj)
      })
    }

    if (selectIntegralList.length > 0) {
      // 积分列表
      params.deductions = []
      selectIntegralList.forEach((item: any) => {
        if (!item.vendorMemberId) {
          return
        }
        const obj = {
          vendorMemberId: item.vendorMemberId, // 积分归属的供应会员（店铺）Id
          vendorRoleId: item.vendorRoleId, // 积分归属的供应会员（店铺）角色Id
          vendorName: item.vendorName, // 供应商会员名称
          relType: item.relType, // 积分类型：0=平台；1=会员
          usedPoint: item.enablePoint, // 消费的积分
          amount: item.enableDeductionAmount, // 本单积分可抵扣金额
          deductionRate: item.deductionRate, // 积分抵扣金额比例
        }
        params.deductions && params.deductions.push(obj)
      })
    }

    setConfirmLoading(true)

    postOrderCreateAgentPurchase(params as any)
      .then((res: { code: number; data: any }) => {
        if (res.code === 1000) {
          message.destroy()
          message.success(intl.formatMessage({ id: 'agentOrder.submit.success' }))
          sessionStorage.removeItem(AGENT_ORDER_KEY)
          setTimeout(() => {
            history.redirect('/orderAbility/saleOrder/agentPurchaseOrder')
          }, 1000)
        } else {
          setConfirmLoading(false)
        }
      })
      .catch(() => {
        setConfirmLoading(false)
      })
  }

  return {
    verifyOrder,
    createOrder,
    confirmLoading,
  }
}

export default useCreateOrder
