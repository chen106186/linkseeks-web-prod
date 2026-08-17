import request from '@apps/apis/src/request'

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

export const postOrderVendorLogisticsDetail = (data: { orderNo: string; batchNo?: number }) =>
  request<PlatformOrderLogisticsResp>('/order/vendor/logistics/detail', {
    method: 'POST',
    data,
  })
