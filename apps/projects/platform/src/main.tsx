import React, { ReactNode, FC, useEffect, useState } from 'react'
import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@linkseeks/router-core'
import { localesStorage } from '@linkseeks/storage'
import { I18nextProvider, i18n, init } from '@linkseeks/i18n'
import * as locales from '@/locales'
import * as newLocales from '@apps/locales/web'
import { RootContainer, useGlobal } from '@apps/container'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import koKR from 'antd/es/locale/ko_KR'
import zhTW from 'antd/es/locale/zh_TW'
// 如果时间组件有国际化问题可以放开这个注释
// import 'moment/dist/locale/zh-cn'
// import 'moment/dist/locale/en-au'
// import 'moment/dist/locale/ko'
// 全局注册虚拟组件
import '@/components/NiceForm/public'
import { setup } from '@apps/formily'
setup()
import { Loading } from '@apps/components'
import MobxProvider from './store'
import '@apps/styles/libs/index'
import './global.less'

export interface ContainerProps {
  children?: ReactNode
}

export interface I18nProps {
  i18n: i18n
}

const locale = localesStorage.getItem()
export const I18nProvider = (props: any) => {
  const { children } = props
  const [_i18n, setI18n] = useState<i18n>({} as any)
  // const { appLoading, incrementCounter } = useGlobal()

  const presetI18n = async () => {
    const { i18n } = await init(locale)
    Object.keys(newLocales).forEach(async (key) => {
      const resource = locales[key]
      // 新版本的国际化载入
      const newResource = newLocales[key]

      i18n.addResourceBundle(key.replace('_', '-'), 'translation', { ...resource, ...newResource })
    })
    // incrementCounter()
    setI18n(i18n)
  }

  useEffect(() => {
    presetI18n()
  }, [])

  return <I18nextProvider i18n={_i18n}>{children}</I18nextProvider>
}

const localMap = {
  'zh-CN': {
    ...zhCN,
    DatePicker: {
      ...zhCN.DatePicker,
      lang: {
        ...zhCN.DatePicker?.lang,
        shortWeekDays: ['日', '一', '二', '三', '四', '五', '六'],
        shortMonths: [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ],
      },
    },
  },
  'en-US': enUS,
  'ko-KR': {
    ...koKR,
    Text: {
      edit: '수정',
      copy: '복사',
      copied: '복사 됨',
      expand: '확장',
    },
    Image: {
      preview: '미리보기',
    },
  },
  'zh-TW': zhTW,
}

const Container: FC<ContainerProps> = (props) => {
  const Provider = React.createElement(
    I18nProvider,
    null,
    <MobxProvider>
      <ConfigProvider locale={localMap[locale || 'zh-CN']}>
        <RouterProvider options={{ loading: <Loading /> }} />
      </ConfigProvider>
    </MobxProvider>,
  )

  return <RootContainer container={Provider} />
}

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(<Container />)
