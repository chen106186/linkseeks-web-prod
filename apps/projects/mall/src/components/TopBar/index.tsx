import React, { useCallback, useRef, useState, useEffect } from 'react'
import cx from 'classnames'
import { Badge } from 'antd'
import { SelectAreaItemType } from '@/types/global'
import { useGlobalConext } from '@/context/globalProvider'
import { CaretDownOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import { getWebIntl } from '@/utils/locales'
import { authService, positionService } from '@apps/services'
import useAreaData from '@/hooks/useAreaData'
import { getLoginDomainFn, getRegisterDomainFn, MEMBER_CENTER_URL } from '@/constants/domain'
import defaultAvatar from './imgs/default_avatar.svg'
import AccountSafeIcon from './imgs/account_safe_icon.png'
import capitalAccountIcon from './imgs/capital_account.png'
import memberInfoIcon from './imgs/member_info_icon.png'
import SelectLang from './SelectLang'
import SelectMall from './SelectMall'
import SwitchCity from './SwitchCity'
import PurchaseOrder from './PurchaseOrder'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import { LinkTo } from '@/utils'
import { SOCKET_URL } from '@apps/utils'

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

const TopBar: React.FC = () => {
  const [msgNoReadCount, setMsgNoReadCount] = useState<number>(0)
  const { layoutType, mallList, mallInfo, userInfo, currentCity, url } = useGlobalConext()
  const translate = getWebIntl()
  // 注册域名
  const REGISTER_DOMAIN = getRegisterDomainFn(url)

  /**
   * 退出登录
   */
  const handleSignOut = async () => {
    authService.removeAuth()
    authService.removeAuthRouteCache()
    window.location.replace(getLoginDomainFn(url))
  }

  const ws = useRef<WebSocket | null>(null)

  const linkToLogin = validateLoginWrapper(() => {
    authService.removeAuth()
    authService.removeAuthRouteCache()
    LinkTo(getLoginDomainFn(url))
  })
  const linkToMemberCenter = validateLoginWrapper(() => {
    LinkTo(MEMBER_CENTER_URL, 'replace')
  })

  const linkToMemberMessage = validateLoginWrapper(() => {
    LinkTo(`${MEMBER_CENTER_URL}/systemAbility/message`, 'replace')
  })
  const webSocketInit = useCallback(() => {
    console.log(SOCKET_URL, 'SOCKET_URL')
    if (SOCKET_URL && (!ws.current || ws.current.readyState === 3) && userInfo) {
      const url = `${SOCKET_URL}/support/websocket?accessToken=${encodeURIComponent(userInfo.accessToken)}`
      ws.current = new WebSocket(url)
      ws.current.onopen = (e) => {
        console.log('开启连接', e)
      }
      ws.current.onmessage = (e) => {
        const data: WsMessage = JSON.parse(e.data)
        console.log(data)
        if (data.action === 'msg_im_message') {
          let _MsgContent = { ...data.data.MsgContent }
          _MsgContent.data = JSON.parse(_MsgContent.data)
          _MsgContent.desc = JSON.parse(_MsgContent.desc)
          // notificationChatRoom(_MsgContent);
        }
        if (data.action === 'msg_no_read_message') {
          setMsgNoReadCount(+data.data)
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
  }, [ws, webSocketInit, userInfo])

  const handleCityChange = (selectInfo: SelectAreaItemType) => {
    positionService.setPostion(JSON.stringify(selectInfo))
    window.location.reload()
  }

  return (
    <div className={styles.topbar}>
      <div className={styles.topbar_container}>
        <ul className={cx(styles.topbar_menu, styles.left)}>
          <li className={cx(styles.topbar_menu_item, styles.pad_left_0)}>
            <SelectMall mallInfo={mallInfo} mallList={mallList} layoutType={layoutType} />
          </li>
          <li className={styles.topbar_menu_item}>
            <SwitchCity value={currentCity} hook={useAreaData} onSelect={handleCityChange} />
          </li>
        </ul>
        <ul className={cx(styles.topbar_menu, styles.right)}>
          {userInfo ? (
            <li className={cx(styles.topbar_menu_item, styles.username)}>
              <a className={styles.username} href={`${MEMBER_CENTER_URL}`}>
                {userInfo.userName}
                <span>({userInfo?.roleName})</span>
              </a>
              <CaretDownOutlined className={styles.arrow_icon} translate={undefined} />
              <div className={styles.userInfo_card_split}></div>
              <div className={styles.userInfo_card}>
                <div className={styles.userInfo_card_header}>
                  <ImageBox width={64} height={64} circle={true} src={userInfo.logo || defaultAvatar} />
                  <div className={styles.userInfo_card_column}>
                    <div className={styles.credit_count}>
                      {translate('web.resource.mall.xinyongjifen')}：<span>{userInfo.creditPoint || 0}</span>
                    </div>
                    {userInfo.levelTag ? <div className={styles.user_type}>{userInfo.levelTag}</div> : null}
                  </div>
                  <div className={styles.sign_out_btn} onClick={handleSignOut}>
                    {translate('web.resource.mall.tuichuzhanghao')}
                  </div>
                </div>
                <div className={styles.nav_list}>
                  <div className={styles.nav_list_item}>
                    <a href={`${MEMBER_CENTER_URL}/systemAbility/accountSetting`}>
                      <img src={AccountSafeIcon} />
                      <span>{translate('web.resource.mall.zhanghuanquan')}</span>
                    </a>
                  </div>
                  <div className={styles.nav_list_item}>
                    <a href={`${MEMBER_CENTER_URL}/customerAbility/customerEnterpriseBasicInfo`}>
                      <img src={memberInfoIcon} />
                      <span>{translate('web.resource.mall.huiyuanxinxi')}</span>
                    </a>
                  </div>
                  <div className={styles.nav_list_item}>
                    <a href={`${MEMBER_CENTER_URL}/payandSettle/capitalAccounts/accountLists`}>
                      <img src={capitalAccountIcon} />
                      <span>{translate('web.resource.mall.zijinzhanghu')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ) : (
            <>
              <li className={styles.topbar_menu_item}>
                <a href={undefined} onClick={linkToLogin} className={styles.login_link}>
                  {translate('web.resource.mall.nihaoqingdenglu')}
                </a>
                <a href={REGISTER_DOMAIN}>{translate('web.resource.mall.mianfeidenglu')}</a>
              </li>
            </>
          )}
          <li className={styles.topbar_menu_item}>
            <a href={undefined} onClick={linkToMemberCenter}>
              {translate('web.resource.home.memberCenter')}
            </a>
          </li>
          {userInfo && mallInfo?.type === 1 && <PurchaseOrder />}
          <li className={styles.topbar_menu_item}>
            <Badge count={msgNoReadCount} size={'small'} className={styles.topbar_menu_item_badge}>
              <a href={undefined} onClick={linkToMemberMessage}>
                {translate('web.resource.mall.wodexiaoxi')}
              </a>
            </Badge>
          </li>
          <li className={cx(styles.topbar_menu_item, styles.nopad)}>
            <SelectLang />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TopBar
