import { useEffect, useState } from 'react'
import { localesStorage } from '@linkseeks/storage'
import { ConfigProvider } from 'antd'
import { I18nextProvider as GlobalI18nextProvider, i18n as globalI18n, init } from '@linkseeks/i18n'
import { I18nextProvider } from 'react-i18next'
import '@apps/styles/libs/index'
import '@/theme/style/colors.less'
import '@/theme/style/common.less'
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import koKR from 'antd/lib/locale/ko_KR'
import zhTW from 'antd/lib/locale/zh_TW'
import i18n from '@/utils/i18n'
import * as locales from '@apps/locales/web'

export type LangType = 'zh_CN' | 'en_US' | 'ko_KR' | 'zh-TW'
type AntdLangType = 'zh-CN' | 'en-US' | 'ko-KR' | 'zh-TW'

const I18nProvider = (props: any) => {
  const { children, language } = props
  const locale = language || localesStorage.getItem()
  const [loading, setLoading] = useState<boolean>(
    process.env.OUT_MALL_ONLY_CLIENT ? true : import.meta.env.DEV ? true : false,
  )
  const [_i18n, setI18n] = useState<globalI18n>({} as any)

  const presetI18n = async () => {
    const resources = {}
    Object.keys(locales).forEach((key) => {
      const resource = locales[key as LangType]
      resources[key.replace('_', '-')] = {
        translation: resource,
      }
    })
    const { i18n } = await init(locale, {
      resources,
    })

    setI18n(i18n)
    setLoading(false)
  }

  useEffect(() => {
    presetI18n()
  }, [])

  const localMap = {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ko-KR': koKR,
    'zh-TW': zhTW,
  }

  return !loading ? (
    <ConfigProvider locale={localMap[locale as AntdLangType] || zhCN}>
      <GlobalI18nextProvider i18n={_i18n}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </GlobalI18nextProvider>
    </ConfigProvider>
  ) : null
}

export default I18nProvider
