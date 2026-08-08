import { SRM_PURCHASER_HOME_PATH, HOME_PATH } from '@/constants/home'
import { authService } from '@apps/services'

/**
 * @description 返回默认首页路径，如果用户菜单中存在 srm采购商首页 则返回，否则返回之前的首页
 * @returns 默认首页路径
 */
const defaultHomePath = (auth?): string => {
  const urls = authService.getAuthUrlList(authService.getAuthList())
  if (urls && urls.includes(SRM_PURCHASER_HOME_PATH)) {
    return SRM_PURCHASER_HOME_PATH
  }
  return HOME_PATH
}

export default defaultHomePath
