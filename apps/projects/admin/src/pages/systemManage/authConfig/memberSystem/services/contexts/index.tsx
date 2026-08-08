import { createFormActions } from '@apps/formily'
import { useResetState } from '@linkseeks/hooks'
import { createContext, useContext, useRef } from 'react'

export const RoleAuthTreeContext = createContext<any>({})

const menuActions = createFormActions()

export const RoleAuthTreeProvider = ({ children }) => {
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
    menuActions,
  }
  return <RoleAuthTreeContext.Provider value={values}>{children}</RoleAuthTreeContext.Provider>
}

export const useRoleAuthTreeContext = () => {
  return useContext(RoleAuthTreeContext)
}
