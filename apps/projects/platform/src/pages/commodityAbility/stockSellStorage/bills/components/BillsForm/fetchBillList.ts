/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-22 17:57:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-07 10:15:47
 * @Description: 获取 单据列表 弹窗数据接口相关
 */
import {
  getAftersalesReplaceGoodsPageToBeAddReplaceDeliveryByWarehouse,
  getAftersalesReplaceGoodsPageToBeAddReplaceStorageByWarehouse,
  getAftersalesReplaceGoodsPageToBeAddReturnDeliveryByWarehouse,
  getAftersalesReplaceGoodsPageToBeAddReturnStorageByWarehouse,
  getAftersalesReturnGoodsPageToBeAddReturnDeliveryByWarehouse,
  getAftersalesReturnGoodsPageToBeAddReturnStorageByWarehouse,
} from '@apps/apis'
import { getEnhanceProcessToBeAddDeliveryList, getEnhanceSupplierToBeAddStorageList } from '@apps/apis'
// import { getOrderPurchaseReceiptAddList } from '@apps/apis';
import { formatTimeString } from '@/utils'

// 获取采购入库单相关数据
export const fetchOrderPurchaseReceiptAddList = async (params: any) => {
  // const res = await getOrderPurchaseReceiptAddList({
  //   ...params,
  // })
  // if (res.code === 1000) {
  //   return {
  //     data: res.data.data.map(item => ({
  //       ...item,
  //       memberName: item.supplyMembersName,
  //       membersId: item.supplyMembersId,
  //       membersRoleId: item.supplyMembersRoleId,
  //     })),
  //     total: res.data.totalCount,
  //   };
  // }
  // return { data: [], total: 0 };
}

// 获取销售发货单相关数据
export const getOrderSalesInvoiceOrderList = async (params: any) => {
  const res = await getOrderSalesInvoiceOrderList({
    ...params,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        memberName: item.memberName,
        membersId: item.memberId,
        membersRoleId: item.memberRoleId,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取加工入库单单相关数据
export const getMachiningWarehousingList = async (params: any) => {
  const { search, ...rest } = params
  const res = await getEnhanceSupplierToBeAddStorageList({
    noticeNo: search,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        memberName: item.processName,
        deliveryAddresId: +item.receiverAddressId,
        fullAddress: item.receiveAddress || '',
        receiverName: item.receiveUserName || '',
        phone: item.receiveUserTel || '',
        orderNo: item.noticeNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取加工发货单单相关数据
export const getMachiningDeliveryList = async (params: any) => {
  const { search, ...rest } = params
  const res = await getEnhanceProcessToBeAddDeliveryList({
    noticeNo: search,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        memberName: item.supplierName,
        deliveryAddresId: +item.receiverAddressId,
        fullAddress: item.receiveAddress || '',
        receiverName: item.receiveUserName || '',
        phone: item.receiveUserTel || '',
        orderNo: item.noticeNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后退货发货单单相关数据
export const getRefundDeliveryList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReturnGoodsPageToBeAddReturnDeliveryByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.returnId,
        memberName: item.supplierName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.returnGoodsAddress.receiveId,
        fullAddress: item.returnGoodsAddress.receiveAddress || '',
        receiverName: item.returnGoodsAddress.receiveUserName || '',
        phone: item.returnGoodsAddress.receiveUserTel || '',
        deliveryType: item.returnGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后退货入库单单相关数据
export const getRefundWarehousingList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReturnGoodsPageToBeAddReturnStorageByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.returnId,
        memberName: item.consumerName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.returnGoodsAddress.sendId,
        fullAddress: item.returnGoodsAddress.sendAddress || '',
        receiverName: item.returnGoodsAddress.sendUserName || '',
        phone: item.returnGoodsAddress.sendUserTel || '',
        deliveryType: item.returnGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后换货退货发货单单相关数据
export const getExchangeReturnDeliveryList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReplaceGoodsPageToBeAddReturnDeliveryByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.replaceId,
        memberName: item.supplierName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.returnGoodsAddress.receiveId,
        fullAddress: item.returnGoodsAddress.receiveAddress || '',
        receiverName: item.returnGoodsAddress.receiveUserName || '',
        phone: item.returnGoodsAddress.receiveUserTel || '',
        deliveryType: item.returnGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后换货退货入库单单相关数据
export const getExchangeReturnWarehousingList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReplaceGoodsPageToBeAddReturnStorageByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.replaceId,
        memberName: item.consumerName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.returnGoodsAddress.receiveId,
        fullAddress: item.returnGoodsAddress.receiveAddress || '',
        receiverName: item.returnGoodsAddress.receiveUserName || '',
        phone: item.returnGoodsAddress.receiveUserTel || '',
        deliveryType: item.returnGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后换货发货单单相关数据
export const getExchangeDeliveryList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReplaceGoodsPageToBeAddReplaceDeliveryByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.replaceId,
        memberName: item.supplierName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.replaceGoodsAddress.receiveId,
        fullAddress: item.replaceGoodsAddress.receiveAddress || '',
        receiverName: item.replaceGoodsAddress.receiveUserName || '',
        phone: item.replaceGoodsAddress.receiveUserTel || '',
        deliveryType: item.replaceGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}

// 获取售后换货入库单单相关数据
export const getExchangeWarehousingList = async (params: any) => {
  const { search, startTime, endTime, ...rest } = params
  const res = await getAftersalesReplaceGoodsPageToBeAddReplaceStorageByWarehouse({
    applyNo: search,
    startTime: startTime ? formatTimeString(+startTime) : null,
    endTime: endTime ? formatTimeString(+endTime) : null,
    ...rest,
  })
  if (res.code === 1000) {
    return {
      data: res.data.data.map((item) => ({
        ...item,
        id: item.replaceId,
        memberName: item.consumerName,
        supplyMembersName: item.supplierName,
        supplyMembersId: item.parentMemberId,
        supplyMembersRoleId: item.parentMemberRoleId,
        deliveryAddresId: item.replaceGoodsAddress.receiveId,
        fullAddress: item.replaceGoodsAddress.receiveAddress || '',
        receiverName: item.replaceGoodsAddress.receiveUserName || '',
        phone: item.replaceGoodsAddress.receiveUserTel || '',
        deliveryType: item.replaceGoodsAddress.deliveryType || '',
        orderNo: item.applyNo,
      })),
      total: res.data.totalCount,
    }
  }
  return { data: [], total: 0 }
}
