import { Api, ApiRequestConfig, ResponseDataInstanceConfig } from '@linkseeks/request'
import { RouterManager, Router } from '@linkseeks/router-manager'
import { message } from 'antd'

const ADMIN_ADAPTER = {
  headers: {
    source: '99',
    environment: '1',
    site: '1',
    'Accept-Language': 'zh-CN',
  },
}
/**
 * 能力中心,平台后台
 */
export const request = new Api(ADMIN_ADAPTER)

export interface IApiRequest extends ApiRequestConfig {}

// 临时的方法
const getAuth = () => {
  try {
    const localAuth = window.localStorage.getItem('auth')
    return localAuth ? JSON.parse(localAuth) : {}
  } catch (error) {
    return {}
  }
}

const removeAuth = () => {
  try {
    window.localStorage.removeItem('auth')
  } catch (error) {
    return {}
  }
}

const routerManager = Router
request.interceptors.request.use((config) => {
  // @todo 方法未完成
  // const { userId, memberId, token } = getCookieAuth() || {}
  try {
    const { userId, memberId, token } = getAuth()
    if (config.headers) {
      if (userId) {
        config.headers.userId = userId
      }

      if (token) {
        config.headers.token = token
      }

      if (memberId) {
        config.headers.memberId = memberId
      }
    }
    return config
  } catch (err) {
    console.log(err)
  }
  const { userId, memberId, token } = getAuth()
  if (config.headers) {
    if (userId) {
      config.headers.userId = userId
    }

    if (token) {
      config.headers.token = token
    }

    if (memberId) {
      config.headers.memberId = memberId
    }
  }
  return config
})

request.interceptors.response.use((response) => {
  const { code, message: msg, ctlType, penetrateError } = response as unknown as ResponseDataInstanceConfig
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
    case 1101: {
      // @todo 跳转登录逻辑
      // logoutLogin()
      // location.replace('/user/login')
      routerManager.goLogin()
      removeAuth()
      message.destroy()
      message.error(msg)
      return Promise.reject(response)
    }

    // case 1102: {
    // 	message.error(msg)
    // 	return Promise.reject(msg)
    // }

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
})

export default request.fetch.bind(request)
