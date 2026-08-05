import { createContext, useContext, useState } from 'react'

const initContextValue = (defaultValue: any) => {
  const { preview = false } = defaultValue
  return {
    preview: preview,
  }
}

export type FormContextProps = ReturnType<typeof initContextValue>

const FormContext = createContext({} as FormContextProps)

export const FormContextProvider = ({ children, ...defaultValue }) => {
  const value = initContextValue(defaultValue)
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

export const useFormContext = (props: any) => {
  const contextValue = useContext(FormContext)

  // 内部组件传入的属性优先更高，会覆盖外层传入
  return Object.assign(contextValue, props)
}
