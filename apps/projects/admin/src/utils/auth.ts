import { GetMemberAuthListResponse, GetMemberManageLoginRegetResponse } from '@apps/apis'
import { authLocalStorage } from '@linkseeks/storage'

export interface AuthInfo {
  userId: number
  memberId: number
  token: string
  name: string
  account: string
}

export const setAuth = (info: GetMemberManageLoginRegetResponse) => {
  authLocalStorage.setItem(info)
}

export const getAuth = () => {
  try {
    const localAuth = authLocalStorage.getItem()
    return localAuth
  } catch (error) {
    return {}
  }
}

export const setRouters = (routers: any[]) => {
  window.sessionStorage.setItem('rt', JSON.stringify(routers))
}

export const getRouters = () => {
  try {
    const sessionRt = window.sessionStorage.getItem('rt')
    return sessionRt ? JSON.parse(sessionRt) : []
  } catch (error) {
    return []
  }
}

export const removeRouters = () => {
  window.sessionStorage.removeItem('rt')
}

export const removeAuth = () => {
  window.localStorage.removeItem('auth')
}

export const asyncRouter = async (routeLists: string[], routes: any[]) => {
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i]
    if (item.routes) {
      asyncRouter(routeLists, item.routes)
    } else {
      // 参与权限校验的页面
      if (item.path && !routeLists.includes(item.path)) {
        item.hideInMenu = true
        item.noAuth = true
      }
    }
  }
}

/**
 * 以下函数 为实时获取菜单配置使用
 */

/** 提取权限列表中的urls */
const extractUrl = (urlLists) => {
  let urls: any = []
  let rt: any = [] // 存入session的rt数据
  function extract(lists) {
    lists?.length &&
      lists.forEach((item) => {
        urls.push({
          url: item.url,
          id: item.id,
          parentId: item.parentId,
          sort: item.sort,
          title: item.title,
          type: item.type,
          up: item.up,
        })
        rt.push({
          u: item.url,
          b: item.buttonList.map((item) => item.buttonCode), //@bug 这里需与后端联调 返回按钮权限的code而不是name
        })
        if (item.childrenList.length) {
          extract(item.childrenList)
        }
      })
  }
  extract(urlLists)
  return { urls, rt }
}

/** 提取全量编译菜单中的components  */
const extractComponent = (mountRoutes) => {
  let componentElements: any = []
  function extract(lists) {
    lists?.length &&
      lists.forEach((item) => {
        item?.component &&
          componentElements.push({
            component: item?.component,
            exact: item?.exact,
            hideInMenu: item?.hideInMenu,
            name: item?.name,
            path: item?.path,
            relationParentCode: item?.relationParentCode,
          })
        if (item?.routes?.length) {
          extract(item.routes)
        }
      })
  }
  extract(mountRoutes)
  return componentElements
}

// 移除未配置菜单
const recursionRemove = (urls, userRoutes) => {
  if (userRoutes?.length) {
    // userRoutes.forEach((item, idx) => {
    for (let i = 0; i < userRoutes.length; i++) {
      const item = userRoutes[i]
      if (!urls.some((s) => s.url === item.path)) {
        userRoutes.splice(i, 1)
        i--
      } else {
        // 存在菜单 更新配置信息 存在子集继续递归
        const result = urls.find((s) => s.url === item.path)
        if (result) {
          // @todo 这里可以实时更新配置菜单信息
          item.name = `${result.title}`
        }
        if (item.routes?.length) {
          recursionRemove(urls, item.routes)
        }
      }
    }
    // })
  }
}

/** 提取用户配置的菜单 */
const recursionFindUserMenus = (authUrls, routes) => {
  if (routes?.length) {
    routes.forEach((item) => {
      if (item?.path === '/') {
        const configRoutes = item.routes.slice(1, item.routes.length - 1)
        recursionRemove(authUrls, configRoutes)
        item.routes.splice(1, item.routes.slice(1, item.routes.length - 1).length, ...configRoutes)
      } else {
        recursionFindUserMenus(authUrls, item?.routes)
      }
    })
  }
}

/**
 * 移除全量菜单配置的component字符
 * @param menulists
 */
const removeComponent = (menulists) => {
  menulists.forEach((element) => {
    // if(element?.component) {
    delete element.component
    // }
    if (element?.routes?.length) {
      removeComponent(element.routes)
    }
  })
}

/**
 * 装配路由组件
 * @param componentUrls 组件和路由映射
 * @param routes 页面可执行路由
 */
const assembleRouteComponents = (componentUrls, routes) => {
  function assemble(lists) {
    lists.forEach((element) => {
      if (!element?.routes?.length) {
        element.exact = true
      }
      const result = componentUrls.find((item) => item.path === element.path)
      if (result) {
        element['component'] = result['component']
      }
      if (element?.routes?.length) {
        assemble(element.routes)
      }
    })
  }
  assemble(routes)
}

/**
 * 全量菜单和权限列表整合路由 此函数直接修改routes
 * @param menuLists 全量菜单集合
 * @param routes 默认基本路由
 * @param authLists 权限菜单集合
 */
let compiledRoutes = []
export const merge = (menuLists, routes, authLists: GetMemberAuthListResponse) => {
  try {
    // 把菜单数据放入挂载目录
    routes.forEach((element, index) => {
      if (element.path === '/mount/lxAdmin/menus') {
        removeComponent(menuLists)
        compiledRoutes = routes.splice(index, 1, ...menuLists)
        throw new Error('end')
      } else if (element?.routes?.length) {
        const { routes } = element
        merge(menuLists, routes, authLists)
      }
    })
  } catch (error) {
    console.log('end')
  }
  const isDev = false
  if (!isDev) {
    // 提取所有有权限的url
    const { urls: authuUrls, rt } = extractUrl(authLists)
    // 参与权限递归匹配 通过移除隐藏
    recursionFindUserMenus(authuUrls, routes)
    setRouters(rt)
  }
  // 提取编译好的component
  const componentUrls = extractComponent(compiledRoutes)
  // 装配路由组件
  assembleRouteComponents(componentUrls, routes)
}
