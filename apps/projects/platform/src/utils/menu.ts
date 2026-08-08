import { GetMemberMenuListResponse } from "@apps/apis"

export type MenuType = GetMemberMenuListResponse

export const normalizeMemu = (menu: MenuType): MenuType => {
  if (menu && Array.isArray(menu) && menu.length > 0) {
    return menu.map((item) => {
      return {
        ...item,
        ...item.attrs,
        routes: (item.routes && Array.isArray(item.routes) && item.routes.length > 0) ? normalizeMemu(item.routes as MenuType) : []
      }
    })
  }
  return menu
}
