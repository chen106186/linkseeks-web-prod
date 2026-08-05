// import {
//   extend,
//   ResponseError,
//   OnionOptions,
//   RequestOptionsInit,
//   ResponseInterceptor,
//   OnionMiddleware,
//   Context,
//   RequestMethod,
// } from 'umi-request'
// import responseCode from '@/constants/responseCode'
// import { IRequestError, IRequestSuccess } from '..'
// import { getIntl, getLocale } from 'umi'
// import { message } from 'antd'
// import { getCookieAuth, removeAuth } from './auth'
// import qs from 'qs'
// import { getCookie } from './cookie'

// export type CtlType = 'none' | 'message'
// // 根前缀请求路径
// const basePrefix = '/api'

// export interface IApiRequest extends RequestOptionsInit {
//   ctlType?: CtlType
//   // 可以用于扩展请求配置
//   extendsOptions?: RequestOptionsInit
// }

// /**
//  *
//  * umi-request文档 https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
//  *
//  */
// type httpStatus = {
//   [key: number]: string
// }

// const errorMessage: httpStatus = {
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// }

// const errorHandler = (error: ResponseError): IRequestError => {
//   console.log(error)
//   const { response } = error
//   // http状态码非200的错误处理
//   const messageText = response?.status ? errorMessage[response.status] : ''
//   if (response) {
//     message.destroy()
//     message.error('http请求错误: ' + response.status + '->' + messageText, 3)
//   } else {
//     // 请求超时， 会造成没有response
//     message.error('请求超时')
//   }
//   // throw可令响应promise走catch, 如需走resolve需直接return
//   throw {
//     message: messageText,
//     ...error,
//   }
// }

// const requestLanguageMaps = {
//   'zh-CN': 'zh',
//   'en-US': 'en',
//   'ko-KR': 'ko',
// }

// export const defaultHeaders = {
//   'Content-Type': 'Application/json',
//   source: '1',
//   environment: '1',
//   site: import.meta.env.OUT_SITEID.toString(),
// }

// /**
//  * 配置request请求时的默认参数, 底层使用fetch进行请求
//  */
// const baseRequest = extend({
//   timeout: 30 * 1000,
//   headers: defaultHeaders,
//   credentials: 'include', // 默认请求是否带上cookie
//   errorHandler,
// })

// const cache = {}

// // 请求拦截器
// baseRequest.interceptors.request.use(
//   (url: string, options: RequestOptionsInit): { url: string; options: RequestOptionsInit } => {
//     // 判断是否有权限
//     const { userId, memberId, token, memberRoleId } = getCookieAuth() || {}
//     const headers: any = {
//       'Accept-Language': requestLanguageMaps[getLocale() as any],
//       ...options.headers,
//     }
//     userId && (headers.userId = userId)
//     token && (headers.token = token)
//     memberId && (headers.memberId = memberId)
//     // memberRoleId && (headers.memberRoleId = memberRoleId)

//     options.paramsSerializer = (params) => {
//       return qs.stringify(params, { arrayFormat: 'indices' })
//     }
//     return {
//       // 前缀如果已经带上api, 跳过自动补前缀
//       url: url.startsWith('/api') ? url : basePrefix + url,
//       options: {
//         ...options,
//         headers,
//       },
//     }
//   },
// )

// // 响应拦截器
// baseRequest.interceptors.response.use((response: Response, options: RequestOptionsInit) => {
//   return response
// })

// // 请求中间件
// baseRequest.use(async (ctx: Context, next: () => void) => {
//   await next()
// })

// /**
//  * 公共请求层
//  */
// class ApiRequest {
//   createRequest<T>(url: string, options: IApiRequest = { ctlType: 'none' }): Promise<IRequestSuccess<T>> {
//     return new Promise((resolve, reject) => {
//       const intl = getIntl()

//       baseRequest<IRequestSuccess<T>>(url, options)
//         .then((res) => {
//           // 登录验证
//           if (res.code === 1101) {
//             removeAuth()
//             window.location.replace(`/user/login?redirect=${btoa(encodeURIComponent(String(window.location)))}`)
//             message.destroy()
//             message.error(res.message)
//             reject(res)
//             return false
//           }

//           // 统一拦截 参数校验错误，显示后端返回的状态信息
//           // @todo 这里不需要国际化
//           if (res.code === 1102) {
//             message.error(res.message)
//             reject(res)
//             return false
//           }

//           if (res.code === 1000) {
//             if (options.ctlType === 'message') {
//               message.destroy()
//             }
//             options.ctlType === 'message' &&
//               message.success(intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }))
//             resolve(res)
//           } else {
//             // 使用resolve将数据返回, 请求时需手动处理data为null的情况
//             resolve(res)
//             if (url != '/member/loginInfo') {
//               // 这是展示接口错误信息，任何 ctlType 都可以，不然一些 get 请求出错了
//               // 错误信息无法展示给用户
//               res.message &&
//                 options.ctlType === 'message' &&
//                 message.info(intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }))
//             }
//           }
//         })
//         .catch((err: IRequestError) => {
//           // http错误处理， 直接透传
//           reject(err)
//         })
//     })
//   }
// }
// export default new ApiRequest().createRequest
