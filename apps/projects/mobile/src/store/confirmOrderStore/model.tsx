import { PostOrderMobileProcurementOrderAddRequest } from '@apps/apis'
import { GetProductShopPurchaseGetPurchaseListResponse } from '@apps/apis'

export type LogisticType = {
  [key: string]: {
    carriageType: null
    company: null
    deliveryType: number
    sendAddress: number
    templateId: null | number
    weight: null | number
    count: number
  }
}
export type AddressType = {
  fullAddress: string
  id: number
  phone: string
  receiverName: string
  isDefault: number
  provinceCode: number
  cityCode: number
  districtCode: number
  postalCode: number
  streetCode: number
  tel: number
  address: string
}

export type InvoiceType = {
  id: number
  kind: number
  type: number
  invoiceTitle: string
  taxNo: null | string
  bankOfDeposit: string
  account: string
  address: string
  tel: string
  isDefault: number
  createTime: number
  updateTime: number
  createRoleId: number
  memberId: number
}

/**
 * 供应商类型
 */
export type SupplierType = {
  memberId: number
  memberRoleId: number
  name: string
  id: number
}

/**
 * 订单支付类型
 */
export type orderMessageType = {
  vendorMemberId: number
  vendorRoleId: number
  storeId: number
  orderIds: Array<number>
  paymentRequired: boolean
  fundMode: number
  batchNo: number
  payType: number
  payChannel: number
  payAmount: number
  tradeNo: string
}

/**
 * 提交订单是商品的格式
 */
export type productFormatType = PostOrderMobileProcurementOrderAddRequest['orderProductRequests'][0]

export type orderItemType = GetProductShopPurchaseGetPurchaseListResponse[0] & {
  channelCommodityId?: number
}

export type OrderListType = orderItemType & {
  showPrice?: number
  [key: string]: any
}

export type PurcharseOrderProductType = {
  [key: string]: {
    commodityLogo: string
    dataIndex: string
    id: number
    logistics: LogisticType
    memberParameter: null | number
    name: string
    orderList: OrderListType[]
    logisticsDetail?: any
    priceType?: number // 1: 普通商品，2: 询价商品
    /**
     * 库存
     */
    stockCount?: number
    isPublish?: boolean
    /**
     *   渠道商品id, 提交订单用
     */
    commodityUnitPriceAndPicId?: number | null
    /**
     *  渠道商品id, 渠道商城购物车收藏用
     */
    channelCommodityId?: number | null
  }
}

export type PurchaseOrderType = {
  [key: string]: {
    dataIndex: string
    mainPic: string
    memberId: number
    memberRoleId: number
    products: PurcharseOrderProductType
    storeId: number
    storeName: string
    total: string | number
    productCount: string | number
  }
}

export interface ConfirmOrderStoreModel {
  currentOrderCheckedKeys: string[]
  orderAmount: number
  orderInfo: Partial<PostOrderMobileProcurementOrderAddRequest>
  addressInfo: any
  selfPickupInfo: any // 自提人信息
  invoiceInfo: null | InvoiceType
  deliveryType: number
  list: PurchaseOrderType
  paymentInfo: any
  freightTotal: number // 运费
  supplierInfo: SupplierType | null // 供应商信息
  getDefaultInvoice: (memberId: number, roleId: number) => void
  initOrderList: (data: any, checkedKeysList: string[], amount: number) => void
  setPaymentInfo: (paymentInfo: any) => void
  setInvoiceInfo: (data: InvoiceType) => void
  setAddressInfo: (data: AddressType | null) => void
  setSelfPickupInfo: (data: any | null) => void
  setDeliveryType: (data: number) => void
  setOrderInfo: (orderInfo: Partial<PostOrderMobileProcurementOrderAddRequest>) => void
  clearOrderInfo: () => void
  clearAll: () => void
  setFreightTotal: () => void
  orderMessage: orderMessageType // 订单信息
  setOrderMessage: (data: orderMessageType) => void // 设置订单信息
  orderstore: any
  setstoreItem: (data: any) => void
  socialDistributionInvitationCode: string // 邀请码
  setSocialDistributionInvitationCode: (code: string) => void
}
