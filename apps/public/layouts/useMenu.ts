import { createContext, useContext } from 'react'
import { RouteItem } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'

interface MenuContextProps {
  menuData: RouteItem[]
  pathname: string
  activeCode: string
  collapsed: boolean
  setCollapsed(collapsed: boolean): void
}
export const MenuContext = createContext<MenuContextProps>({} as any)

export const useMenu = () => useContext(MenuContext)

export interface MenuDataOption {
  excludeLayoutRoutes?: string[]
}

/**
 * 获取菜单数据
 * 从接口处拿到菜单权限列表，然后再进行拼装
 */
export const getMenuData = (routes: RouteItem[], option: MenuDataOption) => {
  const { formatMessage } = getIntl()
  const { excludeLayoutRoutes = [] } = option

  const dispatchRoutes = routes
    .map((v) => {
      if (v.children) {
        v.children = getMenuData(v.children, option)
      }

      v.title = v.title || formatMessage({ id: `menu${v.path.split('/').join('.')}` })
      return v
    })
    .filter((v) => v.menuMeta && !excludeLayoutRoutes.includes(v.routeKey))
  return dispatchRoutes
}
