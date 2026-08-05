import React, { FC, createContext, ReactNode, ReactElement, useContext } from 'react'
import { RootStoreModel } from './rootStore/model'

export const StoreContext = createContext<RootStoreModel>({} as RootStoreModel)

export type StoreComponent = FC<{
  store: RootStoreModel
  children: ReactNode
}>

export const StoreProvider: StoreComponent = ({ children, store }): ReactElement => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)

/**
 * 组件具体使用mobx的hooks
 */
export const useStores = (): RootStoreModel => useContext(StoreContext)

export default useStores
