import request from '../request'

type CameraRequest = Record<string, any>

export const postCommodityWebCameraAdd = async (params?: CameraRequest, config?: any) =>
  request('/commodity/web/camera/add', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })

export const postCommodityWebCameraUpdate = async (params?: CameraRequest, config?: any) =>
  request('/commodity/web/camera/update', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })

export const postCommodityWebCameraDelete = async (params?: CameraRequest, config?: any) =>
  request('/commodity/web/camera/delete', {
    data: params,
    method: 'POST',
    ctlType: 'message',
    ...config,
  })

export const getCommodityWebCameraPage = async (params?: CameraRequest, config?: any) =>
  request('/commodity/web/camera/page', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })

export type CommodityCameraMobileResp = {
  id: number
  cameraId: number
  cameraName: string
  coverUrl?: string
  directionName?: string
  sortOrder?: number
  cameraStatus: 0 | 1 | 2 | 3
  deviceSerial?: string
  channelNo?: number
  videoUrl?: {
    id?: string
    url: string
    expireTime?: string
    accessToken?: string
  } | null
}

export const getCommodityMobileCameraListByCommodity = async (params: { commodityId: number | string }, config?: any) =>
  request<CommodityCameraMobileResp[]>('/commodity/mobile/camera/listByCommodity', {
    params,
    method: 'GET',
    ctlType: 'none',
    ...config,
  })
