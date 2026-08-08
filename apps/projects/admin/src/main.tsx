import { ConfigProvider } from 'antd'
import React, { ReactNode, FC, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { RouterProvider } from '@linkseeks/router-core'
import { I18nextProvider, i18n, init } from '@linkseeks/i18n'
import * as locales from '@/locales'
import * as newLocales from '@apps/locales/web'
import { RootContainer, useGlobal } from '@apps/container'
import '@apps/styles/libs/index'
import zhCN from 'antd/es/locale/zh_CN'
// 全局注册虚拟组件
import '@/components/NiceForm/public'
import { setup } from '@apps/formily'
setup()
import { Loading } from '@apps/components'
import MobxProvider from './store'
import './global.less'

export interface ContainerProps {
  children?: ReactNode
}

export interface I18nProps {
  i18n: i18n
}

export const I18nProvider = (props: any) => {
  const { children } = props
  const [_i18n, setI18n] = useState<i18n>({} as any)
  // const { appLoading, incrementCounter } = useGlobal()

  const presetI18n = async () => {
    const { i18n } = await init()

    Object.keys(locales).forEach((key) => {
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
}

const Container: FC<ContainerProps> = (props) => {
  const Provider = React.createElement(
    MobxProvider,
    null,
    <I18nProvider>
      <ConfigProvider locale={localMap['zh-CN']}>
        <RouterProvider options={{ loading: <Loading /> }} />
      </ConfigProvider>
    </I18nProvider>,
  )

  return <RootContainer providerCounter={1} container={Provider} />
}

ReactDOM.render(<Container />, document.getElementById('root'))
