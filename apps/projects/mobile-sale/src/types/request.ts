// 将只读转化为 可写
export type Writeable<T> = {
  -readonly [k in keyof T]: T[k]
}

/**
 * 请求头信息
 */
export interface requestHeaders {
  'Content-Type'?: string
  source?: number
  environment?: number
  site?: number
  token?: string
  shop?: number
}

export type methodTypes = 'post' | 'get' | 'put' | 'delete'

export type requestOptions = Writeable<Request>

export type unionOptions = requestOptions | string

export interface RequestFactoryModel {}

export interface IRequestSuccess<T> {
  code: number
  data: T
  message: string
  time: number
  error?: string
}
