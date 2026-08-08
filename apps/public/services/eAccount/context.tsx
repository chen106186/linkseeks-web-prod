import { useRequestApi } from '@linkseeks/hooks'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useEAccountMemberInfo } from './hooks/useEAccountMemberInfo'
import { useHistory } from '@linkseeks/router-core'

const initContextValue = () => {
  const [step, setStep] = useState(0)
  const { memberInfo, refreshPayMemberInfo, initPayMemberInfo, payMemberInfoLoading, isEnterprise } =
    useEAccountMemberInfo()
  const history = useHistory()
  const isDisabledStepBtn = useMemo(() => {
    return step !== 3
  }, [memberInfo, step])

  useEffect(() => {
    getResponseChangeStep()
  }, [])

  const getResponseChangeStep = async () => {
    const { code, data } = await initPayMemberInfo()
    if (code === 1000) {
      setStep(data?.step || 0)
    }
  }
  const changeStep = (currentStep: number) => {
    if (currentStep) {
      // 通过onSuccess的结果来设置step
      getResponseChangeStep()
    }
  }

  return {
    step,
    setStep: changeStep,
    isEnterprise,
    memberInfo,
    refreshPayMemberInfo,
    isDisabledStepBtn,
    readyLoading: payMemberInfoLoading,
  }
}

export type AuthenticationContextProps = ReturnType<typeof initContextValue>

export const AuthenticationContext = createContext<AuthenticationContextProps>({} as any)

export const AuthenticationProvider = ({ children }) => {
  const values = initContextValue()
  return <AuthenticationContext.Provider value={values}>{children}</AuthenticationContext.Provider>
}

export const useAuthenticationContext = () => {
  const values = useContext(AuthenticationContext)

  return values
}
