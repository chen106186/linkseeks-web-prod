import { getSupportTimGetUserSig } from '@apps/apis'
import { useToggle } from '@linkseeks/hooks'
// import { TUILogin } from '@tencentcloud/tui-core'
import TUIChatEngine from '@tencentcloud/chat-uikit-engine'
import { useEffect } from 'react'
export let IS_IM_READY = false
const SDKAppID = 1600055733

export const initIMSDK = async () => {
  try {
    const { data, code, message } = await getSupportTimGetUserSig({}, { noRedirectLogin: true })
    if (code === 1000) {
      const res = await TUIChatEngine.login({
        ...data,
        SDKAppID,
        userID: data.userId,
        useUploadPlugin: true,
      })

      IS_IM_READY = true
      return {
        ...res,
        code,
      }
    } else {
      return {
        code,
        message,
      }
    }
  } catch (err) {
    IS_IM_READY = false
    return err
  }
}

export const useInitIMSDK = (props?: any) => {
  const { isRefresh = false } = props
  // const [isIMReady, toggleIsIMReady] = useToggle(IS_IM_READY)

  // useEffect(() => {
  //   if (!isIMReady && !IS_IM_READY && isRefresh) {
  //     initIMStatus()
  //   }
  // }, [isIMReady, IS_IM_READY, isRefresh])

  // const initIMStatus = async () => {
  //   const data = await initIMSDK()
  //   if (data && data.code === 1000) {
  //     toggleIsIMReady(true)
  //   } else {
  //     toggleIsIMReady(false)
  //   }
  // }

  return {
    // isIMReady,
    // initIMStatus,
  }
}
