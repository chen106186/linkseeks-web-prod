import { getI18n } from 'react-i18next'
import { zh_CN } from '@apps/locales/web'
import { createLocaleExtension } from '@apps/locales/web/extension'

export type LanguageKeys = keyof typeof zh_CN

export const getWebIntl = () => {
  const i18n = import.meta.env.SSR ? global.i18n : window.global.i18n

  const getMessage = (
    key: LanguageKeys,
    options?: {
      defaultMessage?: string
      [key: string]: any
    },
  ) => {
    const { defaultMessage, ...others } = options || {}
    return i18n?.t(key, { defaultValue: defaultMessage, ...others })
  }

  return createLocaleExtension(getMessage)
}
