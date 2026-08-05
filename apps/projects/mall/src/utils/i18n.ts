import i18n from 'i18next'
import { setI18n, initReactI18next } from 'react-i18next'
import ChainedBackend from 'i18next-chained-backend'
import Backend from 'i18next-http-backend'
import * as locales from '@apps/locales/web'
import { localesStorage } from '@linkseeks/storage/src/modules/i18nStorage'
import CacheManager from '@/utils/cache'

const defaultLng = CacheManager.get('language') || 'zh-CN'
const locale = localesStorage.getItem() || CacheManager.get('language')

const resources = {}
Object.keys(locales).forEach((key) => {
  const resource = locales[key]
  resources[key.replace('_', '-')] = {
    translation: resource,
  }
})

i18n
  .use(ChainedBackend)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: defaultLng,
    debug: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    resources,
    lng: locale || defaultLng,
    react: {
      useSuspense: false, // 服务端不启用 Suspense
    },
  })

// 定义全局 i18n 对象
if (typeof window !== 'undefined') {
  window.global = window.global || {}
  window.global.i18n = i18n
} else {
  global.i18n = i18n
}

setI18n(i18n)

export default i18n
