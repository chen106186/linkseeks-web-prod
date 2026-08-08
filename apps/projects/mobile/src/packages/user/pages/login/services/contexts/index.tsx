import React, { createContext, useContext, useState } from 'react'

export const LoginContext = createContext<any>({})

export const LoginProvider = (props) => {
  const [updatePwdToggle, setUpdatePwdToggle] = useState<boolean>(false)
  const values = {
    updatePwdToggle,
    setUpdatePwdToggle,
  }
  return <LoginContext.Provider value={values}>{props.children}</LoginContext.Provider>
}

export const useLoginInit = () => {
  const [updatePwdToggle, setUpdatePwdToggle] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<any>()
  const [dayCount, setDayCount] = useState<number>(0)
  return {
    updatePwdToggle,
    loginData,
    dayCount,
    setUpdatePwdToggle,
    setLoginData,
    setDayCount,
  }
}

export const useLoginInfo = () => {
  return useContext(LoginContext)
}
