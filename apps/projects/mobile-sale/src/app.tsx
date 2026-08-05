import React, { Component, PropsWithChildren } from 'react'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { init } from '@linkseeks/i18n'
import { localeResource } from '@/locales'
import { LANGUAGE } from '@/constants/storage'
import { StoreProvider } from './store/useStores'
import Store from './store'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    const presetI18n = async () => {
      const language = await getAsyncStorage(LANGUAGE)
      const { i18n: _i18n } = await init(language?.key)
      Object.keys(localeResource).forEach((key) => {
        // 新版本的国际化载入
        const newResource = localeResource[key]

        _i18n.addResourceBundle(key.replace('_', '-'), 'translation', newResource)
      })
    }
    presetI18n()
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return <StoreProvider store={Store as any}>{this.props.children}</StoreProvider>
  }
}

export default App
