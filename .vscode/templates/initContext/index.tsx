import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 初始化整个状态内容
 */
const initContextDispatch = () => {
  return {}
}

export type InitContextProps = ReturnType<typeof initContextDispatch>

const InitContextContainer = createContext<InitContextProps>({} as InitContextProps)

export const useInitContext = () => {
  return useContext(InitContextContainer)
}

export const InitContextProvider = ({ children }) => {
  const value = initContextDispatch()

  return <InitContextContainer.Provider value={value}>{children}</InitContextContainer.Provider>
}
