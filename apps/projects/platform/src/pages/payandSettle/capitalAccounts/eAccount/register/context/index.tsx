import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 初始化整个状态内容
 */
const initRegisterContextDispatch = () => {
  return {}
}

export type InitRegisterContextProps = ReturnType<typeof initRegisterContextDispatch>

const InitRegisterContextContainer = createContext<InitRegisterContextProps>({} as InitRegisterContextProps)

export const useInitRegisterContext = () => {
  return useContext(InitRegisterContextContainer)
}

export const InitRegisterContextProvider = ({ children }) => {
  const value = initRegisterContextDispatch()

  return <InitRegisterContextContainer.Provider value={value}>{children}</InitRegisterContextContainer.Provider>
}
