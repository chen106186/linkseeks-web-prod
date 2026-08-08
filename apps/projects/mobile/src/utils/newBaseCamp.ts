import Taro from '@tarojs/taro'
import { SELF_INVITE_CODE, TOKEN, USER_INFO, ROLE_LIST } from '@apps/mobile-services/constants'
import { getAsyncStorage, removeAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@apps/mobile-services/utils/router'
import { encryptedByAES } from '@linkseeks/crypto'
import {
  postMemberMobileLogin,
  postMemberMobileLoginPhoneNew,
  postMemberMobileLoginRoleSwitch,
  getMemberMobileSsoLogin,
} from '@apps/apis'
// import { hideLoading, showLoading, showToast } from '@apps/mobile-services/utils/taro'
// import { useIntl } from '@linkseeks/i18n'
import { loginSuccessSetData } from '@/packages/user/pages/login/services/features'
// import useStores from '@/store/useStores'
import { useLoginInfo } from '@/packages/user/pages/login/services/contexts'

import { getCurrentPages } from '@apps/mobile-services/utils/taro'
/**
 * 半屏幕打开小程序
 * @param extraData 需要传递给目标小程序的数据 是否必须 否 默认空对象
 * @param path 打开页面路径 是否必须 否 默认 引导页面
 * @param appId 要打开的小程序 是否必须 否 默认大本营
 * @param envVersion 要打开小程序版本 是否必须 否 默认正式版
 */
export const openMiniProgram = async (
  extraData: object = {},
  path: string = 'pages/splashView/index',
  appId: string = 'wx90eb02cc4f3550b9',
  envVersion: string = 'release',
) => {
  console.log(extraData)
  console.log(path)
  console.log(appId)
  console.log(envVersion)
  const _USER_INFO = await getAsyncStorage(USER_INFO)
  console.log(_USER_INFO, '用户信息')
  if (!_USER_INFO) {
    Router.navigateTo('user/login')
  }
  let { userId } = _USER_INFO
  extraData = { ...extraData, userId: userId, appId, path }
  console.log(extraData, '传递信息')
  Taro.openEmbeddedMiniProgram({
    appId,
    path,
    extraData,
    envVersion: 'trial',
    fail: () => {
      console.log('打开失败')
    },
    success: () => {
      console.log('打开成功')
    },
  })
}
/**
 * 获取当前小程序appId方法
 */
export const _getAccountInfoSync = () => {
  const accountInfo = Taro.getAccountInfoSync()
  const appid = accountInfo.miniProgram.appId
  console.log('小程序的appid:', appid)
  return appid
}
/**
 * 免登录
 * userId 用户id
 * memberRoleId 用户选择的角色id
 */
export const _useAutoLoginSing = async (
  type: 'account' | 'mobile',
  userId: any = 13,
  store: any,
  memberRoleId: any,
) => {
  console.log(store, 'store')
  console.log(memberRoleId, '当前角色id')
  const {
    userStore: { setUserInfo },
  } = store
  const postData: any = { userId: 14 }
  console.log(postData, '登录请求参数')
  console.log('开始登录')
  let res = await getMemberMobileSsoLogin(postData)
  console.log(res)
  console.log('登录返回')
  if (res) {
    const inviteCode = res.data?.agentPartnerInvitationCode
    inviteCode ? setAsyncStorage(SELF_INVITE_CODE, inviteCode) : removeAsyncStorage(SELF_INVITE_CODE)
    setAsyncStorage(ROLE_LIST, res.data.roles)
    setAsyncStorage(TOKEN, res.data.token)
    loginSuccessSetData(res.data, setUserInfo)
    setAsyncStorage(USER_INFO, res.data)
    setUserInfo(res.data)
    // let roleId = memberRoleId ? memberRoleId : 4;
    // let switchData = { roleId, shopType: 1 };
    // console.log(switchData,'切换身份请求参数')
    // postMemberMobileLoginRoleSwitch(switchData)
    // .then((res1:any) => {
    //   console.log(res1,'切换身份返回数据')
    //   if (res1.code === 1000) {
    //     console.log('切换执行')
    //     setAsyncStorage(ROLE_LIST, res1.data.roles)
    //     setAsyncStorage(TOKEN, res1.data.token)
    //     setAsyncStorage(USER_INFO, res1.data)
    //     loginSuccessSetData(res1.data, setUserInfo)
    //   }
    // })
    // .catch((err1:any) => {
    //   console.log(err1,'切换身份报错')
    // })
  }
  return
}
/**
 * 获取进入小程序的数据配置
 */
export const _getEnterData = () => {
  let enterData = Taro.getEnterOptionsSync()
  console.log(enterData, '小程序数据配置1')
  return enterData
}
/**
 * 初始化小程序数据
 */
export const _initData = (store: any) => {
  return new Promise(async (resolve, reject) => {
    let enterData = Taro.getEnterOptionsSync()
    console.log(enterData, '小程序数据配置')
    let { scene, referrerInfo } = enterData
    console.log(scene, '小程序配置')
    setAsyncStorage('ENTER_SCENE', scene + '')
    const enterStatus = _getSceneStatus()
    console.log(enterStatus, '进入状态true 半屏幕打开')
    const {
      userStore: { removeUserInfo, setUserInfo },
      // confirmOrderStore: { clearAll },
    } = store
    //打开小程序
    if (enterStatus) {
      let { extraData } = referrerInfo
      let memberId = extraData?.memberId
      let memberRoleId = extraData?.memberRoleId
      console.log(memberId, 'memberId')
      Taro.hideHomeButton()
      // await _useAutoLoginSing('mobile', memberId, store, memberRoleId)
      const postData: any = { userId: memberId }
      console.log(postData, '登录请求参数')
      console.log('开始登录')
      const _USER_INFO: any = await getAsyncStorage(USER_INFO)
      console.log(_USER_INFO)
      console.log((_USER_INFO && _USER_INFO?.userId !== memberId) || !_USER_INFO, '用户信息')
      if ((_USER_INFO && _USER_INFO?.userId !== memberId) || !_USER_INFO) {
        removeUserInfo()
        // clearAll()
        removeAsyncStorage('HASH_CODE')
        removeAsyncStorage('Agent_Partner')
        let res = await getMemberMobileSsoLogin(postData)
        console.log(res)
        console.log('登录返回')
        if (res) {
          const inviteCode = res.data?.agentPartnerInvitationCode
          inviteCode ? setAsyncStorage(SELF_INVITE_CODE, inviteCode) : removeAsyncStorage(SELF_INVITE_CODE)
          setAsyncStorage(ROLE_LIST, res.data.roles)
          setAsyncStorage(TOKEN, res.data.token)
          loginSuccessSetData(res.data, setUserInfo)
          setAsyncStorage(USER_INFO, res.data)
          setUserInfo(res.data)
          resolve(res.data)
        }
      } else {
        const _USER_INFO = await getAsyncStorage(USER_INFO)
        resolve(_USER_INFO)
      }
    } else {
      const _USER_INFO = await getAsyncStorage(USER_INFO)
      resolve(_USER_INFO)
    }
  })
}
/**
 * 返回上一个小程序
 */
export const _navigateBackMiniProgram = (obj: any = { name: '我返回了' }) => {
  Taro.navigateBackMiniProgram({
    extraData: obj,
    success(res) {
      // 返回成功
    },
  })
}
/**
 * 获取小程序来源
 */
export const _getSceneStatus = () => {
  console.log(getCurrentPages(), '路由参数')
  const pages = getCurrentPages()
  const enteOptionsSync = Taro.getEnterOptionsSync()
  let { referrerInfo } = enteOptionsSync
  if (referrerInfo) {
    let { extraData } = referrerInfo
    if (extraData) {
      let { appId } = extraData
      if (appId && pages.length === 1) {
        return true
      } else {
        return false
      }
    }
  }
  return false
}
