import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

/**
 * 商城类型
 */
export const MALL_TYPE = {
  1: intl.formatMessage({ id: 'own.mall.type_1' }),
  2: intl.formatMessage({ id: 'own.mall.type_2' }),
  3: intl.formatMessage({ id: 'own.mall.type_3' }),
  4: intl.formatMessage({ id: 'own.mall.type_4' }),
  5: intl.formatMessage({ id: 'own.mall.type_5' }),
  6: intl.formatMessage({ id: 'own.mall.type_6' }),
  7: intl.formatMessage({ id: 'own.mall.type_7' }),
  8: intl.formatMessage({ id: 'own.mall.type_8' }),
  9: intl.formatMessage({ id: 'own.mall.type_9' }),
}

/**
 * 商城环境
 */
export const MALL_ENV = {
  1: 'WEB',
  2: 'H5',
  3: intl.formatMessage({ id: 'shop.template.environment.status_3' }),
  4: 'APP',
}

/**
 * 商城环境-字体颜色样式
 */
export const ENV_COLOR = {
  1: '#007BFC',
  2: '#007BFC',
  3: '#EB9B00',
  4: '#00A98F',
}

/**
 * 商城环境-背景颜色样式
 */
export const ENV_BG_COLOR = {
  1: '#E9F3FF',
  2: '#E9F3FF',
  3: '#FFF8EB',
  4: '#EBF9F6',
}

/**
 * 商城属性
 */
export const MALL_PROPERTY = {
  1: intl.formatMessage({ id: 'own.mall.property_1' }),
  2: intl.formatMessage({ id: 'own.mall.property_2' }),
  3: intl.formatMessage({ id: 'own.mall.property_3' }),
  4: intl.formatMessage({ id: 'own.mall.property_4' }),
}

/**
 * 是否默认
 */
export const IS_DEFAULT = {
  0: intl.formatMessage({ id: 'common.button.no' }),
  1: intl.formatMessage({ id: 'common.button.yes' }),
}

/**
 * 状态
 */
export const STATE_TYPE = {
  0: intl.formatMessage({ id: 'common.status.invalid' }),
  1: intl.formatMessage({ id: 'common.status.effective' }),
}
