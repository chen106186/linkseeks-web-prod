import { defineConfig } from '@linkseeks/router-core'
import { RouterManager, Router } from '@linkseeks/router-manager'
import { authService } from '@apps/services'
import NoPermissionPage from './pages/403/view'

const whiteList = ['/user/login', '/user/forget']
export default defineConfig({
  indexRouter: '/home',

  notFoundRouter: '/404',

  beforeRouterNavigate({ path }) {
    const auth = authService.getAuth()

    if (auth) {
      // 暂时解决登录之后 还能访问登录相关的问题
      if (path.startsWith('/user/') || path === '/') {
        Router.goHome()
        return
      }
      const validateResult = authService.validateRouteAuth(path)
      return validateResult
    } else {
      if (whiteList.includes(path)) {
        return true
      }

      // 既无权限，又不在白名单，则跳转至登录页
      Router.goLogin()
    }
  },

  async routerRender() {
    if (authService.getAuth()) {
      const authList = await authService.initAuthList()
      RouterManager.setHomePath(authService.homePath)
      return !!authList
    }

    return true
  },
  noPermissionPage: <NoPermissionPage />,
})
