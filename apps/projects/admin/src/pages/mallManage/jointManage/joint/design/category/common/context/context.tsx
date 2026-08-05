import React from 'react'

type Icontext = {
  shopId: number
}

export const context = React.createContext<Icontext | null>(null)

export const FixtureContentProvider = context.Provider
