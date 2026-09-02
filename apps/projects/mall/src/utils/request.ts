import fetch from 'node-fetch'
import CacheManager from '@/utils/cache'
import { getEnv } from '@apps/utils/src/env'
import logger from '../../logger.js'

/**
 * @description 定义请求成功的接口模型
 * @author xjm
 * @date 2020-06-01
 * @export
 * @interface IRequestSuccess
 * @template T  data类型, 无法指定时可传入any
 */
export interface IRequestSuccess<T> {
  code: number
  data: T
  message: string
  time: number
}

export interface IApiRequest extends RequestInit {
  // 可以根据需要添加其他请求选项
  params?: any
  ctlType?: string
}

export async function get<T>(url: string, options?: IApiRequest): Promise<IRequestSuccess<T>> {
  const queryParams = new URLSearchParams(options?.params || {})
  const requestUrl = `${getEnv('BACK_GATEWAY')}${url}?${queryParams}`
  const accessToken = CacheManager.get('accessToken') as string
  const language = CacheManager.get('language') as string
  const headers = {
    ...options?.headers,
    'Accept-Language': 'zh-CN',
    source: 1,
    environment: '1',
  }
  if (accessToken) {
    headers['accessToken'] = accessToken
  }

  const requestOptions: any = {
    method: 'GET',
    ...options,
    headers,
  }

  try {
    const response = await fetch(requestUrl, requestOptions)
    const data = (await response.json()) as IRequestSuccess<T>

    // 记录非成功状态的响应
    if (data.code !== 1000) {
      logger.error(
        `API请求警告 - ${url} - 状态码: ${data.code} - Header: ${JSON.stringify(headers)} - 请求体: ${JSON.stringify(
          options?.params,
        )}, 消息: ${data.message}`,
      )
    }

    return data
  } catch (error) {
    logger.error(
      `GET请求失败 - ${url} - Header: ${JSON.stringify(headers)} - 请求体: ${JSON.stringify(options?.params)}`,
      error as Error,
    )
    console.error('Fetch error:', error)
    throw error
  }
}

export async function post<T>(url: string, body: any, options?: IApiRequest): Promise<IRequestSuccess<T>> {
  const accessToken = CacheManager.get('accessToken') as string
  const language = CacheManager.get('language') as string

  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': 'zh-CN',
    accessToken,
    source: 1,
    environment: '1',
  }

  const requestOptions: any = {
    method: 'POST',
    headers,
    body: JSON.stringify(body.data),
    ...options,
  }

  try {
    const requestUrl = `${getEnv('BACK_GATEWAY')}${url}`
    const response = await fetch(requestUrl, requestOptions)
    const data = (await response.json()) as IRequestSuccess<T>

    // 记录非成功状态的响应
    if (data?.code !== 1000) {
      logger.warn(
        `API请求警告 - ${url} - 状态码: ${data?.code} - Header: ${JSON.stringify(headers)} - 请求体: ${JSON.stringify(
          body,
        )}, 消息: ${data?.message}`,
      )
    }

    return data
  } catch (error) {
    logger.error(
      `POST请求失败 - ${url} - Header: ${JSON.stringify(headers)} - 请求体: ${JSON.stringify(body)}`,
      error as Error,
    )
    console.error('Fetch error:', error)
    throw error
  }
}
