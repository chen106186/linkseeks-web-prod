import type { RouteHashMaps } from './RouteItem'
import { RouteItem } from './RouteItem'
import type { DefineOptions } from '../defineConfig'
interface MenuUtilOption {
  routeFileModules: FileModule
  routeConfigModules: ConfigModule
  globalConfig: DefineOptions
}

type FileModule = Record<string, any>

type ConfigModule = Record<string, any>
/**
 * 所有菜单格式都由url作为唯一key
 */
export class MenuUtil {
  /**
   * 得到的数据格式为
   *
   * {
   *
   * "/login/user/view.tsx": element(页面元素),
   *
   *  "/content/view.tsx": element(页面元素)
   *
   * }
   */
  private routeFileModules: Record<string, any>

  /**
   * hash形式的文件项
   */
  routeHashMaps: RouteHashMaps

  /**
   * 菜单tree形式的路由
   */
  routeMenuData: RouteItem[] = []

  /**
   * hash形式的路由菜单项
   */

  routeMenuHashData: Record<string, RouteItem>

  /**
   * 用户传入的路由配置，针对页面级别的
   */
  routeConfig: any

  globalConfig: DefineOptions

  pageMetaList = ['detail', 'view', 'add', 'edit']

  constructor(options: MenuUtilOption) {
    const { routeConfigModules, routeFileModules, globalConfig } = options

    this.globalConfig = globalConfig
    this.routeConfig = routeConfigModules
    this.init(routeFileModules)
  }

  private init(fileModules: Record<string, any>) {
    this.routeFileModules = fileModules
    this.getMenuHash()
    this.getMenuTree()
  }

  private getMenuHash() {
    const hashMaps: Record<string, RouteItem> = {}
    Object.keys(this.routeFileModules).forEach((modulePath, index) => {
      const splitPath = this.transformModulePath(modulePath)
        .split('/')
        .filter((v) => v !== '')
      const element = this.routeFileModules[modulePath]
      let currentPath = ''

      splitPath.forEach((filePath, index) => {
        const parentUrl = currentPath
        const parentRouteItem = hashMaps[parentUrl]

        currentPath += '/' + filePath

        if (hashMaps[currentPath]) {
          // hash中已经存在本次需要处理的路由
          if (index === splitPath.length - 1) {
            parentRouteItem.addChildren(hashMaps[currentPath])
          }
        } else {
          // 用户页面配置
          // hash中已经存在了说明之前转化过
          if (!hashMaps[currentPath]) {
            hashMaps[currentPath] = new RouteItem({
              path: currentPath,
              code: filePath,
              routeKey: currentPath,
              parentUrl,
              menuMeta: !this.isPageByPath(filePath),
            })
          }

          // 如果父元素存在，那么应该给对应的父元素补充children
          if (parentRouteItem) {
            parentRouteItem.addChildren(hashMaps[currentPath])
          }
        }

        // 页面元素添加element
        if (this.isPageByPath(filePath)) {
          const UserPageConfig = this.getPageConfig(currentPath)
          if (filePath === 'view') {
            hashMaps[parentUrl].addConfig({
              headerMeta: true,
              paddingMeta: true,
              ...UserPageConfig,
            })
          } else {
            hashMaps[currentPath].addConfig(UserPageConfig)
          }
          hashMaps[currentPath].addElement(element)
          return
        }
      })
    })

    this.routeHashMaps = hashMaps

    /**
     * 同时生成一份路由配置项
     */

    this.routeMenuHashData = Object.keys(hashMaps).reduce((prev, next) => {
      prev[next.replace(/\/view$/, '')] = hashMaps[next]
      return prev
    }, {} as any)
    return hashMaps
  }

  private getMenuTree() {
    Object.entries(this.routeHashMaps).forEach(([key, route]) => {
      // 只取第一级的路由，代表起始菜单
      const splitService = key.split('/').filter((v) => v !== '')[0]
      const rootCode = '/' + splitService

      let dispatchRoute = this.routeHashMaps[rootCode]

      const rootNodeRoute = this.routeMenuData.find((v) => v.routeKey === rootCode)
      if (!rootNodeRoute) {
        this.routeMenuData.push(dispatchRoute)
      }
    })
  }

  private isPageByPath(path: string) {
    return this.pageMetaList.includes(path)
  }

  /**
   * 将文件路径 转化成 具体使用的url
   */
  private transformModulePath(modulePath: string) {
    return modulePath.replace('/src/pages', '').replace('.tsx', '')
  }

  /**
   * 获取页面的配置，如果有的话
   * @param pagePath 该页面的完整路径
   */
  private getPageConfig(pagePath: string) {
    const lastIndex = pagePath.lastIndexOf('/')
    // 路径前缀，用来寻找config的路径
    const str = pagePath.substring(0, lastIndex)
    // 页面标识，可能是view，detail之类的
    const current = pagePath.substring(lastIndex + 1)

    const routeConfig = this.routeConfig[str]

    if (routeConfig && this.isPageByPath(current)) {
      return routeConfig[current] || {}
    }
    return {}
  }
}
