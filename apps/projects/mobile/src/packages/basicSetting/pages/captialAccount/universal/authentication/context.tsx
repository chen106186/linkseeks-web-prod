import { getPayAllInPayGetMemberInfo, GetPayAllInPayGetMemberInfoResponse } from '@apps/apis'
import { StandardForm } from '@apps/mobile-ui'
import { useRequestApi } from '@linkseeks/hooks'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const initContextValue = () => {
  const [step, setStep] = useState(0)
  const [step1Form] = StandardForm.useForm()
  const [step2Form] = StandardForm.useForm()
  const { data, loading, refresh } = useRequestApi<GetPayAllInPayGetMemberInfoResponse, any>(
    getPayAllInPayGetMemberInfo,
  )

  const isDisabledStepBtn = useMemo(() => {
    return true
  }, [data])
  useEffect(() => {
    if (data?.step !== undefined) {
      setStep(data.step)
    }
  }, [data])

  useEffect(() => {
    if (step !== 0) {
      refresh()
    }
  }, [step])
  return {
    step,
    setStep,
    step1Form,
    step2Form,
    memberInfo: data,
    refreshMemberInfo: refresh,
    isDisabledStepBtn,
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
