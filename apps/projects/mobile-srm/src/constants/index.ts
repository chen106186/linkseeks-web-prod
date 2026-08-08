/**
 * 做一些常量的定义
 * 目前确定需要定义
 * Style - 整体项目样式
 */
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * 当前项目标识
 */
export const ENVIRONMENT = {
  WEB: 1,
  H5: 2,
  XCX: 3,
  APP: 4,
}

/**
 * 当前项目所处环境
 */
export const IS_H5_ENV = process.env.TARO_ENV === 'h5'
export const IS_WEAPP_ENV = process.env.TARO_ENV === 'weapp'

/** 价格单位符号 */
export const PRICE_SYMBOL = intl.formatMessage({ id: 'currency' })

/**
 * localStorage 当前用户选择的商城id 与站点id
 */
export const SHOP_AND_SITE = 'SHOP_AND_SITE'

/**
 * 登录存储的用户信息
 */
export const USER_INFO = 'USER_INFO'

/**
 * TOKEN 信息
 */
export const TOKEN = 'TOKEN'

/**
 * 微信sdk appId
 * 注意这里要跟xcode -> target -> info -> urlType -> URL Schemas 保持一致
 */
export const WECHAT_APPID = 'wx3b85559c554a9f56'

/**
 *  微信开放平台注册得到的app secret
 */
export const WECHAT_APP_SECRET = '7d3b063b1361f4a6ca5b68b63d774247' // 微信开放平台注册得到的app secret

/**
 * 微信商户ID
 */
export const WECHAT_MERCHANTID = '1431199002' // 微信商户ID

/**
 * 商户秘钥
 */
export const WECHAT_TRANS_SECRET = ''

/**
 * 七鱼客服中间h5页面，以部署的h5地址为准(小程序正式环境下需配置域名以及配置小程序白名单)
 */
export const QIYU_H5_URL = 'http://10.0.0.17:8111'
