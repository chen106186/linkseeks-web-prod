import { useResetState } from '@linkseeks/hooks'
import { createContext, useContext, useRef } from 'react'

export const MemberAuthContext = createContext<any>({})

export const MemberAuthProvider = ({ children }) => {
  const idRef = useRef<any[]>([])
  const menuDataRef = useRef<any>({})

  const setIds = (ids: any[]) => {
    idRef.current = ids
  }

  const setMenuData = (hashTreeData: any) => {
    menuDataRef.current = hashTreeData
  }

  const values = {
    setIds,
    setMenuData,
    menuDataRef,
    idRef,
  }
  return <MemberAuthContext.Provider value={values}>{children}</MemberAuthContext.Provider>
}

export const useMemberAuthContext = () => {
  return useContext(MemberAuthContext)
}
