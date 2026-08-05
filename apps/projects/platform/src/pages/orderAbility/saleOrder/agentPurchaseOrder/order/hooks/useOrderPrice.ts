/*
 * @Author: GHua
 * @Date: 2022-02-23 16:59:39
 * @LastEditTime: 2022-04-06 13:36:04
 * @LastEditors: GHua
 * @Description: 订单创建参数相关hook
 */
import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { AddressItemType } from '../address'
import { OrderInfoType } from '../types'
import { postOrderBuyerProductFreeFreight } from '@apps/apis'

interface OrderPriceReturnRes {
  /** 订单实付总金额 */
  totalAmount: number
  /** 优惠券金额 */
  couponAmount: number
  /** 积分优惠金额 */
  integralAmount: number
  /** 促销活动金额 */
  promotionAmount: number
  /** 运费 */
  logisticsFee: number
  /** 订单总金额 */
  orderAmountPrice: number
  taxFee: {
    show: boolean
    fee: number
  }
}

interface IProps {
  orderInfo: OrderInfoType | undefined
  selectAddressInfo: AddressItemType | undefined
  selectCouponList: any[]
  selectIntegralList: any[]
}

const useOrderPrice = (props: IProps): OrderPriceReturnRes => {
  const [logisticsFee, setLogisticsFee] = useState<number>(0)
  const { orderInfo, selectAddressInfo, selectCouponList, selectIntegralList } = props

  /** 查询运费信息 */
  const getLogisticsFeeAnync = async () => {
    if (selectAddressInfo && orderInfo) {
      const orderProductList: any[] = []
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          const templateId = orderItem.logistics?.templateId
          // 判断是否物流的方式和由买家承担费用并使用了运费模板
          if (
            orderItem.logistics?.deliveryType === 1 &&
            orderItem.logistics?.carriageType === 2 &&
            orderItem.logistics?.useTemplate &&
            templateId
          ) {
            console.log(orderItem, 'orderItemorderItemorderItemorderItemorderItemorderItem')
            orderProductList.push({
              memberId: orderItem.vendorMemberId,
              roleId: orderItem.vendorRoleId,
              refPrice: orderItem.refPrice,
              templateId,
              count: orderItem.count,
              weight: orderItem.logistics?.weight,
            })
          }
        }
      }
      if (orderProductList.length > 0) {
        const params: any = {
          productFreightDetailList: orderProductList,
          receiverAddressId: selectAddressInfo.id,
        }
        try {
          const res: any = await postOrderBuyerProductFreeFreight(params)
          message.destroy()
          setLogisticsFee(Number(res.data))
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  /**
   *
   * @returns 返回订单总金额
   */
  const orderAmountPrice = useMemo(() => {
    let amount = 0
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          amount += orderItem.price * orderItem.count
        }
      }
    }
    return amount
  }, [orderInfo])

  /**
   *
   * @returns 到手价
   */
  const orderAmountRefPrice = useMemo(() => {
    let amount = 0
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          amount += orderItem.refPrice * orderItem.count
        }
      }
    }
    return amount
  }, [orderInfo])

  /**
   * 优惠券金额
   * @returns number
   */
  const couponAmount = useMemo(() => {
    let callBlackMoney = 0
    selectCouponList &&
      selectCouponList.forEach((item: any) => {
        callBlackMoney += item.denomination
      })
    return callBlackMoney
  }, [selectCouponList])

  /**
   * 积分优惠金额
   * @returns number
   */
  const integralAmount = useMemo(() => {
    let callBlackMoney = 0
    selectIntegralList &&
      selectIntegralList.forEach((item: any) => {
        callBlackMoney += item.enableDeductionAmount
      })
    if (callBlackMoney > totalAmount) {
      // 积分抵扣不能超过订单总金额---到手
      callBlackMoney = totalAmount
    }
    return callBlackMoney
  }, [selectIntegralList])

  /**
   * @returns 促销金额
   */
  const promotionAmount = useMemo(() => {
    let amount = 0
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          amount += orderItem.saleTotalAmount || 0
        }
      }
    }
    return amount
  }, [orderInfo])

  const taxFee = useMemo(() => {
    let amount = 0
    let isCrossBorder = false
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          if (orderItem.isCrossBorder) {
            isCrossBorder = true
            if (orderItem.taxRate) {
              amount += orderItem.refPrice * (orderItem.taxRate / 100) * orderItem.count
            }
          }
        }
      }
    }
    return {
      show: isCrossBorder,
      fee: amount,
    }
  }, [orderInfo])

  /**
   *
   * @returns 订单总金额---到手
   */
  var totalAmount = useMemo(() => {
    let amount = orderAmountRefPrice + logisticsFee + taxFee.fee - couponAmount - integralAmount
    if (
      orderInfo &&
      orderInfo.requiredPay &&
      orderInfo.payNodes &&
      Array.isArray(orderInfo.payNodes) &&
      orderInfo.payNodes.length > 0
    ) {
      const firstBatch = orderInfo.payNodes.filter((item: { batchNo: number }) => item.batchNo === 1)[0]
      if (firstBatch) {
        amount = amount * firstBatch.payRate
      }
    }
    return amount
  }, [orderInfo, orderAmountRefPrice, logisticsFee, couponAmount, selectIntegralList, taxFee])

  useEffect(() => {
    if (selectAddressInfo && orderInfo) {
      getLogisticsFeeAnync()
    }
  }, [selectAddressInfo, orderInfo])

  return {
    totalAmount,
    couponAmount,
    integralAmount,
    promotionAmount,
    logisticsFee,
    orderAmountPrice,
    taxFee,
  }
}

export default useOrderPrice
