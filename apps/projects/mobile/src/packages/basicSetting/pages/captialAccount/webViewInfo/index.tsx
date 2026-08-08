import GlobalWrapper from '@/components/GlobalWrapper'
// BindbankCard

import React from 'react'
import { View } from '@apps/mobile-ui'
import { WebView } from '@tarojs/components'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
const WebViewInfo = () => {
  const {
    params: { url },
  }: any = getCurrentInstance().preloadData
  return (
    <View>
      <WebView src={url}></WebView>
    </View>
  )
}
export default GlobalWrapper(WebViewInfo)
