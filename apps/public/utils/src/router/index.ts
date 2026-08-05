/**
 * 将后端返回的数据格式，转化为前端可识别的路由组件路径
 */
export const loaderRoute = <T extends Record<string, any>, A extends any, R extends A[]>(routeMaps: T, routes: R) => {
  routes.forEach((r: any) => {
    if (r.element) {
      r.element = routeMaps[r.element]?.element || 'NOT_FOUND'
    }

    if (r.children) {
      r.children = [...loaderRoute(routeMaps, r.children)]
    }
  })

  return routes
}
