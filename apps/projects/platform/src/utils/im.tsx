import React from 'react'
import { Button, notification, message, Typography } from 'antd'
import { ENTERPRISE_CENTER_URL } from '@/constants'
import { authService } from '@apps/services'
import { getSupportImHistorySession } from '@apps/apis'
import { TOP_DOMAIN, REQUEST_HEADER } from '@apps/constants'

const DOMAIN = `.${TOP_DOMAIN}` //document.domain
const CHATROOM_URL = `${REQUEST_HEADER}im${DOMAIN}/chatRoom`
const COOKIEPREFIX = 'CHATROOM_'

// 主动调起聊天室 mmeberId 为接收人的memberId
export const toChatRoom = (memberId: string = '', shopType: number = 1) => {
  if (!memberId) {
    document.cookie = `${COOKIEPREFIX}curMemberId=;path=/;domain=${DOMAIN}`
    document.cookie = `${COOKIEPREFIX}curUserId=;path=/;domain=${DOMAIN}`
    document.cookie = `${COOKIEPREFIX}shopType=${shopType};path=/;domain=${DOMAIN}`
    document.cookie = `${COOKIEPREFIX}ENTERPRISE_CENTER_URL=${ENTERPRISE_CENTER_URL};path=/;domain=${DOMAIN}`
    document.cookie = `${COOKIEPREFIX}origin=${window.location.origin};path=/;domain=${DOMAIN}`
    window.open(CHATROOM_URL)
    return
  }
  const _params: any = {
    memberId,
  }
  getSupportImHistorySession(_params).then((res) => {
    if (res.code === 1000) {
      let _userId = ''
      const _list = res.data
      if (_list.length > 0) {
        for (var i = 0; i < _list.length; i++) {
          if (_list[i].userList.length > 0) {
            _userId = _list[i].userList[0].userId
            break
          }
        }
      }
      if (_userId) {
        document.cookie = `${COOKIEPREFIX}curMemberId=${memberId};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}curUserId=${_userId};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}shopType=${shopType};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}ENTERPRISE_CENTER_URL=${ENTERPRISE_CENTER_URL};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}origin=${window.location.origin};path=/;domain=${DOMAIN}`
        window.open(CHATROOM_URL)
      } else {
        message.error('该会员底下没有客服！')
      }
    }
  })
}

// 被动从websocket调起聊天室
export const notificationChatRoom = (content: any) => {
  const _curUserInfo: any = authService.getAuth()
  const close = () => {
    console.log('Notification was closed. Either the close button was clicked or duration time elapsed.')
  }
  const key = `open${Date.now()}`
  const btn = (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        document.cookie = `${COOKIEPREFIX}curMemberId=${content.desc.fromMemberId};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}curUserId=${content.desc.fromUserId};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}shopType=${content.desc.shopType};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}ENTERPRISE_CENTER_URL=${ENTERPRISE_CENTER_URL};path=/;domain=${DOMAIN}`
        document.cookie = `${COOKIEPREFIX}origin=${window.location.origin};path=/;domain=${DOMAIN}`
        window.open(CHATROOM_URL)
        notification.close(key)
      }}
    >
      查看
    </Button>
  )
  let _text = ''
  if (content.data.text) {
    _text = content.data.text
  } else if (content.data.img) {
    _text = '[图片]'
  } else if (content.data.file) {
    _text = '[文件]'
  } else if (content.data.order) {
    _text = '[订单]'
  } else if (content.data.goods) {
    _text = '[商品]'
  } else if (content.data.sale) {
    _text = '[售后]'
  }
  notification.open({
    message: '你收到一条消息',
    description: (
      <Typography.Text style={{ width: 200 }} ellipsis>
        {_text}
      </Typography.Text>
    ),
    btn,
    key,
    duration: 10,
    onClose: close,
  })
}

/**
 * 七鱼客服 注册用户信息
 * @param authInfo 用户信息
 */
export const configUsr = (authInfo) => {
  const _window: any = window
  _window?.ysf &&
    _window.ysf('config', {
      uid: authInfo.token,
      name: authInfo.memberName,
      // mobile: authInfo.account,
      level: authInfo.levelTag,
      data: JSON.stringify([
        { index: 2, key: 'name', label: '会员名称', value: authInfo.userName },
        { index: 3, key: 'levelTag', label: '会员等级', value: authInfo.levelTag },
        { index: 4, key: 'userId', label: '用户ID', value: authInfo.userId },
        { index: 5, key: 'memberId', label: '会员ID', value: authInfo.memberId },
        { index: 6, key: 'memberRoleId', label: '会员角色ID', value: authInfo.memberRoleId },
      ]),
    })
}

/**
 * 初始化 七鱼客服
 * @param secretKey 标识字符串
 * @returns
 */
export const initQiyuImServer = (secretKey: string) => {
  return (function (w, d, n, a, j) {
    w[n] =
      w[n] ||
      function () {
        ;(w[n].a = w[n].a || []).push(arguments)
      }
    j = d.createElement('script')
    j.async = true
    j.src = `https://qiyukf.com/script/${secretKey}.js?hidden=1`
    d.body.appendChild(j)
  })(window, document, 'ysf')
}
