import { WebView } from '@tarojs/components'
import React, { useEffect } from 'react'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import { navigateBack, navigateTo } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { Button } from '@apps/mobile-ui'
import { useMobileIntl } from '@apps/locales'

const IM_URL = process.env.IM_URL

export default observer(() => {
  const {
    userStore: { userInfo },
  } = useStores()
  const translate = useMobileIntl()

  const goBack = () => {
    Router.reLaunch('extra/mall/client')
  }

  useEffect(() => {
    const handleMessage = (event) => {
      const { data } = event
      if (data?.url) {
        console.log('跳转', data.url)
        navigateTo({
          url: data?.url,
        })
      }
    }
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])
  if (userInfo) {
    console.log(`imUrl: ${IM_URL}?t=${userInfo?.accessToken}&conversationID=${conversationID}&source=2`)
    return <WebView src={`${IM_URL}?t=${userInfo?.accessToken}&source=2`} />
  } else {
    return (
      <div>
        {translate('mobile.common.qingxiandenglu')}
        <Button onClick={goBack}>{translate('mobile.common.fanhuishouye')}</Button>
      </div>
    )
  }
})
