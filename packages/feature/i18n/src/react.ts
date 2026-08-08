import { useTranslation, getI18n } from 'react-i18next'

export interface FormatMessageOptions {
  id: string
  defaultMessage?: string
  [key: string]: any
}

export const I18N_LIBRARY_KEY = 'translation'
export const useIntl = () => {
  return getIntl()
  const translation = useTranslation(I18N_LIBRARY_KEY)
  return {
    formatMessage: ({ id, defaultMessage, ...reset }: FormatMessageOptions) => {
      return translation.t(id, { defaultValue: defaultMessage, ...reset })
    },
    i18n: translation.i18n,
  }
}

export const getIntl = () => {
  const i18n = getI18n()
  const win: any = typeof window !== 'undefined' ? window : {}
  if (!win.i18n) {
    win.i18n = i18n
  }
  return {
    formatMessage: ({ id, defaultMessage, ...reset }: FormatMessageOptions) => {
      return win.i18n?.t(id, { defaultValue: defaultMessage, ...reset })
    },
    i18n: win.i18n,
  }
}
