import React, { FC, createContext, ReactNode, ReactElement, useContext } from 'react'
import { ENVIRONMENT } from '@/constants'
import { RootStoreModel } from './rootStore/model'
import { useEnterMallInfo } from '@apps/mobile-services/hooks/useEnterShopInfo'
import { getIntl } from '@linkseeks/i18n'
import { getStorageSync } from '@tarojs/taro'
/**
 * 定义store的上下文
 */
export const StoreContext = createContext<RootStoreModel>({} as RootStoreModel)

export type StoreComponent = FC<{
  store: RootStoreModel
  children: ReactNode
}>

export const StoreProvider: StoreComponent = ({ children, store }): ReactElement => {
  const { mallList, defaultCurrentMall } = useEnterMallInfo(ENVIRONMENT)
  const shopInfo = JSON.parse(getStorageSync('SHOP_AND_SITE') || '{}')

  const intl = getIntl()
  /**
   * 初始化商城信息
   */
  if (shopInfo) {
    store.userStore.setCurrentMall(shopInfo)
  } else {
    store.userStore.setCurrentMall(defaultCurrentMall)
    intl.i18n?.changeLanguage(defaultCurrentMall.language)
  }

  store.userStore.setMallList(mallList)

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

/**
 * 组件具体使用mobx的hooks
 */
export const useStores = (): RootStoreModel => useContext(StoreContext)

export default useStores
