import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { BackTop, message, Modal, Image } from 'antd'
import { useGlobalConext } from '@/context/globalProvider'
import IconFont from '@/utils/iconfont'
import { getWebIntl } from '@/utils/locales'
import { LAYOUT_TYPE } from '@/types/global'
import { initYSF } from '@/utils/im'
import { getSupportCustomerServiceConfigGetConfigList } from '@apps/apis'
import toTopArrowIcon from './to_top_arrow_icon.png'
import FootPrint from './footprint'
import BuyList from './buyList'
import raf from './raf'
import styles from './index.module.less'
import { getEnv } from '@apps/utils/src/env'
import CustomerServiceList from '../CustomerServiceList'
import minApp from '../../assets/imgs/minApp.png'

type ysfFunctionType = (fn?: any) => void
interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document
  /** Scroll end callback */
  callback?: () => any
  /** Animation duration, default as 450 */
  duration?: number
}

interface SideNavProps {
  anchorList?: any[]
  type?: number
}

const SideNav: React.FC<SideNavProps> = (props) => {
  const { anchorList = [], type = 1 } = props
  const { userInfo, layoutType, mallInfo } = useGlobalConext()
  const [footPrintVisible, setFootPrintVisible] = useState<boolean>(false)
  const [buyListVisible, setBuyListVisible] = useState<boolean>(false)
  const [ysfConfig, setYsfConfig] = useState<ysfFunctionType>(() => {})
  const showLength = 8
  const [itemCount, setItemCount] = useState<number>(6)
  const [customerServiceConfig, setCustomerServiceConfig] = useState<Record<string, any> | undefined>({})
  const [visible, toggle] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const translate = getWebIntl()

  useEffect(() => {
    if (anchorList && anchorList.length > 0) {
      setItemCount((anchorList.length > showLength ? showLength : anchorList.length) + 6)
    }
  }, [anchorList])

  const showToggleFootPrint = () => {
    setFootPrintVisible(!footPrintVisible)
    setBuyListVisible(false)
  }

  const showToggleBuyList = () => {
    setBuyListVisible(!buyListVisible)
    setFootPrintVisible(false)
  }
  /**
   * 初始化网易七鱼客服SDK
   */
  const handleInitYSFSdk = () => {
    // 请求客服配置
    getSupportCustomerServiceConfigGetConfigList().then((res) => {
      const qiyuConfig = res?.data?.find((item) => item?.serviceType === 1)
      setCustomerServiceConfig(qiyuConfig)
      // 在平台后台配置并且启动了客服功能，才去初始化七鱼SDK
      if (qiyuConfig?.status && userInfo) {
        console.log(423423, userInfo)
        initYSF(qiyuConfig?.appKey, {
          hidden: true, // hidden表示是否隐藏访客端默认入口
        }).then((YSFCallBack) => {
          setYsfConfig(() => YSFCallBack)
          // 调用config接口配置企业用户信息，以便在客服系统中将会话与企业产品中的用户关联起来
          YSFCallBack('config', {
            uid: userInfo?.memberId,
            name: userInfo?.memberName,
            mobile: userInfo?.phone,
            level: userInfo?.level, // vip级别
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
    })
  }
  // 根据接口配置 跳转lx-IM或者七鱼IM，并传入初始秘钥  1 //自有 2 //第三方
  // const _self = GlobalConfig?.global?.imConfig ? GlobalConfig.global.imConfig.type : null
  // useEffect(() => {
  //   if (_self === 2) {
  //     // 接入第三方
  //     const s = GlobalConfig?.global?.imConfig?.paramConfigList[0]['value']
  //     const _window: any = window
  //     !_window?.ysf && initQiyuImServer(s)
  //   }
  // }, [])

  // const openqiyuIMServer = (user: UserInfoType) => {
  //   const _window: any = window
  //   _window?.ysf && _window.ysf('open')
  //   _window?.ysf && configUsr(user)
  // }

  // const jumpChatRoom = () => {
  //   if (userInfo) {
  //     if (_self === 1) {
  //       toChatRoom(memberId, mallInfo.type)
  //     } else if (_self === 2) {
  //       openqiyuIMServer(userInfo);
  //     }
  //   } else {
  //     LinkTo(LOGIN_DOMAIN, 'replace')
  //   }
  // }
  useEffect(() => {
    handleInitYSFSdk()
  }, [])
  /**
   * 点击打开客服页面
   */
  const handleCustomerService = useCallback(() => {
    if (userInfo?.accessToken) {
      window.open(`${getEnv('IM_URL')}?t=${userInfo?.accessToken}`, '_target')
    } else {
      message.error('请先登录')
    }
  }, [userInfo])
  const formatText = (text: string) => {
    if (text && text.length > 4) {
      return text.slice(0, 4)
    }
    return text
  }
  const isWindow = (obj: any) => {
    return obj !== null && obj !== undefined && obj === obj.window
  }

  const getScroll = (target: HTMLElement | Window | Document | null, top: boolean): number => {
    if (typeof window === 'undefined') {
      return 0
    }
    const method = top ? 'scrollTop' : 'scrollLeft'
    let result = 0
    if (isWindow(target)) {
      result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset']
    } else if (target instanceof Document) {
      result = target.documentElement[method]
    } else if (target) {
      result = (target as HTMLElement)[method]
    }
    if (target && !isWindow(target) && typeof result !== 'number') {
      result = ((target as HTMLElement).ownerDocument || (target as Document)).documentElement?.[method]
    }
    return result
  }

  const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
    const cc = c - b
    t /= d / 2
    if (t < 1) {
      return (cc / 2) * t * t * t + b
    }
    // eslint-disable-next-line no-return-assign
    return (cc / 2) * ((t -= 2) * t * t + 2) + b
  }

  const scrollTo = (y: number, options: ScrollToOptions = {}) => {
    const { getContainer = () => window, callback, duration = 450 } = options
    const container = getContainer()
    const scrollTop = getScroll(container, true)
    const startTime = Date.now()

    const frameFunc = () => {
      const timestamp = Date.now()
      const time = timestamp - startTime
      const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
      if (isWindow(container)) {
        ;(container as Window).scrollTo(window.scrollX, nextScrollTop)
      } else if (container instanceof Document || container.constructor.name === 'HTMLDocument') {
        ;(container as Document).documentElement.scrollTop = nextScrollTop
      } else {
        ;(container as HTMLElement).scrollTop = nextScrollTop
      }
      if (time < duration) {
        raf(frameFunc)
      } else if (typeof callback === 'function') {
        callback()
      }
    }
    raf(frameFunc)
  }

  const handleClick = (link: string) => {
    const anchorLink = document.getElementById(link)
    const scrollTop = anchorLink?.offsetTop || 0
    scrollTo(scrollTop)
  }

  const jumpChatRoom = () => {
    console.log(123)
    if (userInfo?.accessToken) {
      toggle(true)
      // window.open(`${config.IM_URL}?t=${userInfo?.token}&source=1`, '_target')
    } else {
      message.error('请先登录')
    }
  }

  return (
    <div className={styles.side_nav}>
      <div className={styles.side_nav_container}>
        <div className={styles.side_nav_list} style={{ height: `${itemCount * 51}px` }}>
          <div className={styles.anchor_wrap}>
            <div className={styles.anchor}>
              {anchorList.map(
                (item, index) =>
                  index < showLength && (
                    <div
                      className={styles.anchor_item}
                      key={item.id}
                      onClick={() => handleClick(`floorline_${item.categoryId}`)}
                    >
                      {formatText(item.name || item.categoryName)}
                    </div>
                  ),
              )}
              {type === 1 && anchorList.length > 0 && (
                <>
                  {layoutType === LAYOUT_TYPE.joint && (
                    <div className={styles.anchor_item} onClick={() => handleClick('find_more')}>
                      {translate('web.resource.mall.findmore')}
                    </div>
                  )}
                  <div className={styles.anchor_item} onClick={() => handleClick('information')}>
                    {translate('web.resource.mall.nav-info')}
                  </div>
                </>
              )}
              {type === 2 && anchorList.length > 0 && (
                <div className={styles.anchor_item} onClick={() => handleClick('about_us')}>
                  {translate('web.resource.mall.aboutus')}
                </div>
              )}
            </div>
          </div>
          {
            <div className={styles.side_nav_list_item} onClick={jumpChatRoom}>
              <IconFont className={styles.side_nav_list_item_icon} type="icon-xiaoxi" />
              <div className={styles.side_nav_list_item_name}>{translate('web.resource.mall.pingtaikefu')}</div>
            </div>
          }

          <div className={styles.side_nav_list_item} onClick={() => setIsModalOpen(true)}>
            <IconFont className={styles.side_nav_list_item_icon} type="icon-erweima1" />
            <div className={styles.side_nav_list_item_name}>小程序</div>
          </div>

          {userInfo && (
            <>
              <div className={styles.side_nav_list_item} onClick={() => showToggleBuyList()}>
                <IconFont className={styles.side_nav_list_item_icon} type="icon-buylist" />
                <div className={styles.side_nav_list_item_name}>{translate('web.resource.mall.changgou')}</div>
              </div>

              <div className={styles.side_nav_list_item} onClick={() => showToggleFootPrint()}>
                <IconFont className={styles.side_nav_list_item_icon} type="icon-jilu" />
                <div className={styles.side_nav_list_item_name}>{translate('web.resource.mall.lishi')}</div>
              </div>
            </>
          )}
          <BackTop>
            <div className={styles.side_nav_list_item}>
              <img src={toTopArrowIcon} className={styles.side_nav_list_item_img} />
            </div>
          </BackTop>
        </div>
        {useMemo(() => {
          return <FootPrint visible={footPrintVisible} effectVisible={false} onClose={() => showToggleFootPrint()} />
        }, [footPrintVisible])}
        {useMemo(() => {
          return <BuyList visible={buyListVisible} onClose={() => showToggleBuyList()} />
        }, [buyListVisible])}
      </div>
      <CustomerServiceList visible={visible} onClose={() => toggle(false)} isAdmin />
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Image width={300} src={minApp} preview={false} />
      </Modal>
    </div>
  )
}

export default SideNav
