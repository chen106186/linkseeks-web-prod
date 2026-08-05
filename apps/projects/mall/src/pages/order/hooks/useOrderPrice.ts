/*
 * @Description: 订单创建参数相关hook
 */
import { useEffect, useMemo, useState } from 'react'
import { message } from 'antd'
import { postOrderBuyerProductFreeFreight } from '@apps/apis'
import { accAdd } from '@apps/utils'
import { AddressItemType } from '../address'
import { OrderInfoType, PromotionsCommodityType, PromotionsType } from '../types'

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

  // 会员折扣价汇总
  meberAllDisCountAmount: number
  getLogisticsFeeAnync: (selectAddressInfo: AddressItemType | undefined) => void
}

interface IProps {
  orderInfo: OrderInfoType | undefined
  selectCouponList: any[]
  selectIntegralList: any[]
}

const useOrderPrice = (props: IProps): OrderPriceReturnRes => {
  const [logisticsFee, setLogisticsFee] = useState<number>(0)
  const { orderInfo, selectCouponList, selectIntegralList } = props

  /** 查询运费信息 */
  const getLogisticsFeeAnync = async (selectAddressInfo: AddressItemType | undefined) => {
    if (selectAddressInfo && orderInfo) {
      const orderProductList: any[] = []

      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          const templateId = orderItem.logistics?.templateId
          // 判断是否物流的方式和由买家承担费用并使用了运费模板
          if (
            orderItem?.selectDeliveryType === 1 &&
            orderItem.logistics?.carriageType === 2 &&
            orderItem.logistics?.useTemplate &&
            templateId
          ) {
            orderProductList.push({
              memberId: orderItem.vendorMemberId,
              roleId: orderItem.vendorRoleId,
              refPrice: orderItem.refPrice,
              templateId,
              count: orderItem.count,
              weight: orderItem.logistics?.weight,
            })
          }
          // 如果赠品有运费则加入运费计算
          if (
            orderItem.promotions &&
            orderItem.promotions.length > 0 &&
            orderItem.promotions.find((item) => item.promotionType === 6)
          ) {
            const promotions = (orderItem?.promotions || []) as unknown as PromotionsType[]
            // 查询赠品信息
            const promotionsItem = promotions.find((item) => item.promotionType === 6)
            const sortLadders =
              promotionsItem?.ladders && promotionsItem?.ladders.length > 0
                ? promotionsItem?.ladders.sort((a, b) => (b.limitValue < a.limitValue ? -1 : 0))
                : []

            // 符合赠送条件的赠品信息
            const giftList: PromotionsCommodityType[] = []
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
            if (orderItem.giveList && orderItem.giveList.length > 0) {
              for (const giveItem of orderItem.giveList) {
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
              for (const giftItem of giftList) {
                if (
                  giftItem?.logistics?.deliveryType === 1 &&
                  giftItem.logistics?.carriageType === 2 &&
                  giftItem.logistics?.useTemplate &&
                  giftItem.logistics?.templateId
                ) {
                  orderProductList.push({
                    memberId: giftItem.memberId,
                    roleId: giftItem.memberRoleId,
                    refPrice: 0,
                    templateId: giftItem.logistics?.templateId,
                    count: giftItem.num,
                    weight: giftItem.logistics?.weight,
                  })
                }
              }
            }
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
      } else {
        setLogisticsFee(0)
      }
    } else {
      setLogisticsFee(0)
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
          amount += orderItem.unitPrice * orderItem.count
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
   * 积分优惠金额
   * @returns number
   */
  const integralAmount = useMemo(() => {
    let callBlackMoney = 0
    selectIntegralList &&
      selectIntegralList.forEach((item: any) => {
        callBlackMoney += item.enableDeductionAmount
      })
    return callBlackMoney
  }, [selectIntegralList])

  /**
   *
   * @returns 订单总金额---到手
   */
  const totalAmount = useMemo(() => {
    let amount = orderAmountRefPrice + logisticsFee + taxFee.fee - couponAmount - integralAmount
    return amount
  }, [orderAmountRefPrice, logisticsFee, couponAmount, selectIntegralList, taxFee])

  /**
   * @returns 促销金额
   */
  const promotionAmount = useMemo(() => {
    let amount = 0
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          amount = accAdd(amount, orderItem.saleTotalAmount || 0)
        }
      }
    }
    return amount
  }, [orderInfo])
  /**
   * 所有的会员折扣价汇总
   */
  const meberAllDisCountAmount = useMemo(() => {
    return orderAmountPrice - totalAmount - promotionAmount - integralAmount - couponAmount + logisticsFee
    let amount = 0
    if (orderInfo) {
      for (const item of orderInfo.orderList) {
        for (const orderItem of item.orderList) {
          amount += orderItem.memberDiscountAmount * orderItem.count
        }
      }
    }
    return amount
  }, [totalAmount, orderAmountPrice, promotionAmount, integralAmount, couponAmount, logisticsFee])
  return {
    totalAmount,
    couponAmount,
    integralAmount,
    promotionAmount,
    logisticsFee,
    orderAmountPrice,
    taxFee,
    meberAllDisCountAmount,
    getLogisticsFeeAnync,
  }
}

export default useOrderPrice
