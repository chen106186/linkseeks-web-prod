import React, { useEffect, useState, useRef } from 'react'
import { IS_WEB } from '@/constants'
import Router from '@/utils/router'
import { View, Text, Image, Button, Badge } from '@apps/mobile-ui'
import { pxTransform, getSystemInfoSync, showToast, useDidShow, useDidHide } from '@apps/mobile-services/utils/taro'
import useCustomerService from '@/hooks/useCustomerService'
import { getSupportCustomerServiceConfigGetConfigList, getSupportTimGetUnreadMsgNum } from '@apps/apis'
import { useStores } from '@/store/useStores'
import { initYSF, validateIMRouter } from '@/utils/im'
import { observer } from 'mobx-react-lite'
import './index.scss'
import { useIMMsgCount } from '@/hooks/useIMMsgCount'
export interface TabBottomItemType {
  url: string
  lightPic: string
  pic: string
  name: string
  type: number
}

interface TabBottomProps {
  style?: React.CSSProperties
  tabList: TabBottomItemType[]
  activeUrl: string
  param?: any
  children?: React.ReactNode
}
type ysfFunctionType = (fn?: any) => void
const TabBottom: React.FC<TabBottomProps> = (props) => {
  const safeBottom = getSystemInfoSync()?.safeArea?.bottom || 0
  const screenHeight = getSystemInfoSync().screenHeight
  const [customerServiceConfig, setCustomerServiceConfig] = useState<Record<string, any> | undefined>({})
  const initYsfSdkSuccess = useRef<boolean>(false)
  const safePadding = IS_WEB ? 0 : screenHeight - safeBottom
  const { routerToCustomerService } = useCustomerService()
  const intervalTimer = useRef<any>(null)
  const {
    userStore: { userInfo },
  } = useStores()
  const { unReadCount, dispatchUnRead, clearUnReadInterval } = useIMMsgCount(userInfo)

  const [ysfConfig, setYsfConfig] = useState<ysfFunctionType>(() => {})
  const toSel = (url, item) => {
    console.log(url, item)
    if (item?.type === 10) {
      if (!userInfo?.imFlag) {
        showToast({
          title: '您当前没有使用客服聊天的权限',
        })
      }
      validateIMRouter('list')

      return
    }
    // if (process.env.TARO_ENV === 'h5' && item?.type === 10) {
    // 	// 如果是h5，并且是客服tab，点击跳转到七鱼客服系统
    // 	ysfConfig?.('open')
    // 	return
    // }

    // // IM客服系统
    // if (item?.type === 4) {
    // 	if (!userInfo?.imFlag) {

    // 		return
    // 	}
    // }
    // if (url === 'extra/webview') {
    // 	validateIMRouter('list')
    // 	return
    // }
    if (url === 'shop/shopAbout') {
      Router.navigateTo(url, { ...props.param })
      return
    }

    // 如果是IM类型，则走特殊判断
    if (url === 'im/chatList') {
      validateIMRouter('list')
      return
    }

    if (props.activeUrl !== url) {
      Router.redirectTo(url, { ...props.param })
    }
  }
  // useDidShow(() => {
  //   dispatchUnRead()
  // })
  useDidHide(() => {
    clearUnReadInterval()
  })
  useEffect(() => {
    // 请求客服配置
    getSupportCustomerServiceConfigGetConfigList().then((res) => {
      if (res?.code === 1000) {
        const qiyuConfig = res?.data?.find((item) => item?.serviceType === 1 && item?.status)
        const imConfig = res?.data?.find((item) => item?.serviceType === 2 && item?.status)

        if (qiyuConfig) {
          setCustomerServiceConfig(qiyuConfig)
        } else if (imConfig) {
          setCustomerServiceConfig(imConfig)
        }
      }
    })
  }, [])

  useEffect(() => {
    // 如果当前环境是h5，并且配置了客服，则初始化七鱼SDK
    if (
      customerServiceConfig?.status &&
      customerServiceConfig?.serviceType === 1 &&
      userInfo &&
      process.env.TARO_ENV === 'h5' &&
      !initYsfSdkSuccess.current &&
      props?.tabList?.find((item) => item.type === 10)
    ) {
      initYsfSdkSuccess.current = true
      initYSF(customerServiceConfig?.appKey, {
        hidden: true, // hidden表示是否隐藏访客端默认入口
      }).then((YSFCallBack) => {
        setYsfConfig(() => YSFCallBack)
        // 调用config接口配置企业用户信息，以便在客服系统中将会话与企业产品中的用户关联起来
        YSFCallBack('config', {
          uid: userInfo?.memberId,
          name: userInfo?.memberName,
          mobile: userInfo?.phone,
          email: userInfo?.email,
          // data:JSON.stringify([
          // 	{"key":"real_name", "value":"土豪"},
          // 	{"key":"mobile_phone", "hidden":true, "value":"13800000000"},
          // 	{"key":"email", "value":"13800000000@163.com"},
          // 	{"index":0, "key":"account", "label":"账号", "value":"zhangsan" , "href":"http://example.domain/user/zhangsan"},
          // 	{"index":1, "key":"sex", "label":"性别", "value":"先生"},
          // 	{"index":2, "key":"reg_date", "label":"注册日期", "value":"2015-11-16"},
          // 	{"index":3, "key":"last_login", "label":"上次登录时间", "value":"2015-12-22 15:38:54"},
          // 	{"index": 4, "key":"avatar","label":"头像","value":"https://xxxxx.jpg"}
          // ])
        })
      })
    }

    return () => {
      clearInterval(intervalTimer.current)
      intervalTimer.current = null
    }
  }, [customerServiceConfig, props, userInfo])

  console.log(props.tabList)

  const renderTab = () => {
    return props?.tabList?.map((item, index) => {
      return (
        <View key={`${item.url}_${index}`} className="tabBottom-tab-item" onClick={() => toSel(item.url, item)}>
          {props.activeUrl === item.url ? (
            <Image src={item.lightPic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
          ) : (
            <Image src={item.pic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
          )}
          <Text className={`${props.activeUrl === item.url ? 'activeText bottomText' : 'bottomText'}`}>
            {item.name}
            {unReadCount > 0 && <Badge count={unReadCount} className="unread-badge" />}
          </Text>
        </View>
      )
    })
  }
  return (
    <View className={`${process.env.TARO_ENV === 'h5' ? 'tabBottomH5' : 'tabBottom'}`} style={props.style}>
      <View className="tabBottom-child">{props.children}</View>
      <View className="tabBottom-tabs" style={{ paddingBottom: safePadding ? `${safePadding}px` : '6px' }}>
        {renderTab()}
        {/* {props.tabList.map((item, index) => {
					// 4 代表腾讯IM客服
					if (item.type === 4) {
						return (
							<View key={`${item.url}_${index}`} className="tabBottom-tab-item" onClick={() => toSel(item.url, item)}>
								{props.activeUrl === item.url ? (
									<Image src={item.lightPic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								) : (
									<Image src={item.pic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								)}
								<Text className={`${props.activeUrl === item.url ? 'activeText bottomText' : 'bottomText'}`}>
									{item.name}
									{unReadCount > 0 && <Badge count={unReadCount} className="unread-badge" />}
								</Text>
							</View>
						)
					}
					return customerServiceConfig?.status &&
						customerServiceConfig.serviceType === 1 &&
						item.type === 10 &&
						process.env.TARO_ENV === 'weapp' ? (
						// 如果是客服tab，并且是在小程序环境下，要使用微信原生的Button唤起客服窗口
						// item.type === 10  为客服tab
						// customerServiceConfig?.status 在平台后台是否启动网易七鱼客服配置
						// process.env.TARO_ENV === 'weapp' 是否为小程序环境
						<View key={`${item.url}_${index}`} className="tabBottom-tab-item">
							<Button
								openType="contact"
								showMessageCard={true}
								sessionFrom={`nickName=${userInfo?.memberName}|foreignid=${userInfo?.memberId}`}
								customStyle={{ border: 'none' }}
							>
								{props.activeUrl === item.url ? (
									<Image src={item.lightPic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								) : (
									<Image src={item.pic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								)}
								<Text
									style={{ lineHeight: 'normal' }}
									className={`${props.activeUrl === item.url ? 'activeText' : ''}`}
								>
									{item.name}
								</Text>
							</Button>
						</View>
					) : (
						// item?.type === 10 代表是客服tab，如果是客服tab，得同时在平台后台开启客服配置才显示入口
						((item?.type === 10 && customerServiceConfig?.status) || item?.type !== 10) && (
							<View key={`${item.url}_${index}`} className="tabBottom-tab-item" onClick={() => toSel(item.url, item)}>
								{props.activeUrl === item.url ? (
									<Image src={item.lightPic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								) : (
									<Image src={item.pic} style={{ width: pxTransform(24), height: pxTransform(24) }} />
								)}
								<Text className={`${props.activeUrl === item.url ? 'activeText' : ''}`}>{item.name}</Text>
							</View>
						)
					)
				})} */}
      </View>
    </View>
  )
}

export default observer(TabBottom)
