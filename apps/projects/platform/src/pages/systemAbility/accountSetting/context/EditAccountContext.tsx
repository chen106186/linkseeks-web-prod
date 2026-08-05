import React from 'react'
interface Iprops {
  phone?: string | null
  email?: string | null
  hasPaycode?: boolean
  pageType: string
}
const Context = React.createContext<Iprops>({})

export default Context
