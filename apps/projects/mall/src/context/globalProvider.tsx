import React, { createContext, useContext } from 'react'
import { LAYOUT_TYPE, MallInfoType, MallUrl, NavItemType, SelectAreaItemType, UserInfoType } from '@/types/global'
import {
  GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse,
  GetCommodityWebStoreWebMemberShopMainResponse,
} from '@apps/apis'

export interface GlobalState {
  urlPrefix: string
  /** 当前商城信息 */
  mallInfo: MallInfoType | undefined
  /** 商城列表 */
  mallList: MallInfoType[]
  /** 装修数据 */
  designConfig: Record<string, any> | undefined
  /** 商城底部装修数据 */
  footerDesignConfig: Record<string, any> | undefined
  /** 导航菜单数据 */
  navList: NavItemType[]
  /** 店铺信息 */
  shopInfo:
    | (GetCommodityWebStoreWebMemberShopMainResponse & GetCommodityWebMemberPurchaseWebMemberPurchaseMainResponse)
    | undefined
  /** 当前布局类型：联营-joint;自营-own;店铺-shop... */
  layoutType: LAYOUT_TYPE
  /** 用户登录信息 */
  userInfo: UserInfoType | undefined
  /** 商城是否开启了Mro模式 */
  isMro: boolean
  /** 当前城市 */
  currentCity: SelectAreaItemType | undefined
  url: string
  pathname: string
  locale: string
  mallUrl: MallUrl | undefined
}

export const GlobalContext = createContext<GlobalState | undefined>(undefined)

export const useGlobalConext = () => {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalConext must be used within a GlobalProvider')
  }
  return context
}

export const GlobalProvider = ({ children, value }: { children: React.ReactNode; value: GlobalState }) => {
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}
