/**
 * 约定式路由
 * 规则如下
 *
 * 1. 按文件结构生成路由路径
 * 2. 以 view.tsx, detail.tsx, edit.tsx, add.tsx 为结尾的会被视为最终渲染的路由元素组件
 * 3. 每一个页面的最终都应该需要有一个view.tsx文件，若没有则无法被渲染
 * 4. 布局默认取@/layouts/view.tsx作为所有路由的布局文件
 * @author xujiamin
 */
export interface IRouteItem {
  // 当前路由切割之后的一项 例如/user/login, 如果是login页面 则会输出 login
  code: string
  routeKey: string
  parentUrl: string
  // 访问路径
  path: string
  element?: any
  children?: RouteItem[]
  /** 控制菜单显示隐藏 */
  menuMeta?: boolean
  isBaseLayout?: boolean
  /** 页面头部显示隐藏: 列表页view默认显示，其他默认隐藏 */
  headerMeta?: boolean
  /** 是否去掉content内边距：列表页view默认显示，其他默认隐藏 */
  paddingMeta?: boolean
}

export type RouteKey = 'view' | 'detail' | 'edit' | 'add'

/** 路由自定义配置项 */
export type RouteConfig = {
  [key in RouteKey]?: {
    /** 控制菜单显示隐藏 */
    menuMeta?: boolean
    isBaseLayout?: boolean
    /** 页面头部显示隐藏 */
    headerMeta?: boolean
    /** 是否去掉content内边距 */
    paddingMeta?: boolean

    authButtons?: {
      name: string
      key: string
    }[]
  }
}

export type RouteHashMaps = Record<string, RouteItem>

export interface PageConfig {
  title?: string
  sort?: number
}

/**
 * 路由的最小单元
 */
export class RouteItem {
  // 等同于唯一key
  code: string
  routeKey: string
  parentUrl: string
  path: string
  element: any
  children?: RouteItem[]
  menuMeta?: boolean = true
  title?: string = ''
  headerMeta?: boolean
  paddingMeta?: boolean
  cache?: any

  constructor(route: IRouteItem) {
    this.code = route.code
    this.routeKey = route.routeKey
    this.parentUrl = route.parentUrl
    this.menuMeta = route.menuMeta
    this.path = route.path
    this.headerMeta = route.headerMeta || false
    this.paddingMeta = route.paddingMeta || false
    if (route.children) {
      this.children = route.children
    }

    if (route.element) {
      this.element = route.element
    }
  }

  addChildren(route: RouteItem) {
    if (this.children) {
      this.children.push(route)
    } else {
      this.children = [route]
    }
  }

  addElement(element: any) {
    if (!this.children) {
      this.element = element
    }
  }

  addMenuMeta(meta: boolean) {
    this.menuMeta = meta
  }

  addConfig(config: PageConfig) {
    Object.assign(this, config)
  }
}
