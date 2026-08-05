import { useIntl, getIntl, FormatMessageOptions } from '@linkseeks/i18n'
import { useMemoizedFn } from '@linkseeks/hooks'
import { createLocaleExtension } from './extension'
import { LanguageKeys } from './types'

/**
 * PC端的web国际化渲染
 */
export const useWebIntl = () => {
  const intl = useIntl()
  const getMessage = useMemoizedFn((key: LanguageKeys, options?: Partial<FormatMessageOptions>) => {
    return intl.formatMessage({
      id: key,
      ...options,
    })
  })

  const instance = createLocaleExtension(getMessage)

  return instance
}

/**
 * js的直接获取方式
 */
export const getWebIntl = () => {
  const intl = getIntl()
  const getMessage = (key: LanguageKeys, options?: Partial<FormatMessageOptions>) => {
    return intl.formatMessage({
      id: key,
      ...options,
    })
  }
  const instance = createLocaleExtension(getMessage)

  return instance
}
