import { getQueryStringParams } from '@apps/utils'
import { authService } from '../auth'
import { SRM_PURCHASER_HOME_PATH, HOME_PATH } from './navigate.constants'
import { history } from '@linkseeks/router-manager'
/**
 * 跳转相关业务逻辑
 */
class NavigateService {
  /**
   * 通过地址栏的参数 redirect，进行跳转
   * 如果没有从地址栏获取到redirect， 则根据传入的参数 defaultUrl进行跳转
   */
  redirectByQuery(defaultUrl: string) {
    const redirect = getQueryStringParams(location.pathname, 'redirect')

    if (redirect) {
      history.redirect(decodeURIComponent(atob(redirect)))
    } else {
      history.redirect(defaultUrl)
    }
  }

  /**
   * 获取首页链接
   * 由于paas平台有时候会配置srm首页，和普通首页
   * 这里硬性判断，如果用户信息里面的访问权限路径存在srm首页路径，那么就优先返回srm首页，否则是普通首页
   */
  getHomeUrl() {
    const userAuth = authService.getAuth()
    if (userAuth?.urls?.includes(SRM_PURCHASER_HOME_PATH)) {
      return SRM_PURCHASER_HOME_PATH
    }
    return HOME_PATH
  }
}

const navigateService = new NavigateService()

export default navigateService
