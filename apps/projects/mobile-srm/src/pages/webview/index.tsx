import React, { useEffect } from 'react'
import { getCurrentInstance, setNavigationBarTitle, useDidShow, useRouter } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons } from '@apps/mobile-ui'
import { WebView } from '@tarojs/components'

const WebViewPage = () => {
  const { url, title } = getCurrentInstance().preloadData || {}
  const {
    params: { webUrl, navTitle },
  } = useRouter()
  console.log(navTitle)

  useDidShow(() => {
    console.log(webUrl)
  })

  useEffect(() => {
    if (title) {
      setNavigationBarTitle({
        title: title || navTitle,
      })
    }
  }, [])

  return url || webUrl ? (
    <View>
      {/* <Header
      title={<Text style={{ lineHeight: 60, fontSize: 14, textAlign: 'center', color: '#000' }}>支付</Text>}
      customRenderLeft={<View style={{ flex: 2 }}><Icons name='ChevronLeft' size={24} color='#000' onClick={() => Router.reLaunch('extra/mine', { hasTab: 'true' })} /></View>}
    /> */}
      <WebView src={decodeURIComponent(url || webUrl)} />
    </View>
  ) : null
}

export default WebViewPage
