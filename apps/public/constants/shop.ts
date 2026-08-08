import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/**  1.WEB 2.H5 3.小程序 4.APP */

/** WEB */
export const WEB = 1

/** h5 */
export const H5 = 2

/** 小程序 */
export const APPLETS = 3

/** APP */
export const APP = 4

/** 商城环境类型对应名称 */
export const ENVIRONMENT_NAME = {
  [WEB]: 'WEB',
  [H5]: 'H5',
  [APPLETS]: translate('web.common.xiaochengxu', { defaultMessage: '小程序' }),
  [APP]: 'APP',
}

/**
 * 商城类型
 */
export enum SHOP_TYPE_ENUM {
  /** 企业商城 */
  ENTERPRISE = 1,
  /** 采购门户 */
  PURCHASE,
  /** 物流服务门户 */
  LOGISTICS,
  /** 加工门户服务 */
  PROCESS,
  /** 行情资讯门户 */
  INFOMATION,
  /** 平台主门户 */
  MAIN_PORTAL,
  /** 积分商城 */
  SCORE,
}

export const ENVIRONMENT_TYPE = {
  1: {
    name: 'web',
    background: '#ECF2FE',
    color: '#4787F0',
  },
  2: {
    name: 'H5',
    background: '#F3E8F9',
    color: '#9963D8',
  },
  3: {
    name: translate('web.common.xiaochengxu', { defaultMessage: '小程序' }),
    background: '#EBF9F6',
    color: '#00A98F',
  },
  4: {
    name: 'APP',
    background: '#FFF8E8',
    color: '#E8A044',
  },
}

const propertyText = (text: string) => {
  return `${text}${translate('web.common.duan')}`
}

/**
 * 商城属性
 */
export const PROPERTY_TYPE = {
  1: propertyText('B'),
  2: propertyText('C'),
  3: propertyText('B'),
  4: propertyText('C'),
}
