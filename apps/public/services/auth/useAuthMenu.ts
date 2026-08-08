import { useMemo } from 'react'
import { RouteItem, useRouter } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { authService } from './index.service'

interface MenuDataOption {
  excludeLayoutRoutes?: string[]
}

function getMenu(authList, routeMenuHashData) {
  if (!authList) {
    return []
  }
  return authList.map((v) => {
    const routeItem = new RouteItem({
      code: (v.path as string).substring(v.path.lastIndexOf('/') + 1),
      routeKey: v.path,
      parentUrl: '',
      path: v.path,
    })

    routeItem.addConfig({
      title: v.name,
    })
    routeItem.addMenuMeta(true)

    if (v.children && v.children.length > 0) {
      routeItem.children = getMenu(v.children, routeMenuHashData)
    } else {
      if (routeMenuHashData[v.path] && routeMenuHashData[v.path].element) {
        routeItem.addElement(routeMenuHashData[routeItem.path].element)
      }
    }

    return routeItem
  })
}

/**
 * 获取菜单数据
 * 从接口处拿到菜单权限列表，然后再进行拼装
 */
const getMenuData = (routes: RouteItem[], option: MenuDataOption) => {
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

/**
 * 获取权限菜单
 *
 * 将接口返回的数据与本地进行匹配
 */
const useAuthMenu = () => {
  const authList = authService.getAuthList()
  // const { authList, loading } = useAuthList()

  // 注意这个hook 只能在使用了 router库 的情况下才可使用
  const { routeMenuHashData, routeMenuData } = useRouter()

  /**
   * 真实显示的菜单数据, 经过权限过滤
   */
  const menuRoutes = useMemo(() => getMenu(authList, routeMenuHashData), [authList, routeMenuHashData])

  /**
   * 全部菜单数据
   */
  const menuData = getMenuData(routeMenuData, { excludeLayoutRoutes: ['/user'] })

  /**
   * 获取指定路径的路由信息
   */
  const getCurrentMenu = (pathname: string) => {
    const dispatchArr: any[] = [...menuRoutes]

    while (dispatchArr.length) {
      const item = dispatchArr.shift()
      if (item.path === pathname) {
        return item
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        dispatchArr.push(...item.children)
      }
    }

    return null
  }
  return {
    menuRoutes,
    getCurrentMenu,
    // loading,
  }
}

export default useAuthMenu
