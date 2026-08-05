import axios, {
  Axios,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
  RawAxiosRequestHeaders,
  AxiosRequestHeaders,
} from 'axios'
import { qs } from '@linkseeks/tools'

export type CtlType = 'none' | 'message'

// axios类型定义
export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers?: RawAxiosRequestHeaders
}
export interface AxiosResponse<T = any, D = any> {
  data: T
  status: number
  statusText: string
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig<D>
  request?: any
}

// 自定义类型定义
export interface ApiRequestConfig extends InternalAxiosRequestConfig {
  /**
   * 操作提示
   */
  ctlType?: CtlType

  /**
   * 是否需要重定向到登录页
   */
  noRedirectLogin?: boolean
  /**
   * 是否需由客户端控制返回的错误信息
   * 若为是，则全局拦截器将不对该接口的返回的code做任何处理
   * @default false
   */
  penetrateError?: Boolean
  /**
   * 是否小程序中
   */
  weapp?: boolean
}

export interface ApiResponseConfig extends AxiosResponse {
  config: ApiRequestConfig
}

export interface ResponseDataInstance<R = any> {
  data: R
  code: number
  message: string
  response: ApiResponseConfig
}

export interface ResponseDataInstanceConfig<R = any> extends ApiRequestConfig {
  data: R
  code: number
  message: string
  response: ApiResponseConfig
}

export interface interceptorsProps {
  request: AxiosInterceptorManager<ApiRequestConfig>
  response: AxiosInterceptorManager<ApiResponseConfig>
}

const basePrefix = '/api'

const defaultConfig = {
  headers: {
    'Content-Type': 'Application/json',
    'Accept-Language': 'zh-CN',
  },
}

/**
 * 初始化的API， 集成axios的功能， 需进一步封装成适合瓴犀的调用方式
 */
export class Api extends Axios {
  // interceptors: {
  //   request: AxiosInterceptorManager<ApiRequestConfig>;
  //   response: AxiosInterceptorManager<ApiResponseConfig>;
  // };

  constructor(config: ApiRequestConfig = defaultConfig as any) {
    super(config)
    /**
     * 对config做一层初始化操作
     */
    config.headers = {
      ...config.headers,
      ...defaultConfig.headers,
    } as unknown as AxiosRequestHeaders

    config.responseType = 'json'

    // 所有请求不再携带cookie
    config.withCredentials = false

    // axios在0.21.2版本之后，就算指定了responseType为json，也不会自动把响应数据转化为js 对象格式，需要自行转化
    // https://github.com/axios/axios/issues/4123
    /** @edit 兼容Blob类型数据返回 */
    config.transformResponse = (data) => {
      try {
        // 临时方案判断是否带有weapp，有就直接返回
        if (config.weapp) {
          return JSON.parse(data)
        } else {
          return data instanceof Blob ? data : JSON.parse(data)
        }
      } catch (err) {
        console.error(`服务端返回数据异常 -> ${err}`, config)
        return {}
      }
    }
    //@ts-ignore
    // 自行创建Axios实例的时候, 需要手动补充一个函数式
    // https://github.com/axios/axios/issues/3568
    config.transformRequest = [...axios.defaults.transformRequest]
    this.registerRequestInterceptor()
    this.registerResponseInterceptor()
  }

  private registerRequestInterceptor() {
    this.interceptors.request.use((config) => {
      config.headers = {
        ...defaultConfig.headers,
        ...config.headers,
      } as unknown as AxiosRequestHeaders
      // 这个paramsSerializer的改写难以理解
      config.paramsSerializer = {
        serialize: (params) => {
          if (config.method === 'GET' || config.method === 'get') {
            return qs.stringify(params, { arrayFormat: 'comma' })
          }
          return qs.stringify(params, { arrayFormat: 'indices' })
        },
      }
      // config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'indices' })
      if (!config.weapp) {
        config.url =
          (config.url as string).startsWith('/api') && !config.useApiPrefix ? config.url : basePrefix + config.url
      }
      return config
    })
  }

  private registerResponseInterceptor() {
    ;(this.interceptors.response as AxiosInterceptorManager<ApiResponseConfig>).use((response) => {
      const {
        status,
        config: { data, ...config },
      } = response
      return status >= 200 && status < 400
        ? Promise.resolve({
            ...response.data,
            // fix: 完全接收业务端传入的config
            ...config,
            response,
          })
        : Promise.reject(this.errorHandler(response))
    })
  }

  /**
   * @todo
   * 错误钩子函数
   */
  private errorHandler(response: AxiosResponse) {
    throw {
      ...response,
    }
  }

  /**
   * 业务中实际请求方法
   */
  fetch<Response>(url: string, options?: ApiRequestConfig): Promise<ResponseDataInstance<Response>> {
    return this.request<Response>({
      url,
      ...options,
    }) as any
  }
}

export default Api
