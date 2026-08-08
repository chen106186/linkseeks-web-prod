import React from 'react'

export const Context = React.createContext<{
  shopId: number | undefined
} | null>(null)

export const RenovationProvider = Context.Provider
