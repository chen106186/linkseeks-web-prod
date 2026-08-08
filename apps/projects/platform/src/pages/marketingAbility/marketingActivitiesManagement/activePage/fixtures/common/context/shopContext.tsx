import React from 'react'

export const Context = React.createContext<{
  shopId: number
} | null>(null)

export const RenovationProvider = Context.Provider
