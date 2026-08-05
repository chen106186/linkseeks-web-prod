import React from 'react'

type Icontext = {
  shopId: number
  /** 是否是自营商城 */
  isSelfMall: boolean
}

export const context = React.createContext<Icontext | null>(null)

export const FixtureContentProvider = context.Provider
