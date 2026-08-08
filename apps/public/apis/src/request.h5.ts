import { Api, ApiRequestConfig, ResponseDataInstanceConfig } from '@linkseeks/request'
import {
  getCurrentInstance,
  getStorageSync,
  setStorageSync,
  redirectTo,
  showToast,
  navigateTo,
  removeStorageSync,
} from '@tarojs/taro'
import { getIntl, getI18n } from '@linkseeks/i18n'
import { getMemberRefreshToken } from '@apps/apis'
import { REQUEST_LANGUAGE_MAPS } from './constant'
import { getLocalMallInfo } from '@apps/mobile-services/hooks/useEnterShopInfo'

console.log('我是h5')
const Header_ADAPTER = {
  headers: {
    'Content-Type': 'application/json',
    source: 2,
    environment: 2,
    site: 1,
  },
  adapter: 'xhr',
}

/**
 * h5
 */
export const request = new Api(Header_ADAPTER)

export interface IApiRequest extends ApiRequestConfig {}

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
  const {
    router: {
      params: { routerShopId, t: remoteToken },
    },
  } = getCurrentInstance()

  const userInfo = JSON.parse(getStorageSync('USER_INFO') || '{}')
  const shopInfo = getLocalMallInfo()

  /**
   * 当url上携带t参数时，可通过链接上获取token， 优先级高于本地token
   */
  if (userInfo?.accessToken || remoteToken) {
    config.headers['accessToken'] = remoteToken || userInfo.accessToken
  }
  const shopId = config?.headers?.shopId || shopInfo?.id || routerShopId
  if (shopId) {
    config.headers['shopId'] = shopId
  }

  if (config.method) {
    config.method = config.headers['method'] = config.method.toLocaleUpperCase()
  } else {
    config.method = config.headers['method'] = 'GET'
  }
  config.headers['showError'] = config?.showError

  const _language = getI18n()?.language
  config.headers['Accept-Language'] = _language ? _language : 'zh-CN'
  return config
})

request.interceptors.response.use(
  async (response) => {
    const {
      code,
      message: msg,
      ctlType,
      responseType,
      penetrateError,
      response: successResponse,
      // 不需要重定向到登录页
      noRedirectLogin = false,
    } = response as unknown as ResponseDataInstanceConfig
    const { config } = successResponse
    if (responseType === 'blob') {
      return response
    }

    switch (code) {
      // 1208 该状态码和1101功能一致
      case 1208:
      case 1101: {
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

          if (!config.noRedirectLogin) {
            removeStorageSync('TOKEN')
            removeStorageSync('USER_INFO')
            removeStorageSync('CURRENT_CHANNEL_INFO')
            // 商品分享口令生成数字
            removeStorageSync('SHARE_CODE_NUM')
            setTimeout(() => {
              navigateTo({ url: '/packages/user/pages/login/index' })
            }, 500)
          }
          return Promise.reject(response)
        } else {
          return response
        }
      }
      case 1102: {
        showToast({ title: msg, icon: 'none' })
        return Promise.reject(response)
      }

      case 1000: {
        return response
      }

      default: {
        if (code !== 1000 && msg) {
          if (response.headers.showError !== false) {
            // 切换成使用接口提示
            showToast({ title: msg, icon: 'none' })
          }
        }
        return response
      }
    }
  },
  (error) => {
    if (error && error.stack.indexOf('timeout') > -1) {
      setTimeout(() => {
        navigateTo({ url: `/packages/basicSetting/pages/network/index` })
      }, 500)
    }
  },
)

/**
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise((resolve) => {
    refreshCount += 1
    const userInfo = JSON.parse(getStorageSync('USER_INFO') || '{}')
    const { accessToken, refreshToken } = userInfo
    const headers = {
      accessToken,
      refreshToken,
    }

    getMemberRefreshToken({}, { headers })
      .then((res) => {
        // 更新token信息
        if (res.code === 1000) {
          setStorageSync('USER_INFO', JSON.stringify(res.data))
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
