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
   * 路由跳转，会往路由堆栈中推入一个路由信息
   * 注意：React Router 的 basename 已在 createBrowserRouter 内自动前置，
   * 这里不能再手动拼接 basename，否则会出现 /platform/platform/xxx 双前缀。
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
    const cleanPath = this.stripBasename(this.prefixPath(path))
    this.router.navigate(`${cleanPath}${_queryStr}`, { state })
  }

  /**
   * 重定向
   */
  redirect(path: string) {
    const cleanPath = this.stripBasename(this.prefixPath(path))
    this.router.navigate(cleanPath, { replace: true })
  }

  /**
   * location 重定向（走 window.location，需要手动带 basename）
   * @param path
   */
  replace(path: string, domain: string = '') {
    const url = `${domain}${this.basename}${this.prefixPath(path)}`
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
    const homePath = RouterManager.homePath
    // homePath 有时是后端返回的菜单第一项 path，可能已带 basename，需要清洗
    const cleanHome = this.stripBasename(this.prefixPath(homePath || '/'))
    if (replace) {
      // window.location 需要带上 basename
      location.replace(`${this.basename}${cleanHome}`)
    } else {
      this.redirect(cleanHome)
    }
  }

  goLogin() {
    console.log('go login')
    this.redirect('user/login')
  }

  open(url: string, isWindow = true) {
    if (isWindow) {
      window.open(this.basename + url)
    } else {
      this.push(this.basename + url)
    }
  }

  jump(url: string, isWindow = true) {
    if (isWindow) {
      window.location.href = this.basename + url
    } else {
      this.push(this.basename + url)
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
