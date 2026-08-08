import { ReactNode } from 'react'
import type { IRouteItem } from './helper/RouteItem'

export interface DefineOptions {
  /**
   * 当页面访问 / 时，默认跳转到指定的路由，这里是填路径
   */
  indexRouter?: string

  /**
   * 当页面项目访问不存在的路由跳转指定的路由
   */
  notFoundRouter?: string

  /**
   * 暂时没用
   */
  request?: {
    errorHook?(): void

    successHook?(): void
  }

  /**
   * 路由跳转前经历的钩子
   *
   * 返回true，正常访问
   *
   * 返回false，跳转到无权限页面
   *
   * 返回jsx元素，则渲染对应的元素
   */
  beforeRouterNavigate?(
    route: { path: string; history: { back(): void }; baseRoutePrefix?: string },
    currentRouter: any,
  ): any

  /**
   * 初始化时渲染路由的函数
   *
   * 若返回true，则表示允许渲染菜单
   */
  routerRender?({ basename }?: { basename: string }): boolean | Promise<boolean>

  /**
   * 没权限时应该渲染的jsx
   */
  noPermissionPage?: ReactNode

  /**
   * 路由请求，专门给获取后端权限菜单使用
   * 如果配置了这一项，则或发起请求，以这里的数据为最终的路由菜单
   */
  remoteRouteRequest?: any

  /**
   * 统一基础路由前缀路径, 默认是 /
   */
  baseRoutePrefix?: string
}

const defaultDefineConfig: DefineOptions = {}
export const defineConfig = (define: DefineOptions = defaultDefineConfig) => {
  return define
}
