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
