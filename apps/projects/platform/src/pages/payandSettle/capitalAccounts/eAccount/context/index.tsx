import {
  getPayMobileEAccountAllInPayGetAccountDetail,
  getPayAllInPayGetMemberInfo,
  GetPayAllInPayGetMemberInfoResponse,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useEAccountMemberInfo } from '@apps/services/eAccount'
import { useAuth } from '@apps/services'

/**
 * 初始化整个状态内容
 */
const initContextDispatch = () => {
  const {
    memberInfo,
    refreshPayMemberInfo,
    payMemberInfoLoading,
    isEnterprise,
    isSelf,
    isFinishProcess,
    isFinishMoneyProcess,
  } = useEAccountMemberInfo()
  const { getAuth } = useAuth()
  const auth = getAuth()
  const {
    data: accountDetail,
    refresh: refreshAccountDetail,
    loading: accountDetailLoading,
  } = useRequestApi(getPayMobileEAccountAllInPayGetAccountDetail)

  useEffect(() => {
    refreshPayMemberInfo()
  }, [])

  return {
    memberInfo,
    refreshPayMemberInfo,
    accountDetail,
    refreshAccountDetail,
    loading: payMemberInfoLoading || accountDetailLoading,
    isSelf,
    isEnterprise,
    isFinishProcess,
    isFinishMoneyProcess,
  }
}

export type InitContextProps = ReturnType<typeof initContextDispatch>

const InitContextContainer = createContext<InitContextProps>({} as InitContextProps)

export const useEAccountInitContext = () => {
  return useContext(InitContextContainer)
}

export const InitContextProvider = ({ children }) => {
  const value = initContextDispatch()

  return <InitContextContainer.Provider value={value}>{children}</InitContextContainer.Provider>
}
