import Router from '@/utils/router'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { ROLE_LIST, USER_INFO } from '@/constants/storage'
import { getCurrentPages, getStorageSync, removeStorageSync } from '@apps/mobile-services/utils/taro'

/**
 * 登录成功跳转
 * @param shopAndSite 当前商城信息
 * @param loginData 登录返回数据
 */
const loginSuccess = (shopAndSite, loginData) => {
  if (loginData.roles.length === 1) {
    if (shopAndSite.isSelf) {
      Router.redirectTo('extra/mall/own')
    } else {
      const path = getStorageSync('backPath')
      if (path) {
        removeStorageSync('backPath')
        try {
          const params = JSON.parse(getStorageSync('backParams'))
          Router.redirectTo(path, params)
        } catch (error) {
          Router.redirectTo('extra/mall/b2b')
        }
      } else {
        Router.redirectTo('extra/mall/b2b')
      }
    }
    return
    const pages = getCurrentPages()
    if (pages.length > 1) {
      if (getStorageSync('isMultCompany') === '1') {
        // 是多主体公司，登录成功后 需要往上返回两级
        Router.navigateBack({ delta: 2 })
        return
      }
      Router.navigateBack()
    } else {
      if (shopAndSite.isSelf) {
        Router.navigateTo('extra/mall/own')
      } else {
        Router.navigateTo('extra/mall/b2b')
      }
    }
  } else {
    Router.navigateTo('user/role')
  }
}

/**
 * 登录成功储存方法
 * @param loginData 登录返回数据
 * @param setUserInfo userStore 中的 setUserInfo
 */
const loginSuccessSetData = async (loginData, setUserInfo) => {
  await setAsyncStorage(USER_INFO, loginData)
  if (loginData.roles.length === 1) {
    await setUserInfo(loginData)
  } else {
    await setAsyncStorage(ROLE_LIST, loginData.roles)
  }
}

export { loginSuccess, loginSuccessSetData }
