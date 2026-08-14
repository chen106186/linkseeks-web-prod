import request from './request'

export interface LogisticsTrackItem {
  acceptTime?: string
  acceptStation?: string
  remark?: string
  opCode?: string
}

export interface OrderLogisticsDetail {
  orderNo?: string
  batchNo?: number
  deliveryNo?: string
  logisticsNo?: string
  company?: string
  trackingDetail?: {
    mailNo?: string
    expressCompanyName?: string
    subscribeStatus?: number
    lastEventTime?: string
    events?: LogisticsTrackItem[]
  }
}

export const postOrderPlatformManageLogisticsDetail = (data: { orderNo: string; batchNo?: number }) =>
  request<OrderLogisticsDetail>('/order/platform/manage/logistics/detail', {
    method: 'POST',
    data,
  })
