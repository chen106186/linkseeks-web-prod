import React, { Component } from 'react'
import { I18N_LIBRARY_KEY, init, resources } from '@linkseeks/i18n'
import { getPayWeChatMobileGetSignature } from '@apps/apis'
import { IS_WEB, OFFICIAL_ACCOUNT_APPID, OSS_DOMAIN } from '@/constants'
import { LANGUAGE } from '@/constants/storage'
import { LOCAL_VERSION } from '@/constants/locales'
import { isWeChat } from '@/utils'
import { canIUse, getUpdateManager, showModal } from '@apps/mobile-services/utils/taro'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Store from '@/store'
import { StoreProvider } from '@/store/useStores'
import axios from 'axios'
// import '@/components/Privacy'
import './app.scss'
// import * as newLocales from '@apps/locales/mobile'
import { ShopInfoType } from './store/userStore/model'
import { getAppShopTypeSelect } from './hooks/useJmpHome'
// import sensors from 'sa-sdk-miniprogram/dist/wechat/sensorsdata.esm.js'
import APP_SETTING_CONFIG from '@/constants/manifest'
import { getLocalMallInfo, setLocalMallInfo } from '@apps/mobile-services/hooks/useEnterShopInfo'
import defaultResources from '@apps/locales/defaultResources'

if (!IS_WEB) {
  const sensors = require('sa-sdk-miniprogram/dist/wechat/sensorsdata.esm.js')
  const initSensors = () => {
    try {
      // 埋点初始化代码
      sensors.init({
        name: 'pc',
        server_url: APP_SETTING_CONFIG.CLKLOG_API,
        show_log: true,
      })
    } catch (error) {
      console.log(error)
    }
  }
  initSensors()
}
// 远程国际化配置
const initOptions: any = {
  compatibilityJSON: 'v3',
  load: 'currentOnly',
  resources: undefined,
  react: {
    // 是否需要在最外层加入Suspense标签
    wait: true,
    useSuspense: false,
  },
  interpolation: {
    escapeValue: true, // not needed for react as it escapes by default
  },
  backend: {
    allowMultiLoading: false,
    loadPath: (lng, ns) => {
      return `/miniprogram/locales/${LOCAL_VERSION}/${lng[0]}/${ns[0]}.json`
    },
    request: (options, url, payload, callback) => {
      console.log(url, 'url')
      axios
        .get(OSS_DOMAIN + url, {
          timeout: 5000, // 添加超时设置
          headers: {
            accept: '*/*',
            'Cache-Control': 'no-cache', // 添加缓存控制
          },
          // 添加浏览器缓存策略
          params: {
            v: LOCAL_VERSION,
            _t: Date.now(), // 添加时间戳防止缓存
          },
        })
        .then((res) => {
          if (res.status === 200) {
            callback(null, { status: 100, data: { ...res.data, ...resources['zh-CN']['translation'] } })
          }
        })
        .catch((err) => {
          console.error('国际化文件加载失败，使用本地资源:', err)
          callback(null, {
            status: 200,
            data: {
              ...defaultResources,
              ...resources['zh-CN'].translation,
            },
          })
        })
    },
    crossDomain: true,
    withCredentials: true,
    overrideMimeType: false,
    requestOptions: {
      mode: 'cors',
    },
  },
}

const presetI18n = async () => {
  // 如果没有设置过语言，则默认取商城的语言
  const language = (await getAsyncStorage(LANGUAGE))?.key || getLocalMallInfo()?.language
  console.log('language', language)
  const { i18n: _i18n } = await init(language, initOptions)
  // Object.keys(newLocales).forEach((key) => {
  //   // 新版本的国际化载入
  //   const newResource = newLocales[key]

  //   _i18n.addResourceBundle(key.replace('_', '-'), I18N_LIBRARY_KEY, newResource)
  // })
}
presetI18n()

class App extends Component {
  // 进入商城时初始化商城信息
  initShopInfo = async (shopId?: number) => {
    console.log('initShopInfo')
    const shopInfoCache = getLocalMallInfo() as ShopInfoType
    // shopId不为空则表示从其他小程序扫码或跳转到当前小程序，并指定选择对应的商城
    if (!shopInfoCache || shopId) {
      // 移动端默认商城 1为联营商城 2为自营商城
      const { shopSelectList = [] } = await getAppShopTypeSelect()

      let shopInfo: ShopInfoType | undefined = undefined
      if (shopId) {
        shopInfo = shopSelectList.find((item) => item.id === Number(shopId)) as unknown as ShopInfoType
      }

      if (!shopInfo) {
        shopInfo = shopSelectList[0] as unknown as ShopInfoType
      }

      console.log('更新商城信息：', shopInfo)
      setLocalMallInfo(shopInfo)

      // 解决通过分享进入未设置当前商城信息
      Store.userStore.setShopAndSite(shopInfo)
    }
  }

  componentDidMount() {
    if (!IS_WEB) {
      // 版本更新管理器
      if (canIUse('getUpdateManager')) {
        const updateManager = getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    updateManager.applyUpdate()
                  }
                },
              })
            })
            updateManager.onUpdateFailed(function () {
              showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          }
        })
      } else {
        showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
        })
      }
    } else if (IS_WEB && isWeChat()) {
      /**
       * appId 和 appSecret 作为敏感信息为非必传
       * 项目真实的 appId 和 appSecret 后端会自己去获取
       * 当你想调试微信测试号的时候
       * 可以使用这两个参数传入微信测试号的 appId 和 appSecret来进行调试
       */
      const params: any = {
        appId: OFFICIAL_ACCOUNT_APPID,
        // appSecret: OFFICIAL_ACCOUNT_SECRET,
        url: window.location.href.split('#')[0],
      }
      getPayWeChatMobileGetSignature(params).then(({ code, data }) => {
        if (code === 1000) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
              'onMenuShareQQ',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'updateAppMessageShareData',
              'updateTimelineShareData',
              'chooseWXPay',
              'hideMenuItems',
              'scanQRCode',
            ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            openTagList: ['wx-open-launch-weapp'],
          })
        }
      })
    }
  }

  componentDidShow(options) {
    const {
      query: {
        phone, // 手机号
        shopId, // 商城id
        time, // 时间戳
        sign, // 签名（phone+shopId+time+salt）
        payload, // 可选参数
      },
    } = options
    console.log('app onShow options', JSON.stringify(options))
    console.log('app onShow query', JSON.stringify(options?.query))
    console.log(options, shopId, phone, time, sign, payload, 'options')
    this.initShopInfo(shopId)
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return <StoreProvider store={Store}>{this.props.children}</StoreProvider>
  }
}

export default App
