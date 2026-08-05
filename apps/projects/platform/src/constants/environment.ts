import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
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

export const enumName = {
  [WEB]: 'WEB',
  [H5]: 'H5',
  [APPLETS]: intl.formatMessage({ id: 'shop.template.environment.status_3' }),
  [APP]: 'APP',
}

export const environmentList = [
  {
    label: 'WEB',
    value: WEB,
  },
  {
    label: 'H5',
    value: H5,
  },
  {
    label: intl.formatMessage({ id: 'shop.template.environment.status_3' }),
    value: APPLETS,
  },
  {
    label: 'APP',
    value: APP,
  },
]

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
    name: intl.formatMessage({ id: 'shop.template.environment.status_3' }),
    background: '#EBF9F6',
    color: '#00A98F',
  },
  4: {
    name: 'APP',
    background: '#FFF8E8',
    color: '#E8A044',
  },
}

/**
 * 商城环境选项
 * 适用环境: 0.所有 1.WEB 2.H5 3.小程序 4.APP
 */
export const ENVIRONMENT_OPTIONS = [
  {
    key: '0',
    label: intl.formatMessage({
      id: 'common.text.all',
      defaultMessage: '全部',
    }),
  },

  {
    key: '1',
    label: 'WEB',
  },
  {
    key: '2',
    label: 'H5',
  },
  {
    key: '3',
    label: intl.formatMessage({
      id: 'shop.template.environment.status_3',
      defaultMessage: '小程序',
    }),
  },
  {
    key: '4',
    label: 'APP',
  },
]

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
