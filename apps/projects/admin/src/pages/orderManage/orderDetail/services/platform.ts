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
  unit?: string
  spec?: string
  quantity?: number
  delivered?: number
  leftCount?: number
  received?: number
  differCount?: number
  deliveryCount?: number
}

export interface PlatformLogisticsCompanyItem {
  id: number
  company: string
  companyCode: string
}

export interface PlatformLogisticsEventItem {
  eventTime?: string
  context?: string
  status?: string
  location?: string
}

export interface PlatformLogisticsDetailResp {
  logisticsOrderId?: number
  logisticsOrderNo?: string
  mailNo?: string
  expressCompanyCode?: string
  expressCompanyName?: string
  subscribeStatus?: number
  lastEventTime?: string
  events?: PlatformLogisticsEventItem[]
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
  trackingDetail?: PlatformLogisticsDetailResp
}

export const getOrderPlatformManageDeliveryProducts = (data: { orderNo: string }) =>
  request<PlatformDeliveryProductItem[]>('/order/platform/manage/delivery/products', {
    method: 'POST',
    data,
  })

export const postOrderPlatformManageDeliveryConfirm = (data: Record<string, any>) =>
  request<void>('/order/platform/manage/delivery/confirm', {
    method: 'POST',
    data,
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
