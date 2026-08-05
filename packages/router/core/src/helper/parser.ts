import { MenuUtil } from './MenuUtil'
/**
 * 约定式路由，从文件中读取
 */
export const parseRouteMenu = () => {
  // vite可通过该方式静态解析目录下的文件内容，但要注意参数中不得包含变量
  const routeFileModules = import.meta.glob(`@/pages/**/(view|detail|edit|add).{ts,tsx}`)
  // 解析配置文件
  const routeConfigModules = import.meta.glob(`@/pages/**/page\.config.{ts,tsx}`, { eager: true })

  // 解析系统配置文件
  // @ts-ignore
  const globalConfig = Object.values(import.meta.glob(`@/app.{ts,tsx}`, { eager: true }))[0]?.default || {}

  const menuUtil = new MenuUtil({
    routeFileModules,
    routeConfigModules: Object.keys(routeConfigModules).reduce((prev, next) => {
      const routeConfig = (routeConfigModules[next] as any).default
      prev[next.replace('/src/pages', '').replace(/\/page\.config.ts/, '')] = routeConfig
      return prev
    }, {} as any),
    globalConfig,
  })

  return menuUtil
}
/**
 * 获取布局文件
 */
export const parseLayout = () => {
  const LayoutMaps = import.meta.glob(`@/layouts/view.tsx`)
  //@ts-ignore
  const Layout: any = Object.values(LayoutMaps)[0]

  if (!Layout) {
    throw '布局文件不存在，请检查/src/layouts/view.tsx文件是否存在'
  }
  return Layout
}
