/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-15 10:20:22
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-15 10:25:34
 * @Description: 售后服务相关工具函数
 */
import {
  ORDER_TYPE_INQUIRY_CONTRACT,
  ORDER_TYPE_BIDDING_CONTRACT,
  ORDER_TYPE_TENDER_CONTRACT,
  ORDER_TYPE_REQUISITION,
  ORDER_TYPE_PURCHASE_REQUISITION_CONTRACT,
} from '@/constants/order'
import { getMemberManageAftersaleReplacePage, getMemberManageUpperProviderMerchantPage } from '@apps/apis'
import { GlobalConfig } from '@/global/config'

// 是否是SRM订单
export const isMaterialOrder = (orderType: number) => {
  return (
    orderType === ORDER_TYPE_INQUIRY_CONTRACT ||
    orderType === ORDER_TYPE_BIDDING_CONTRACT ||
    orderType === ORDER_TYPE_TENDER_CONTRACT ||
    orderType === ORDER_TYPE_REQUISITION ||
    orderType === ORDER_TYPE_PURCHASE_REQUISITION_CONTRACT
  )
}

/**
 * 售后类型
 * 售后换货：2 售后退货： 3 售后维修：4
 */
export type AsType = 2 | 3 | 4

/**
 * 售后地址角色
 * 寄件人 'sender' 收件人 'receiver'
 */
export type AsAddressRole = 'sender' | 'receiver'

const SUPPLIER_LIST_MAP = {
  0: getMemberManageAftersaleReplacePage,
  1: getMemberManageUpperProviderMerchantPage,
}

export const fetchSupplierList = async (params) => {
  const enableMultiTenancy = GlobalConfig.global.siteInfo.enableMultiTenancy || 0
  const res = await SUPPLIER_LIST_MAP[enableMultiTenancy]({
    ...params,
  })
  if (res.code === 1000) {
    return res.data
  }
  return { totalCount: 0, data: [] }
}
