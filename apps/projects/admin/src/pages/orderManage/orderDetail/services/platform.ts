import request from '@/utils/request'

export interface PlatformDeliveryProductItem {
  orderProductId: number
  relationId: number
  productId: number
  skuId?: number
  productNo?: string
  name?: string
  category?: string
  brand?: string
  spec?: string
  unit?: string
  quantity?: string
  delivered?: string
  received?: string
  leftCount?: string
  differCount?: string
}

export interface PlatformLogisticsCompanyItem {
  id: number
  company: string
  companyCode: string
}

export interface PlatformLogisticsTrackItem {
  acceptTime?: string
  acceptStation?: string
  remark?: string
  opCode?: string
  lat?: number
  lng?: number
}

export interface PlatformOrderLogisticsResp {
  orderId?: number
  orderNo?: string
  batchNo?: number
  deliveryNo?: string
  logisticsNo?: string
  company?: string
  companyCode?: string
  logisticsOrderId?: number
  logisticsOrderNo?: string
  trackingDetail?: {
    logisticsOrderId?: number
    logisticsOrderNo?: string
    mailNo?: string
    expressCompanyCode?: string
    expressCompanyName?: string
    subscribeStatus?: number
    lastEventTime?: string
    events?: PlatformLogisticsTrackItem[]
  }
}

export const postOrderPlatformManageDeliveryProducts = (data: { orderNo: string }) =>
  request<PlatformDeliveryProductItem[]>('/order/platform/manage/delivery/products', {
    method: 'POST',
    data,
  })

export const postOrderPlatformManageDeliveryConfirm = (data: Record<string, any>) =>
  request<void>('/order/platform/manage/delivery/confirm', {
    method: 'POST',
    data,
    ctlType: 'message',
  })

export const getOrderPlatformManageLogisticsCompanyList = () =>
  request<PlatformLogisticsCompanyItem[]>('/order/platform/manage/logistics/company/list', {
    method: 'GET',
  })

export const postOrderPlatformManageLogisticsDetail = (data: { orderNo: string; batchNo?: number }) =>
  request<PlatformOrderLogisticsResp>('/order/platform/manage/logistics/detail', {
    method: 'POST',
    data,
  })
