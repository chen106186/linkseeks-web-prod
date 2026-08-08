/**
 *
 * 全局响应状态码定义
 *
 */

export interface ResponseCode {
  [key: number]: string
}

const messages: ResponseCode = {
  1000: '请求成功',
  404: '接口不存在',
}

export default messages
