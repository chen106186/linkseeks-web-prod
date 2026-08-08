import React, { ReactNode, FC, useEffect, useState } from 'react'
import { ConfigProvider } from 'antd'
import ReactDOM from 'react-dom'
import { RouterProvider } from '@linkseeks/router-core'
import { localesStorage } from '@linkseeks/storage'
import './components/TUIKit/locales'
import { RootContainer } from '@apps/container'
import zhCN from 'antd/es/locale/zh_CN'
import enUS from 'antd/es/locale/en_US'
import koKR from 'antd/es/locale/ko_KR'
import zhTW from 'antd/es/locale/zh_TW'
// 如果时间组件有国际化问题可以放开这个注释
// import 'moment/dist/locale/zh-cn'
// import 'moment/dist/locale/en-au'
// import 'moment/dist/locale/ko'
import { Loading } from '@apps/components'
import '@apps/styles/libs/index'
import './global.less'
export interface ContainerProps {
  children?: ReactNode
}

export interface I18nProps {}

const locale = localesStorage.getItem()
export const I18nProvider = (props: any) => {
  return props.children
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
    <ConfigProvider locale={localMap[locale || 'zh-CN']}>
      <RouterProvider options={{ loading: <Loading /> }} />
    </ConfigProvider>,
  )

  return <RootContainer providerCounter={1} container={Provider} />
}

ReactDOM.render(<Container />, document.getElementById('root'))
