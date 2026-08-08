import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect } from 'react'
import { useDidShow, useRouter, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons } from '@apps/mobile-ui'
import { WebView } from '@tarojs/components'
import Router from '@/utils/router'
import { getOrderMobileCreateBuyerPayResult } from '@apps/apis'
const WebViewPage = () => {
  const { url, title } = getCurrentInstance().preloadData || {}
  const {
    params: { webUrl, navTitle, orderId, storeId, tradeNo },
  } = useRouter()
  useDidShow(() => {
    console.log(webUrl)
  })
  let callBlackNum = 0 // 控制轮询访问的次数
  const fnCheckOrderPay = () => {
    console.log('我执行啦')
    const params = {
      tradeNo: tradeNo || '',
    }
    getOrderMobileCreateBuyerPayResult(params)
      .then((res: any) => {
        if (res.data.paySuccess) {
          Router.redirectTo('order/SubmitSuccess', {
            orderId,
            storeId,
          })
        } else {
          setTimeout(() => {
            fnCheckOrderPay()
          }, 3000)
        }
      })
      .catch(() => {
        setTimeout(() => {
          if (callBlackNum > 300) {
            return
          }
          callBlackNum += 1
          fnCheckOrderPay()
        }, 3000)
      })
  }
  useEffect(() => {
    if (title) {
      setNavigationBarTitle({
        title: title || navTitle,
      })
    }
    if (tradeNo) {
      fnCheckOrderPay()
    }
  }, [])
  return url || webUrl ? (
    <View>
      <WebView src={decodeURIComponent(url || webUrl)} />
    </View>
  ) : null
}
export default GlobalWrapper(WebViewPage)
