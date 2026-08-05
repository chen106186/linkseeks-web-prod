import { authService } from '@apps/services'
import { LinkTo } from '.'
import { getLoginDomainFn } from '@/constants/domain'

/**
 * 校验当前是否处于登录状态
 * 回调函数callback，当目前处于登录状态时会执行，否则会执行非登录逻辑
 */
export const validateLoginWrapper = (callback: Function) => {
  return (...args) => {
    const userInfo = authService.getAuth()

    if (userInfo) {
      return callback(userInfo, ...args)
    } else {
      // 跳转登录
      LinkTo(getLoginDomainFn(window.location.href), 'replace')
    }
  }
}
