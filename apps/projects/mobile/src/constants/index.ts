/**
 * 做一些常量的定义
 */
import { LINGXI_MINI_OSS_DOMAIN, getOssUrlPath } from '@apps/constants'
import { getEnv } from '@apps/mobile-services/utils/taro'

/**
 * 当前运行环境
 */
export const CURRENT_ENV = getEnv()

/**
 * 是否h5
 * 目前只做h5和微信小程序
 */
export const IS_WEB = CURRENT_ENV === 'WEB'

/**
 * 当前环境 1pc 2h5 3小程序 4app
 */
export const ENVIRONMENT = IS_WEB ? '2' : '3'

/**
 * 微信sdk appId
 * 注意这里要跟xcode -> target -> info -> urlType -> URL Schemas 保持一致
 */
export const WECHAT_APPID = 'wx3b85559c554a9f56'

/**
 * 这里需要微信开发者设置一应， 即APPID  配置
 * 安卓不需要这个地址，但ios 必填
 */
export const WECHAT_UNIVERSALLINK = 'https://lingxi/app/'

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

/**
 * 公众号 appId
 */
// export const OFFICIAL_ACCOUNT_APPID = "wxebcc581b9c70d299";
export const OFFICIAL_ACCOUNT_APPID = 'wx157e57abc461fd20'

/**
 * 公众号 appSecret
 */
export const OFFICIAL_ACCOUNT_SECRET = '4150b98e3eb926cc00f10c15d13d37a3'

/**
 * 存放静态资源oss域名
 */
export const OSS_DOMAIN = LINGXI_MINI_OSS_DOMAIN

/**
 * 注册来源
 */
export enum REGISTER_SOURCE_TYPE {
  /**
   * WEB企业商城申请 - 1
   */
  FROM_ENTERPRISE_WEB_SHOP = 1,

  /**
   * H5企业商城申请 - 2
   */
  FROM_ENTERPRISE_H5_WEB_SHOP = 2,

  /**
   * APP企业商城申请 - 3
   */
  FROM_ENTERPRISE_APP_SHOP = 3,

  /**
   * 小程序企业商城申请 - 4
   */
  FROM_ENTERPRISE_MINI_APP = 4,

  /**
   * WEB积分商城申请 - 5
   */
  FROM_ENTERPRISE_WEB_SCORE_SHOP = 5,

  /**
   * H5积分商城申请 - 6
   */
  FROM_ENTERPRISE_H5_SCORE_APP = 6,

  /**
   * APP积分商城申请 - 7
   */
  FROM_ENTERPRISE_APP_SCORE_SHOP = 7,

  /**
   * 小程序积分商城申请 - 8
   */
  FROM_ENTERPRISE_MINI_SCORE_APP = 8,

  /**
   * 平台代录入注册 - 9
   */
  FROM_PLATFORM_IMPORT = 9,

  /**
   * 商户代录入注册 - 10
   */
  FROM_MERCHANT_IMPORT = 10,
}

/**
 * 默认国家代码(大中国)
 */
export const COUNTRY_PHONE_CODE = '+86'

/**
 * 默认国家手机号长度(大中国)
 */
export const COUNTRY_PHONE_LENGTH = 11

/**
 * 隐私弹窗className
 */
export const PRIVACY_POP = 'PRIVACY_POP'

export const filterIcon = getOssUrlPath('/miniprogram/assets/images/choice.png')

export type LANGUAGE_TYPE = 'zh-CN' | 'zh-TW' | 'en-US' | 'ko-KR'
