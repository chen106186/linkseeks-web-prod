import type { RouterType, RouterNavigationOptions } from './type'

export class RouterManager {
  static instance: any
  static homePath: string
  router: RouterType
  basename: string = ''
  constructor() {
    if (RouterManager.instance) {
      return RouterManager.instance
    }
  }
  init(router: RouterType, basename: string = '') {
    RouterManager.instance = this
    this.router = router
    this.basename = basename
  }

  prefixPath(path: string) {
    return path.startsWith('/') ? path : `/${path}`
  }

  /**
   * 剥掉传入路径开头多余的 basename，防止 React Router 再前置一次导致双前缀。
   * 例如 basename=/platform 时，'/platform/user/login' -> '/user/login'
   * 兼容后端菜单表存了带 basename 的 path 的情况。
   */
  stripBasename(path: string) {
    if (!this.basename || !path) return path
    const bn = this.basename
    if (path === bn) return '/'
    if (path.startsWith(bn + '/')) return path.slice(bn.length)
    return path
  }

  /**
   * 统一站内跳转的浏览器路径，保证 Nginx 能命中 /admin/ 或 /platform/ 的 SPA 回退规则。
   */
  toBrowserPath(path: string) {
    const cleanPath = this.stripBasename(this.prefixPath(path))
    return this.basename ? `${this.basename}${cleanPath}` : cleanPath
  }

  /**
   * 路由跳转，会往路由堆栈中推入一个路由信息。
   */
  push(path: string, opts?: RouterNavigationOptions) {
    const { query, ...state } = opts || {}
    let _queryStr = ''
    if (query) {
      for (const key in query) {
        _queryStr += `&${key}=${query[key]}`
      }
      _queryStr = _queryStr.replace(/&/, '?')
    }
    const browserPath = this.toBrowserPath(path)
    this.router.navigate(`${browserPath}${_queryStr}`, { state })
  }

  /**
   * 重定向
   */
  redirect(path: string) {
    this.router.navigate(this.toBrowserPath(path), { replace: true })
  }

  /**
   * location 重定向（走 window.location，需要手动带 basename）
   * @param path
   */
  replace(path: string, domain: string = '') {
    const url = `${domain}${this.toBrowserPath(path)}`
    location.replace(url)
  }

  /**
   * 返回页面
   * @param level 可以指定返回的层级
   */
  back(level = -1) {
    this.router.navigate(level)
  }

  goBack(level = -1) {
    return this.back(level)
  }

  goHome(replace = false) {
    console.log('go home')
    const homePath = RouterManager.homePath || '/'
    if (replace) {
      location.replace(this.toBrowserPath(homePath))
    } else {
      this.redirect(homePath)
    }
  }

  goLogin() {
    console.log('go login')
    this.redirect('user/login')
  }

  open(url: string, isWindow = true) {
    if (isWindow) {
      window.open(this.toBrowserPath(url))
    } else {
      this.push(url)
    }
  }

  jump(url: string, isWindow = true) {
    if (isWindow) {
      window.location.href = this.toBrowserPath(url)
    } else {
      this.push(url)
    }
  }

  static setHomePath(path: string) {
    this.homePath = path
  }
}

RouterManager.homePath = '/'

export default RouterManager

/**
 * 外面项目应该主要使用这个单例Router进行跳转
 */
export const Router = new RouterManager()

/**
 * 添加直接调用history的方式,其实是为了兼容旧写法，实际上还是同一个实例
 */
export const history: RouterManager = new Proxy(RouterManager, {
  get(target, prop) {
    const router = new RouterManager()
    if (prop) {
      return router[prop]
    } else {
      return router
    }
  },
}) as unknown as RouterManager
