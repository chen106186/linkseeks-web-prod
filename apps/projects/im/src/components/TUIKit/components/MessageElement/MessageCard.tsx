import React, { PropsWithChildren } from 'react'
import { useMessageContextHandler } from './hooks'
import type { MessageContextProps } from './MessageText'
import { EXTRA_MESSAGE_TYPE } from '../../utils/extraMessageType'
import { isAPP, isH5, isMini, isPC } from '../../utils/env'
import { authService } from '@apps/services'
import { message } from 'antd'

declare const wx: any // Declare wx as a global variable
declare const window: any
const getIdByType = (type, info) => {
  const typeToIdMap = {
    order: info?.orderId,
    commodity: info?.id,
    after: info?.returnId || info?.replaceId,
  }
  return typeToIdMap[type] || ''
}

const navigateRouter = (type, id, p?: any) => {
  const auth = authService.getAuth()
  const roleType = auth.roleTag

  if (isPC && !process.env.OUT_MEMBER_URL) {
    message.error('未配置正确的能力中心地址')
    return false
  }

  if (type === 'order') {
    if (isPC) {
      if (roleType === 1) {
        // 服务消费者
        window.open(`${process.env.OUT_MEMBER_URL}/orderAbility/purchaseOrder/orderList/detail?id=${id}`)
      } else if (roleType === 2) {
        // 服务提供者
        window.open(`${process.env.OUT_MEMBER_URL}/orderAbility/saleOrder/orderList/detail?id=${id}`)
      } else {
        // 如果没有roleType，说明是平台后台用户，则跳转至平台后台
        window.parent.postMessage({ action: 'navigate', url: `/orderManage/list/detail?id=${id}` }, '*')
      }
    } else if (isAPP) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'order', id }))
    } else if (isMini) {
      // 小程序
      // 移动端，是从webview跳回小程序的指定链接
      // 前往订单详情
      wx.miniProgram.navigateTo({ url: `/packages/order/pages/mycommodityDetails/index?orderId=${id}` })
    } else if (isH5) {
      // window.parent.postMessage({ url: `/packages/order/pages/mycommodityDetails/index?orderId=${id}` }, '*')
      window.parent.postMessage({ type: 'order', id }, '*')
    }
  }
  if (type === 'commodity') {
    if (isPC) {
      // 不拼接店铺id，则不会出现店铺布局，也可以打开商品详情
      window.open(`${process.env.OUT_SITE_URL}/commodity/detail/${id}`)
    } else if (isAPP) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'commodity', id }))
    } else if (isMini) {
      wx.miniProgram.navigateTo({
        url: `/packages/commodityMerge/pages/stocksSourcing/detail/index?commodityId=${id}&showIM=0`,
      })
    } else if (isH5) {
      window.parent.postMessage({ type: 'commodity', id }, '*')
      // window.parent.postMessage(
      //   {
      //     url: `/packages/commodityMerge/pages/stocksSourcing/detail/index?commodityId=${id}&showIM=0`,
      //   },
      //   '*',
      // )
    }
  }

  if (type === 'after') {
    if (isPC) {
      if (roleType) {
        // 有roleType 说明是能力中心
        if (p == '1') {
          window.open(`${process.env.OUT_MEMBER_URL}/afterAbility/exchangeApplication/exchangeQuery/detail?id=${id}`)
        } else if (p == '2') {
          window.open(`${process.env.OUT_MEMBER_URL}/afterAbility/returnApplication/returnQuery/detail?id=${id}`)
        } else if (p == '3') {
        }
      } else {
        // 没有说明是平台后台
        if (p == '1') {
          window.parent.postMessage(
            { action: 'navigate', url: `/afterManage/exchangeManage/query/detail?id=${id}` },
            '*',
          )
        } else if (p == '2') {
          window.parent.postMessage({ action: 'navigate', url: `/afterManage/returnManage/query/detail?id=${id}` }, '*')
        } else if (p == '3') {
        }
      }
    } else if (isAPP) {
      if (p == '1') {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'exchange', id }))
      } else if (p == 2) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'refund', id }))
      } else if (p == '3') {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'repair', id }))
      }
    } else if (isMini) {
      if (p == '1') {
        wx.miniProgram.navigateTo({
          url: `/packages/afterService/pages/afterRecords/exchangeRecords/exchangeDetails/index?replaceId=${id}`,
        })
      } else if (p == '2') {
        wx.miniProgram.navigateTo({
          url: `/packages/afterService/pages/afterRecords/refundRecords/refundDetails/index?returnId=${id}`,
        })
      } else if (p == '3') {
      }
    } else if (isH5) {
      if (p == '1') {
        window.parent.postMessage({ type: 'exchange', id }, '*')
      } else if (p == 2) {
        window.parent.postMessage({ type: 'refund', id }, '*')
      } else if (p == '3') {
        window.parent.postMessage({ type: 'repair', id }, '*')
      }
      // if (p == '1') {
      //   window.parent.postMessage(
      //     {
      //       url: `/packages/afterService/pages/afterRecords/exchangeRecords/exchangeDetails/index?replaceId=${id}`,
      //     },
      //     '*',
      //   )
      // } else if (p == '2') {
      //   window.parent.postMessage(
      //     {
      //       url: `/packages/afterService/pages/afterRecords/refundRecords/refundDetails/index?returnId=${id}`,
      //     },
      //     '*',
      //   )
      // } else if (p == '3') {
      // }
    }
  }
}

const getMobileContent = (type, info, p) => {
  // 移动端渲染消息方式不同
  switch (type) {
    case 'order': {
      return (
        <div className="message-mobile-card" onClick={() => navigateRouter(type, info.orderId)}>
          <div className="message-mobile-header">
            <div className="message-mobile-no">{info.orderNo}</div>
            <div className="message-mobile-time">{info.createTime}</div>
          </div>
          <div className="message-mobile-name">{info.digest}</div>
          <div className="message-mobile-footer">
            <div className="message-mobile-money">
              {/* {info.min} - {info.max} */}￥{info.amount}
            </div>
            <div className="message-mobile-status">{info.outerStatusName}</div>
          </div>
        </div>
      )
    }

    case 'commodity': {
      return (
        <div className="message-mobile-card" onClick={() => navigateRouter(type, info.commodityId || info.id, info)}>
          <div className="message-mobile-header">
            <div className="message-mobile-no">商品ID：{info.commodityId || info.id}</div>
          </div>
          <div className="message-mobile-name">商品名称：{info.commodityName || info.name}</div>
          <div className="message-mobile-footer">
            <div className="message-mobile-money">
              价格：￥{info.min} - {info.max}
            </div>
            <div className="message-mobile-status">{info.unitName}</div>
          </div>
        </div>
      )
    }

    case 'after': {
      return (
        <div className="message-mobile-card" onClick={() => navigateRouter(type, info.returnId || info.replaceId, p)}>
          <div className="message-mobile-header">
            <div className="message-mobile-no">{info.applyNo}</div>
            <div className="message-mobile-time">{info.applyTime}</div>
          </div>
          <div className="message-mobile-name">{info.applyAbstract}</div>
          <div className="message-mobile-footer">
            <div className="message-mobile-money">{info.outerStatusName}</div>
            <div className="message-mobile-status">{info.innerStatusName}</div>
          </div>
        </div>
      )
    }
  }
}
const parsePayload = (payload) => {
  if (!payload) return
  try {
    const { info, type, payload: p } = JSON.parse(payload.data)
    const id = getIdByType(type, info)
    if (isPC) {
      const message = EXTRA_MESSAGE_TYPE[type]
      return (
        <div
          className="message-card-container"
          onClick={() => navigateRouter(type, id, type === 'commodity' ? info : p)}
        >
          {message?.map((v) => {
            const children = v?.render ? v.render(info) : info[v.key]
            return (
              <span className="message-card-text" key={v.key}>
                <span className="message-card-label">{v.label}</span>
                <span className="message-card-content">{children}</span>
              </span>
            )
          })}
        </div>
      )
    } else {
      // 移动端逻辑
      const mobileContent = getMobileContent(type, info, p)
      return <div className="message-mobile-card">{mobileContent}</div>
    }
  } catch (err) {}
}
function MessageCardWithContext<T extends MessageContextProps>(props: PropsWithChildren<T>): React.ReactElement {
  const { children, message } = props

  const { context } = useMessageContextHandler({ message })
  return (
    <div className={`bubble message-card message-text bubble-${message?.flow}`}>
      {parsePayload(message?.payload)}
      {/* {children} */}
    </div>
  )
}

const MemoizedMessageCard = React.memo(MessageCardWithContext) as typeof MessageCardWithContext

export function MessageCard(props: MessageContextProps): React.ReactElement {
  return <MemoizedMessageCard {...props} />
}
