/**
 * **********
 * 脚本注入全局配置
 * **********
 */

import SELF_CONFIG from '../../../base.config.json'
import { RootObject } from './global'

interface newRootObject extends RootObject {
  appMallInfo: any,
  pointMallId: number | undefined,
  channelPointMallId: number | undefined,
}

export const checkUrl = (url: any, defaultUrl: any) => {
  if (url && typeof url === 'string') {
    if (url.indexOf('/') > -1) {
      return url.trim()
    }
    return `/${url}`.trim()
  }
  return defaultUrl
}

const appMallInfo = SELF_CONFIG.web.shopInfo.filter(item => item.environment === 4 && item.type === 1)[0] // app企业商城

const pointMallInfo = SELF_CONFIG.web.shopInfo.filter(item => item.environment === 4 && item.type === 2)[0] // app积分商城

const channelPointMallInfo = SELF_CONFIG.web.shopInfo.filter(item => item.environment === 4 && item.type === 5)[0] // app渠道积分商城

//@ts-ignore
SELF_CONFIG.appMallInfo = appMallInfo // app企业商城信息
//@ts-ignore
SELF_CONFIG.pointMallId = pointMallInfo ? pointMallInfo.id : undefined
//@ts-ignore
SELF_CONFIG.channelPointMallId = channelPointMallInfo ? channelPointMallInfo.id : undefined

//@ts-ignore
export const GlobalConfig: newRootObject = SELF_CONFIG
