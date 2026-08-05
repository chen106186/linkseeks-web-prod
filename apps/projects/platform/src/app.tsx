import { defineConfig } from '@linkseeks/router-core'
import { Router, RouterManager } from '@linkseeks/router-manager'
import { authService } from '@apps/services'
import NoPermissionPage from './pages/403/view'
export default defineConfig({
  indexRouter: '/home',

  notFoundRouter: '/',

  beforeRouterNavigate({ path }) {
    const whiteList = [
      '/user',
      '/user/login',
      '/user/register',
      '/user/forget',
      '/user/agreement',
      '/editMySelf',
      '/h5/download',
      '/h5/infoDetail',
      '/h5/pt',
      '/404',
      '/commodityAbility/commodity/archive',
    ]
    const auth = authService.getAuth()

    if (auth) {
      // 暂时解决登录之后 还能访问登录相关的问题
      if (path.startsWith('/user/') || path === '/') {
        Router.goHome()
        return
      }

      if (whiteList.includes(path)) {
        return true
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

  remoteRouteRequest() {
    return authService.getAuth
  },
})
