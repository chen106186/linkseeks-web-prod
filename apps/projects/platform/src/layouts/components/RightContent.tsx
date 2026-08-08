import { Tooltip, Badge } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react'
import { Link } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { authService, mallService } from '@apps/services'
import { observer, inject } from 'mobx-react'
import { getCookie } from '@/utils/cookie'
import { notificationChatRoom } from '@/utils/im'
import { SOCKET_URL, PLATFORM_DOMAIN } from '@/constants'
import { IPurchaseBidModule } from '@/module/purchaseBidModule'
import Roles from './Roles'
import Avatar from './AvatarDropdown'
import SelectLang from './SelectLang'
import styles from '../styles/RightContent.less'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { getCommodityMobileShopMobileShopSelect } from '@apps/apis'
import { useGlobal } from '@apps/container'

type WsMessage = {
  action: 'msg_no_read_message' | 'purchase_bidding_message_supplier' | 'purchase_bidding_message' | 'msg_im_message'
  /**
   * 信息数
   */
  data: string | any
  /**
   * 假设 memberId: 2 memberRoleId: 3, 那么 receiver： *:2:3
   */
  receiver: string
  /**
   * 发送者
   */
  sender: string
  timestamp: number
}

const GlobalHeaderRight: React.FC<{}> = (props) => {
  const intl = useIntl()
  const [message, setMessage] = useState<number>(0)
  const className = styles.right

  const userInfo = authService.getAuth()
  const { setPurchaseBiddingMessage, setPurchaseBiddingMessageSupplier } = useGlobal()

  const ws = useRef<WebSocket | null>(null)

  const webSocketInit = useCallback(() => {
    if (SOCKET_URL && (!ws.current || ws.current.readyState === 3) && userInfo) {
      const url = `${SOCKET_URL}/support/websocket?accessToken=${encodeURIComponent(userInfo.accessToken)}`
      ws.current = new WebSocket(url)

      ws.current.onmessage = (e) => {
        const data: WsMessage = JSON.parse(e.data)
        if (data.action === 'purchase_bidding_message_supplier') {
          setPurchaseBiddingMessageSupplier?.(data)
        } else if (data.action === 'purchase_bidding_message') {
          setPurchaseBiddingMessage?.(data)
        } else if (data.action === 'msg_im_message') {
          let _MsgContent = { ...data.data.MsgContent }
          _MsgContent.data = JSON.parse(_MsgContent.data)
          _MsgContent.desc = JSON.parse(_MsgContent.desc)
          notificationChatRoom(_MsgContent)
        }
        if (data.action === 'msg_no_read_message') {
          setMessage(+data.data)
        }
      }
      ws.current.onclose = (e) => {
        console.log('关闭连接')
      }
      ws.current.onerror = (e) => {
        console.log('socket 出错')
      }
    }
  }, [ws])

  useEffect(() => {
    userInfo && webSocketInit()
    return () => {
      ws.current?.close()
    }
  }, [ws, webSocketInit])

  /**
   * 返回商城：如果之前访问过商城，会返回上一次访问过的商城链接
   * 如果是第一次访问，则查询默认商城（自营默认第一个）跳转
   */
  const handleBackMall = () => {
    const cacheMall = mallService.getMall()
    if (cacheMall && cacheMall.url) {
      let mallLink = `${REQUEST_HEADER}${cacheMall.url}.${TOP_DOMAIN}`
      if (cacheMall.isSelf) {
        mallLink = `${mallLink}/${cacheMall.memberId}`
      }
      window.location.href = mallLink
    } else {
      getCommodityMobileShopMobileShopSelect({ environment: '1' })
        .then((res) => {
          if (res.code === 1000 && res.data && res.data.shopSelectList.length > 0) {
            const shopInfo = res.data.shopSelectList[0]
            if (shopInfo && shopInfo.url) {
              const mallLink = `${REQUEST_HEADER}${shopInfo.url}.${TOP_DOMAIN}${
                shopInfo.isSelf ? `/${shopInfo.memberId}` : ''
              }`
              window.location.href = mallLink
              return
            }
          }
          window.location.href = PLATFORM_DOMAIN
        })
        .catch(() => {
          window.location.href = PLATFORM_DOMAIN
        })
    }
  }

  const cacheStyle = useMemo(() => {
    return {
      isHome: { marginLeft: '-15px' },
      iamge: { height: '30px', marginRight: '12px' },
    }
  }, [])

  return (
    <div className={className}>
      <div className={styles.rightContent}>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)', cursor: 'pointer' }} onClick={handleBackMall}>
          {intl.formatMessage({ id: 'common.fanhuishangcheng' })}
        </span>
        <Roles />
        <SelectLang />
        <Tooltip title={intl.formatMessage({ id: 'common.xiaoxi' })}>
          <Link to="/systemAbility/message" className={styles.action}>
            <Badge count={message} size={'small'}>
              <BellOutlined className={styles.messageIcon} />
            </Badge>
          </Link>
        </Tooltip>
        <Avatar />
      </div>
    </div>
  )
}

export default GlobalHeaderRight
