import { getPlatform } from '@tencentcloud/universal-api'

const judegeIsWeiXin = (): boolean => {
  const ua = navigator.userAgent.toLowerCase()
  if (String(ua.match(/MicroMessenger/i)) === 'micromessenger') {
    return true
  }
  return false
}

export let isPC = getPlatform() === 'pc'

export let isH5 = getPlatform() === 'h5'

export let isAPP = typeof window.ReactNativeWebView !== 'undefined'

export let isMini = judegeIsWeiXin()

export const setPlatform = (platform: 'pc' | 'h5') => {
  isPC = platform === 'pc'
  isH5 = platform === 'h5'
}
