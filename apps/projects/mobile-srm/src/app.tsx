import React, { Component } from 'react'
import { init } from '@linkseeks/i18n'
import { canIUse, getUpdateManager, showModal } from '@apps/mobile-services/utils/taro'
import { PhotoProvider, PhotoSlider } from 'react-photo-view'
import { observer } from 'mobx-react-lite'
import 'react-photo-view/dist/react-photo-view.css'
import { localeResource } from '@/locales'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { LANGUAGE } from '@/constants/storage'
import Store from './store'
import useStores, { StoreProvider } from './store/useStores'
import './app.scss'
import { isWeChat } from './utils'

class App extends Component<React.PropsWithChildren> {
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
    if (isWeChat()) {
      // 版本更新管理器
      if (canIUse('getUpdateManager')) {
        const updateManager = getUpdateManager()
        if (updateManager) {
          updateManager.onCheckForUpdate(function (res) {
            if (res.hasUpdate) {
              updateManager.onUpdateReady(function () {
                showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，是否重启应用？',
                  success: function (res) {
                    if (res.confirm) {
                      updateManager.applyUpdate()
                    }
                  },
                })
              })
              updateManager.onUpdateFailed(function () {
                showModal({
                  title: '已经有新版本了哟~',
                  content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
                })
              })
            }
          })
        }
      } else {
        showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        })
      }
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return (
      <StoreProvider store={Store}>
        {this.props.children}
        {/* <PreviewImage /> */}
      </StoreProvider>
    )
  }
}

interface Iprops {
  children: React.ReactNode
}

const PreviewImage: React.FC = observer(() => {
  const {
    previewStore: { images, visible, current, setPreviewVisible, setPreviewCurrent },
  } = useStores()
  return (
    <PhotoProvider>
      <PhotoSlider
        images={images}
        photoClosable={false}
        visible={visible}
        onClose={() => {
          setPreviewVisible(false)
        }}
        index={current}
        onIndexChange={(index) => {
          setPreviewCurrent(index)
        }}
      />
    </PhotoProvider>
  )
})

export default App
