// import { mergeRouter, RouterKeys } from '@/routes'
import { qs } from '@linkseeks/tools'
import { IS_WEB } from '../constants'
import {
  switchTab,
  reLaunch,
  navigateBack,
  redirectTo,
  navigateTo,
  getCurrentPages,
  navigateToMiniProgram,
} from './taro'

interface RouteOptions {
  params?: any
}

type MergeOptions<T> = RouteOptions & T

class RouterManager<T extends string = any> {
  static instance: any
  mergeRouter: any
  constructor() {
    if (RouterManager.instance) {
      return RouterManager.instance
    }
  }

  init(mergeRouter: any) {
    RouterManager.instance = this
    this.mergeRouter = mergeRouter
  }

  mergeParams(options: MergeOptions<Taro.navigateTo.Option>) {
    const originUrlParams = options.url.split('?')[1]
    const splitParams = originUrlParams ? qs.parse(originUrlParams) : {}
    if (options.params) {
      options.url = `${options.url}?${qs.stringify(Object.assign(splitParams, options.params))}`
    }
    return options
  }

  getRouterOption(key: T, params?: any) {
    const url = key.startsWith('root')
      ? `/${this.mergeRouter[key]}`
      : `/packages/${key.split('/')[0]}/${this.mergeRouter[key]}`
    const options = {
      url,
      params,
    }
    return this.mergeParams(options)
  }

  switchTab(urlKey: T, params?: any) {
    return switchTab(this.getRouterOption(urlKey, params) as any)
  }

  reLaunch(urlKey: T, params?: any) {
    if (IS_WEB) {
      setTimeout(() => {
        return reLaunch(this.getRouterOption(urlKey, params) as any)
      }, 500)
    } else {
      return reLaunch(this.getRouterOption(urlKey, params) as any)
    }
  }

  redirectTo(urlKey: T, params?: any) {
    if (IS_WEB) {
      setTimeout(() => {
        return redirectTo(this.getRouterOption(urlKey, params) as any)
      }, 500)
    } else {
      return redirectTo(this.getRouterOption(urlKey, params) as any)
    }
  }

  navigateTo(urlKey: T, params?: any) {
    return navigateTo(this.getRouterOption(urlKey, params))
  }

  navigateBack(Options?: MergeOptions<Taro.navigateBack.Option>) {
    return navigateBack(Options)
  }

  backToTargetRouter(urlKey: T | ({} & string)) {
    const routeUrls = getCurrentPages().map((v) => v.route)

    const targetIndex = routeUrls.indexOf(this.mergeRouter[urlKey])
    if (targetIndex !== -1) {
      return navigateBack({
        delta: routeUrls.length - targetIndex,
      })
    } else {
      console.log(routeUrls)
      throw `不能返回到${urlKey}, 因为未能在路由栈中找到`
    }
  }

  navigateToKuaiDi100(nu: string | number) {
    if (!IS_WEB) {
      navigateToMiniProgram({
        appId: 'wx6885acbedba59c14',
        path: `pages/result/result?nu=${nu}&querysource=third_xcx`,
      })
    } else {
      window.open(`https://m.kuaidi100.com/result.jsp?nu=${nu}`)
    }
  }
}

export default RouterManager
