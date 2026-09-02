import {
  extend,
  ResponseError,
  OnionOptions,
  RequestOptionsInit,
  ResponseInterceptor,
  OnionMiddleware,
  Context,
  RequestMethod,
} from 'umi-request'
import responseCode from '@/constants/responseCode'
import { IRequestError, IRequestSuccess } from '..'
import { message } from 'antd'
import { removeAuth, removeRouters } from './auth'
import useAuth from '@apps/services/auth/useAuth'
import { isDev } from '@/constants'

export type CtlType = 'none' | 'message'
// 根前缀请求路径
const basePrefix = '/api'

export interface IApiRequest extends RequestOptionsInit {
  ctlType?: CtlType
  // 可以用于扩展请求配置
  extendsOptions?: RequestOptionsInit
}
/**
 *
 * umi-request文档 https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
 *
 */
type httpStatus = {
  [key: number]: string
}
const errorMessage: httpStatus = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

const defaultHeaders = {
  'Content-Type': 'Application/json',
  environment: '1',
  source: '99',
  site: import.meta.env.OUT_SITEID.toString(),
}

const requestLanguageMaps = {
  'zh-CN': 'zh',
  'en-US': 'en',
  'ko-KR': 'ko',
}

const getCurrentLocale = () => {
  if (typeof window === 'undefined') {
    return 'zh-CN'
  }

  const candidates = [
    window.localStorage?.getItem('umi_locale'),
    window.localStorage?.getItem('locale'),
    window.localStorage?.getItem('lang'),
    window.navigator?.language,
  ].filter(Boolean)

  return (candidates[0] as string) || 'zh-CN'
}

/**
 * 配置request请求时的默认参数, 底层使用fetch进行请求
 */
const baseRequest = extend({
  timeout: 30 * 1000,
  headers: defaultHeaders,
  credentials: 'include', // 默认请求是否带上cookie
  // errorHandler
})

// 请求拦截器
baseRequest.interceptors.request.use(
  (url: string, options: RequestOptionsInit): { url: string; options: RequestOptionsInit } => {
    // 判断是否有权限
    const { getAuth } = useAuth()
    const authInfo = getAuth() || {}
    const { userId, memberId } = authInfo
    const accessToken = authInfo.accessToken || authInfo.token
    const headers: Record<string, any> = {
      // 强制中文；开放多语言时改回 requestLanguageMaps[getCurrentLocale() as any] || 'zh'
      'Accept-Language': 'zh-CN',
      ...options.headers,
    }
    if (userId !== undefined && userId !== null) {
      headers.userId = userId
    }
    if (memberId !== undefined && memberId !== null) {
      headers.memberId = memberId
    }
    if (accessToken) {
      headers.token = accessToken
      headers.accessToken = accessToken
    }
    return {
      // 前缀如果已经带上api, 跳过自动补前缀
      url: url.startsWith('/api') ? url : basePrefix + url,
      options: {
        ...options,
        headers,
      },
    }
  },
)

// 响应拦截器
baseRequest.interceptors.response.use((response: Response, options: RequestOptionsInit) => {
  return response
})

// 请求中间件
baseRequest.use(async (ctx: Context, next: () => void) => {
  await next()
})

/**
 * 公共请求层
 */
class ApiRequest {
  createRequest<T>(url: string, options: IApiRequest = { ctlType: 'none' }): Promise<IRequestSuccess<T>> {
    return new Promise((resolve, reject) => {
      baseRequest<IRequestSuccess<T>>(url, options)
        .then((res) => {
          // 登录验证
          if (res.code === 1101) {
            // if (isDev) {
            //   return ;
            // }
            removeAuth()
            removeRouters()
            // window.location.replace('/login')
            message.destroy()
            message.error(res.message)
            return false
          }

          // 统一拦截 参数校验错误，显示后端返回的状态信息
          // @todo 这里不需要国际化
          if (res.code === 1102) {
            message.error(res.message)
            reject(res)
            return false
          }

          if (res.code === 1000) {
            if (options.ctlType === 'message') {
              message.destroy()
            }
            options.ctlType === 'message' && message.success(res.message)
            resolve(res)
          } else {
            resolve(res)
            options.ctlType === 'message' && message.error(res.message)
          }
        })
        .catch((err) => {
          // http错误处理， 直接透传
          reject(err)
        })
    })
  }
}
export default new ApiRequest().createRequest
