import request from '../request'

export interface PostCommodityWebPrinterConfigConfigRequest {
  storeId: number
  feieSn: string
  feieKey: string
  feieRemark?: string
  feieSimNumber?: string
  feieBizType?: string
  autoPrintOrder?: number
}

interface StoreIdRequest {
  storeId: string
}

export const postCommodityWebPrinterConfigConfig = async (
  params?: PostCommodityWebPrinterConfigConfigRequest,
  config?: any,
) =>
  request('/commodity/web/printerConfig/config', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })

export const getCommodityWebPrinterConfigGet = async (params?: StoreIdRequest, config?: any) =>
  request('/commodity/web/printerConfig/get', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })

export const getCommodityWebPrinterConfigDelete = async (params?: StoreIdRequest, config?: any) =>
  request('/commodity/web/printerConfig/delete', {
    params,
    method: 'GET',
    ctlType: 'message',
    ...config,
  })

export const getCommodityWebPrinterConfigTest = async (params?: StoreIdRequest, config?: any) =>
  request('/commodity/web/printerConfig/test', {
    params,
    method: 'GET',
    ctlType: 'message',
    ...config,
  })
