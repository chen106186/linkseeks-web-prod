import i18next, { InitOptions } from 'i18next'
import { setI18n, initReactI18next } from 'react-i18next'
import ChainedBackend from 'i18next-chained-backend'
import Backend from 'i18next-http-backend'
const defaultLng = 'zh-CN'

const i18n = i18next.createInstance({
  // 默认语言
  fallbackLng: defaultLng,
  // @ts-ignore
  // debug: process.env.NODE_ENV !== 'production',
  interpolation: {
    escapeValue: false,
  },
})

/**
 * 初始化国际化
 */
export const init = async (locale?: string, config: InitOptions = {}) => {
  const formatMessage = await i18n
    .use(ChainedBackend)
    .use(Backend)
    .use(initReactI18next)
    .init({
      resources: {},
      lng: locale || defaultLng,
      fallbackLng: defaultLng,
      ...config,
    })
  setI18n(i18n)
  return {
    i18n,
    formatMessage,
  }
}
