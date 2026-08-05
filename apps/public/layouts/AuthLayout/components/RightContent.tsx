import { Tooltip, Badge } from 'antd'
import { BellOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import React, { useCallback, useRef, useLayoutEffect, useState, useEffect, useMemo } from 'react'
import Avatar from './AvatarDropdown'
import SelectLang from './SelectLang'
import Location from './Location'
import { history, Link, useIntl } from 'umi'
import Roles from './Roles'
import { inject, observer } from 'mobx-react'
import styles from '../styles/RightContent.less'
import { getAuth } from '@/utils/auth'
import { getCookie } from '@/utils/cookie'
import { notificationChatRoom } from '@/utils/im'
import { SOCKET_URL, PLATFORM_DOMAIN } from '@/constants'
import { GlobalConfig } from '@/global/config'

import { usePurchaseBidStore } from '@/store/purchaseBid'
import defaultHomePath from '@/utils/defaultHomePath'
import { useGlobal } from '@apps/container'

// export type SiderTheme = 'light' | 'dark';
// export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
//   theme?: SiderTheme | 'realDark';
//   layout: 'sidemenu' | 'topmenu';
// }

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

const GlobalHeaderRight: React.FC<{ isHome: boolean }> = (props) => {
  const intl = useIntl()
  const { isHome } = props
  const [message, setMessage] = useState<number>(0)
  const [showLogo, setShowLogo] = useState<boolean>(true)
  const className = styles.right

  // if (theme === 'dark' && layout === 'topmenu') {
  //   className = `${styles.right}  ${styles.dark}`;
  // }

  const userInfo = getAuth()
  const { setPurchaseBiddingMessage, setPurchaseBiddingMessageSupplier } = useGlobal()

  const ws = useRef<WebSocket | null>(null)
  const webSocketInit = useCallback(() => {
    if (SOCKET_URL && (!ws.current || ws.current.readyState === 3) && userInfo) {
      const url = `${SOCKET_URL}/support/websocket?accessToken=${encodeURIComponent(userInfo.accessToken)}`
      ws.current = new WebSocket(url)
      // ws.current.onopen = (e) => {}
      ws.current.onmessage = (e) => {
        const data: WsMessage = JSON.parse(e.data)
        if (data.action === 'purchase_bidding_message_supplier') {
          setPurchaseBiddingMessageSupplier(data)
        } else if (data.action === 'purchase_bidding_message') {
          setPurchaseBiddingMessage(data)
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

  const _handleResizeWindow = () => {
    const _width = window.innerWidth
    if (_width <= 820) {
      setShowLogo(false)
    } else {
      setShowLogo(true)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', _handleResizeWindow)
    return () => window.removeEventListener('resize', _handleResizeWindow)
  }, [])

  const handleBackMall = () => {
    const mallLink: string = getCookie('currentMallLink', 'string') as unknown as string
    if (mallLink) {
      window.location.href = mallLink
    } else {
      window.location.href = PLATFORM_DOMAIN
    }
  }
  const cacheStyle = useMemo(() => {
    return {
      isHome: { marginLeft: '-40px' },
      iamge: { height: '30px', marginRight: '12px' },
    }
  }, [])

  return (
    <div className={className}>
      <div>
        <Link to={defaultHomePath()} className={styles.container} style={isHome ? cacheStyle.isHome : {}}>
          {isHome && showLogo && <img src={GlobalConfig.global.siteInfo.logo} style={cacheStyle.iamge} />}
          <span>{GlobalConfig.global.siteInfo.name}</span>
        </Link>
      </div>
      <div className={styles.rightContent}>
        <span style={{ color: 'rgba(0, 0, 0, 0.85)', cursor: 'pointer' }} onClick={handleBackMall}>
          {intl.formatMessage({ id: 'common.fanhuishangcheng' })}
        </span>
        <Roles />
        {/* <Location /> */}
        <SelectLang />
        <Tooltip title={intl.formatMessage({ id: 'common.xiaoxi' })}>
          <Link to="/systemAbility/message" className={styles.action}>
            <Badge count={message} size={'small'}>
              <BellOutlined />
            </Badge>
          </Link>
        </Tooltip>
        {/* <Tooltip title="服务">
          <a
            target="_blank"
            href=""
            rel="noopener noreferrer"
            className={styles.action}
          >
            <CustomerServiceOutlined />
          </a>
        </Tooltip> */}
        <Avatar />
      </div>
    </div>
  )
}

export default GlobalHeaderRight

// export default connect(({ settings }: ConnectState) => ({
//   theme: settings.navTheme,
//   layout: settings.layout,
// }))(GlobalHeaderRight);
