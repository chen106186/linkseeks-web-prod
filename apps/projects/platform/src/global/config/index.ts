/**
 *
 * **********
 * 脚本注入全局配置
 *
 * **********
 */

import { RootObject } from '@feature/paas'
import PASS_CONFIG from '../../../../../public/fixed/base.config.json'

const config: any = PASS_CONFIG

interface NewRootObject extends RootObject {
  getSelfMallUrl: () => string
}

export const getShopInfoById = (shopId: number) => {
  return config.web.shopInfo.filter((item) => item.id === shopId)[0]
}

export const getSelfMallUrl = () => {
  const selfMallItem = config.web.shopInfo.filter(
    (item) => item.environment === 1 && item.property === 3 && item.self === 1 && item.isDefault === 1,
  )[0]
  return selfMallItem ? selfMallItem?.url : 'own'
}

export const GlobalConfig: NewRootObject = config
