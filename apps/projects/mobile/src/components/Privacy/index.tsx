import React from 'react'
import ReactDom from 'react-dom'
import { View, Button } from '@tarojs/components'
import { IS_WEB, PRIVACY_POP } from '@/constants'
import addLifecycleHook from '@/utils/addLifecycleHook'
import {
  exitMiniProgram,
  onNeedPrivacyAuthorization,
  getPrivacySetting,
  getCurrentPages,
  openPrivacyContract,
} from '@apps/mobile-services/utils/taro'
// import useJmpHome from '@/hooks/useJmpHome'
import './index.scss'

const resolveSet = new Set<(e: { event: string; buttonId: string }) => void>()
const onCloseSet = new Set<() => void>()
const nonMandatoryPages = new Set(['extra/webview'])

type PrivacyProps = {
  onDisagree: () => any
  onAgree: () => any
  privacyContractName: string
}

// 隐私协议组件Demo
const Privacy: React.FC<PrivacyProps> = ({ onAgree, onDisagree, privacyContractName }) => {
  // const { jmpDefaultHome } = useJmpHome()

  const _onAgree = () => {
    onAgree?.()
    // const pages = getCurrentPages()
    // if(pages[0].route === 'pages/splashView/index'){
    // 	jmpDefaultHome()
    // }
  }

  return (
    <View className="privacy">
      <View className="privacy-gap" />
      <View className="privacy-container">
        <View className="privacy-container-title">用户隐私保护提示</View>
        <View className="privacy-container-box">
          <View className="privacy-container-text">感谢您使用云链认养鲜小程序，您在使用该服务前，请仔细阅读</View>
          <View
            className="privacy-container-privacy-text"
            onClick={() => {
              openPrivacyContract?.()
            }}
          >
            {privacyContractName}
          </View>
          <View className="privacy-container-text">
            当您点击同意并开始使用该服务时，即表示您已理解并同意该条款内容。
          </View>
        </View>
        <View className="privacy-container-buttonBox">
          <Button onClick={onDisagree} className="privacy-container-buttonBox-button">
            拒绝
          </Button>
          <Button
            id="agree"
            // @ts-ignore
            openType="agreePrivacyAuthorization"
            className="privacy-container-buttonBox-button privacy-container-buttonBox-button-agree"
            onAgreePrivacyAuthorization={_onAgree}
          >
            同意
          </Button>
        </View>
      </View>
    </View>
  )
}

export const popUpPrivacy = (rootId, privacyContractName) => {
  const portalId = `PrivacyId_${rootId}`
  const root = document.getElementById(rootId)
  let portal = document.getElementById(portalId)

  if (!portal) {
    portal = document.createElement('view')
    portal.id = portalId
    portal.className = PRIVACY_POP
  }

  if (root && portal) {
    root.appendChild(portal)

    const onClose = () => {
      ReactDom.unmountComponentAtNode(portal!)
      root.removeChild(portal!)
    }

    const onAgree = () => {
      onCloseSet.forEach((close) => close())

      resolveSet.forEach((resolve) => {
        resolve({
          event: 'agree',
          buttonId: 'agree',
        })
      })
    }

    onCloseSet.add(onClose)

    ReactDom.render(
      <Privacy onAgree={onAgree} onDisagree={exitMiniProgram} privacyContractName={privacyContractName} />,
      portal,
    )
  }
}

if (!IS_WEB) {
  addLifecycleHook('appHooks', 'onLaunch', () => {
    onNeedPrivacyAuthorization?.((resolve) => {
      resolveSet.add(resolve as any)
    })
  })

  addLifecycleHook('pageHooks', 'onReady', () => {
    getPrivacySetting?.({
      success: (e) => {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        if (e.needAuthorization) {
          try {
            popUpPrivacy(currentPage.$taroPath, e.privacyContractName)
          } catch (err) {
            console.error(err)
          }
        }
      },
    })
  })
}
