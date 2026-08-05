import { WebView } from '@tarojs/components'
import React from 'react'
import useStores from '@/store/useStores'
import { observer } from 'mobx-react-lite'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import Router from '@/utils/router'

const IM_URL = process.env.IM_URL

export default observer(() => {
  const $router = getCurrentInstance()
  const { conversationID } = $router.router?.params || {}
  const {
    userStore: { userInfo },
  } = useStores()

  const handleMessage = (e) => {
    if (IS_WEB) {
      const info = e.data
      if (info && info?.type) {
        switch (info.type) {
          // 订单详情
          case 'order':
            Router.navigateTo('order/mycommodityDetails', { orderId: info.id })
            break
          // 商品详情
          case 'commodity':
            Router.navigateTo('commodityMerge/stocksSourcing/detail', { commodityId: info.id })
            break
          // 换货详情
          case 'exchange':
            Router.navigateTo('afterService/afterRecords/exchangeRecords/exchangeDetails', { replaceId: info.id })
            break
          // 退货详情
          case 'refund':
            Router.navigateTo('afterService/afterRecords/refundRecords/refundDetails', { returnId: info.id })
            break
          // 维修详情
          case 'repair':
            Router.navigateTo('afterService/afterRecords/repairRecords/repairDetails', { repairId: info.id })
            break
          default:
            break
        }
      }
    }
  }

  React.useEffect(() => {
    if (IS_WEB) {
      const handler = (e) => handleMessage(e)
      window.addEventListener('message', handler)
      return () => window.removeEventListener('message', handler)
    }
  }, [])

  if (userInfo) {
    console.log(`imUrl: ${IM_URL}?t=${userInfo?.accessToken}&conversationID=${conversationID}&source=2`)
    return (
      <WebView
        onMessage={handleMessage}
        src={`${IM_URL}?t=${userInfo?.accessToken}&conversationID=${conversationID}&source=2`}
      />
    )
  } else {
    return <div>error</div>
  }
})
