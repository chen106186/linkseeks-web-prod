/**
 *
 * **********
 * 脚本注入全局配置
 *
 * **********
 */

import { RootObject } from '@feature/paas'
import PASS_CONFIG from '../../../../../public/fixed/base.config.json'

interface GlobalConfigType extends RootObject {
  srmMallId: number | undefined
}

const config: any = PASS_CONFIG

const getSrmdMallId = () => {
  const shopInfo = PASS_CONFIG.web.shopInfo
  const webMallList = shopInfo.filter((item: any) => item.type === 6)
  if (webMallList && webMallList.length > 0) {
    const mallItem = webMallList[0]
    return mallItem.id
  }
  return undefined
}

config.srmMallId = getSrmdMallId()

export const GlobalConfig: GlobalConfigType = config
