import { Api, ApiRequestConfig, ResponseDataInstanceConfig } from '@linkseeks/request'
import { message } from 'antd'
import { authService } from '@apps/services'
import useAuth from '@apps/services/auth/useAuth'
import { getMemberRefreshToken } from '@apps/apis'
import { localesStorage } from '@linkseeks/storage'
import { encodeURLBase64 } from '@linkseeks/crypto'
import { history } from '@linkseeks/router-manager'
import { getQueryStringParams } from '@apps/utils'
import { getEnv } from '@apps/utils/src/env'
console.log('我是web', process.env.OUT_TERMINAL)
const Header_ADAPTER = {
  headers: {
    source: process.env.OUT_SOURCE,
    environment: '1',
    'Accept-Language': 'zh-CN',
  },
}
/**
 * 能力中心,平台后台
 */
export const request = new Api(Header_ADAPTER)

export interface IApiRequest extends ApiRequestConfig {}

/** 是否商城 */
const IS_MALL = process.env.OUT_TERMINAL === 'mall'

interface PendingTask {
  config: ApiRequestConfig
  resolve: Function
}
// token续签状态
let refreshing = false
const queue: PendingTask[] = []
const REFRESH_TONE_API = '/api/member/refreshToken'
// token续签次数
let refreshCount = 0

request.interceptors.request.use((config) => {
  const t = getQueryStringParams(window.location.href, 't')

  const source = getQueryStringParams(window.location.href, 'source')
  // @todo 方法未完成
  // const { userId, memberId, token } = getCookieAuth() || {}
  const { getAuth } = useAuth()

  try {
    const authInfo = getAuth()
    const language = localesStorage.getItem()
    // 注意 平台后台不需要国际化
    if (language && process.env.OUT_SOURCE != '99') {
      config.headers['Accept-Language'] = language
    }

    if (process.env.OUT_IM) {
      if (t) {
        config.headers.accessToken = t
      } else {
        message.error('没有传递身份标识参数')
      }
      if (source) {
        config.headers.source = source
      }
      return config
    }
    if (config.headers && authInfo) {
      const { accessToken } = authInfo
      if (accessToken) {
        config.headers.accessToken = accessToken
      }
    }

    return config
  } catch (err) {
    console.log(err)
  }

  return config
})

request.interceptors.response.use(
  async (response) => {
    const {
      code,
      message: msg,
      ctlType,
      responseType,
      penetrateError = true,
      response: successResponse,
    } = response as unknown as ResponseDataInstanceConfig
    const { removeAuth } = useAuth()
    const { config } = successResponse

    if (responseType === 'blob') {
      return response
    }
    switch (code) {
      case 1000: {
        if (ctlType === 'message') {
          // logoutLogin()
          message.destroy()
          // @todo 国际化处理
          // message.success(intl.formatMessage({ id: code }) || msg)
          message.success(msg)
        }
        break
      }

      // 1208 该状态码和1101功能一致
      case 1208:
      /**
       * 登录验证
       */

      case 1204:

      case 1101: {
        if (process.env.OUT_IM) {
          removeAuth()
          message.destroy()
          message.error(msg)
          return Promise.reject(response)
        }
        if (config.url !== REFRESH_TONE_API) {
          if (refreshing) {
            return new Promise((resolve) => {
              queue.push({
                config,
                resolve,
              })
            })
          }
          refreshing = true
          const res = await refreshToken()
          refreshing = false
          if (res.code === 1000) {
            queue.forEach(({ config, resolve }) => {
              resolve(request.fetch(config.url!, config))
            })
            return request.fetch(config.url!, config) as Promise<any>
          }

          removeAuth()
          const LoginUrl = IS_MALL
            ? `/user/login?redirect=${encodeURLBase64(encodeURIComponent(String(location)))}`
            : '/user/login'
          history.replace(LoginUrl, IS_MALL ? getEnv('MEMBER_URL') : '')
          message.destroy()
          message.error(msg)
          return Promise.reject(response)
        } else {
          return response
        }
      }
      /**
       * 没有匹配上，则默认为报错
       */
      default: {
        if (ctlType === 'message') {
          message.destroy()
          message.error(msg)
        }

        return penetrateError ? response : Promise.reject(response)
      }
    }
    return response
  },
  async (error) => {
    console.log(error, 'error')
  },
)

/**
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise((resolve) => {
    refreshCount += 1
    const { getAuth } = useAuth()
    const { accessToken, refreshToken } = getAuth() || {}
    const headers = {
      accessToken,
      refreshToken,
    }

    getMemberRefreshToken({}, { headers })
      .then((res) => {
        // 更新token信息
        if (res.code === 1000) {
          authService.setAuth(res.data)
        }
        // 防止接口出错无限刷新token
        if (refreshCount > 1) {
          resolve({
            code: 1001,
            message: '登录过期',
          })
        } else {
          resolve(res)
        }
      })
      .catch(() => {
        resolve({
          code: 1001,
          message: '登录过期',
        })
      })
  })
}

export default request.fetch.bind(request)
