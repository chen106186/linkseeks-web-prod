import zhCN from './zh_CN'
import enUS from './en_US'
import koKR from './ko-KR'
import defaultLocale from './default'

export type LocaleCodeType = 'zh-CN' | 'en-US' | 'ko-KR'

const getLocale = (locale?: LocaleCodeType) => {
  switch (locale) {
    case 'zh-CN':
      return zhCN
    case 'en-US':
      return enUS
    case 'ko-KR':
      return koKR
    default:
      return defaultLocale
  }
}

export default getLocale
