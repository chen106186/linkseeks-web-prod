/*
 * @Author: XieZhiXiong
 * @Date: 2021-09-15 14:22:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-15 14:22:55
 * @Description:
 */
import {
  ORDER_TYPE_INQUIRY_CONTRACT,
  ORDER_TYPE_BIDDING_CONTRACT,
  ORDER_TYPE_TENDER_CONTRACT,
  ORDER_TYPE_REQUISITION,
} from '@/constants/const/order'

/**
 * 是否是srm订单
 * @param orderType
 * @returns
 */
export const isMaterialOrder = (orderType: number) => {
  return (
    orderType === ORDER_TYPE_INQUIRY_CONTRACT ||
    orderType === ORDER_TYPE_BIDDING_CONTRACT ||
    orderType === ORDER_TYPE_TENDER_CONTRACT ||
    orderType === ORDER_TYPE_REQUISITION
  )
}
