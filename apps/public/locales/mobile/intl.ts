import { useIntl, getIntl, FormatMessageOptions } from '@linkseeks/i18n'
import { useMemoizedFn } from '@linkseeks/hooks'
import { LanguageKeys } from './types'
import { createLocaleExtension } from './extension'
// 以zh_CN为最全的载体去渲染

/**
 * Mobile端的国际化渲染
 */
export const useMobileIntl = () => {
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
export const getMobileIntl = () => {
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
