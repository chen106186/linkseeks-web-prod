/* eslint-disable @typescript-eslint/no-unused-expressions */
import { TOP_DOMAIN_NO_PORT } from '@/constants/domain'
import type { GetMemberAuthListResponse, GetMemberLoginRegetResponse } from '@apps/apis'
import { HOME_PATH } from '@/constants/home'
import { authStorage } from '@linkseeks/storage'
import { getTopDomainByHost } from './getDomain'
import { getCookie, removeCookie, setCookie } from './cookie'
const isDev = false
export interface AuthInfo extends GetMemberLoginRegetResponse {
  urls: string[]
  userId: number
  memberId: number
  memberType: number
  name: string
  token: string
  logo: string
  level: number
  levelTag: string
  creditPoint: number
  memberRoleType: number
  memberRoleId: number
  locales?: string
  score: number
}

const AUTH_KEY = 'AUTH'
const AUTH_ROLES_KEY = 'AUTH_ROLES'

const getUrls = (auths: AuthInfo['auth']): string[] => {
  if (!Array.isArray(auths)) {
    return []
  }
  return auths.map((item) => item.u)
}

export const setAuth = (info: AuthInfo) => {
  const auth = {
    userId: info.userId,
    company: info.company,
    memberId: info.memberId,
    token: info.token,
    name: info.name,
    logo: info.logo,
    level: info.level,
    levelTag: info.levelTag,
    creditPoint: info.creditPoint,
    memberRoleType: info.memberRoleType,
    memberRoleId: info.memberRoleId,
    memberType: info.memberType,
    locales: info.locales,
    roleTag: info.roleTag,
    roles: info.roles,
    score: info.score,
  }

  authStorage.setItem(auth, { domain: TOP_DOMAIN_NO_PORT })
  setLocalAuth(info)
}

/**
 * 由于member本地需要获取urls字段， 但cookie不需要， 所以分开保留以前的储存方式
 */
export const setLocalAuth = (info: AuthInfo) => {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(info))
}

export const getCookieAuth = (): AuthInfo | null => {
  try {
    const cookieAuth: AuthInfo = getCookie(AUTH_KEY) as unknown as AuthInfo

    if (cookieAuth) {
      return cookieAuth
    }
    return null
  } catch (error) {
    return null
  }
}

export const getAuth = (): AuthInfo | null => {
  try {
    const localAuth = authStorage.getItem()
    return localAuth as AuthInfo
  } catch (error) {
    return null
  }
}

export const setRouters = (routers: any) => {
  window.sessionStorage.setItem('rt', JSON.stringify(routers))
}

export const getRouters = (): string[] => {
  try {
    const localAuth = window.sessionStorage.getItem('rt')
    if (localAuth) {
      const routers = JSON.parse(localAuth)
      return Array.isArray(routers) ? routers.map((item) => item.u) : []
    }
    return []
  } catch (error) {
    return []
  }
}

/** 判断站点是否开启SAAS多租户 */
export const setEnableMultiTenancy = (info: boolean) => {
  window.localStorage.setItem('SITE', JSON.stringify(info))
}

export const removeEnableMultiTenancy = () => {
  window.localStorage.removeItem('SITE')
}

export const getEnableMultiTenancy = () => {
  try {
    const enableMultiTenancy = JSON.parse(window.localStorage.getItem('SITE'))
    return (enableMultiTenancy ?? false) as boolean
  } catch (error) {
    return false as boolean
  }
}

export const removeRouters = () => {
  window.sessionStorage.removeItem('rt')
}

export const removeAuth = () => {
  authStorage.removeItem({ domain: TOP_DOMAIN_NO_PORT })
  removeCookie(AUTH_KEY, { path: '/', domain: TOP_DOMAIN_NO_PORT })
  removeCookie(AUTH_ROLES_KEY, { path: '/', domain: TOP_DOMAIN_NO_PORT })
  window.localStorage.removeItem(AUTH_KEY)
  removeEnableMultiTenancy()
  removeRouters()
  const _window: any = window
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  _window?.ysf && _window.ysf('logoff')
}

export const HOME_URL = ['/', HOME_PATH]

export const asyncRouter = async (routeLists: { b: string[]; u: string }[], routes: any[]) => {
  const pathList = routeLists.map((item) => item.u)
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i]
    if (item.routes) {
      asyncRouter(routeLists, item.routes)
    } else {
      // 参与权限校验的页面
      // fix: 修复左侧菜单首页无法显示
      if (item.path && !pathList.includes(item.path) && !HOME_URL.includes(item.path)) {
        item.hideInMenu = true
        item.noAuth = true
      }
    }
  }
}

// 清空菜单缓存
export const onRemoveMenuData = () => {
  window.sessionStorage.removeItem('ls-menus')
  window.sessionStorage.removeItem('ls-auth')
}

/**
 * 以下函数 用于接口数据实时菜单配置
 */

/** 提取权限列表中的urls */
const extractUrl = (urlLists) => {
  const urls = []
  const rt = [] // 存入session的rt数据
  function extract(lists) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
          b: item.buttonList.map((_item) => _item.buttonCode),
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
  const componentElements = []
  function extract(lists) {
    lists?.length &&
      lists.forEach((item) => {
        item?.component &&
          componentElements.push({
            component: item?.component,
            componentUrl: item?.componentUrl,
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
  }
}

/** 提取用户配置的菜单 */
const recursionFindUserMenus = (authUrls, routes) => {
  if (routes?.length) {
    routes.forEach((item) => {
      if (item?.path === '/memberCenter') {
        const configRoutes = item.routes.slice(2, item.routes.length - 1)
        recursionRemove(authUrls, configRoutes)
        item.routes.splice(2, item.routes.slice(2, item.routes.length - 1).length, ...configRoutes)
      } else {
        recursionFindUserMenus(authUrls, item?.routes)
      }
    })
  }
}

/** 参与权限校验的页面 */
const recursionMatch = (urlLists, routes) => {
  if (routes?.length) {
    routes.forEach((item) => {
      if (item.routes) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        recursionMatch(urlLists, item.routes)
      } else {
        // 参与权限校验的页面
        if (item.path && !urlLists.some((i) => i.url === item.path) && !HOME_URL.includes(item.path)) {
          // @todo 这里可以更新最新的菜单配置信息
          item.hideInMenu = true
          item.noAuth = true
        }
      }
    })
  }
}

/**
 * 转存component字符并移除全量菜单配置的component字段
 * @param menulists
 */
const removeComponent = (menulists) => {
  menulists.forEach((element) => {
    if (element?.component) {
      // 把component字符转存
      element.componentUrl = element.component
      delete element.component
    }
    if (element?.routes?.length) {
      removeComponent(element.routes)
    }
  })
}

/**
 * app.tsx的白名单拷贝
 */
const whiteLists = [
  '/home',
  '/user/login',
  '/user/register',
  '/user/forget',
  '/user/agreement',
  '/testRouter',
  '/editMySelf',
  '/noAuth',
  '/403',
  '/404',
  '/500',
  '/noAuth',
  '/app/download',
  '/app/introduce',
]

/**
 * 装配路由组件
 * @param componentUrls 组件和路由映射
 * @param routes 页面可执行路由
 * @param matchPath 是否路径匹配 兼容本地模式没有componentUrl走路径匹配模式
 */
const assembleRouteComponents = (componentUrls, routes, matchPath = false) => {
  function assemble(lists) {
    lists.forEach((element) => {
      if (!element?.routes?.length) {
        element.exact = true
      }
      const result = matchPath
        ? componentUrls.find((item) => item.path === element.path)
        : componentUrls.find((item) => item.componentUrl === element.componentUrl)
      if (result) {
        element.component = result.component
        // element.exact = true
      } else {
        // 存在componentRul但未匹配到 抛出异常
        if (
          element?.componentUrl &&
          !whiteLists.includes(element.path) &&
          element.path.indexOf('/memberCenter/') !== -1
        ) {
          console.log(new Error(`页面组件匹配失败，请更新全量菜单。参考：\n${element.path}\n${element.componentUrl}`))
        }
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
    routes.forEach((element, index) => {
      if (element.path === '/mount/lxPlateform/menus') {
        removeComponent(menuLists)
        compiledRoutes = routes.splice(index, 1, ...menuLists)
        throw new Error('end')
      } else if (element?.routes?.length) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { routes } = element
        merge(menuLists, routes, authLists)
      }
    })
  } catch (error) {
    console.log('end')
  }
  if (!isDev) {
    // 提取所有有权限的url
    const { urls: authuUrls, rt } = extractUrl(authLists)
    // 参与权限递归匹配 通过移除隐藏
    recursionFindUserMenus(authuUrls, routes)
    // // 参与权限递归匹配 通过更改权限配置项隐藏
    // recursionMatch(authuUrls, routes)
    setRouters(rt)
  }
  // 提取编译好的component
  const componentUrls = extractComponent(compiledRoutes)
  // 装配路由组件
  assembleRouteComponents(componentUrls, routes, isDev)
}
