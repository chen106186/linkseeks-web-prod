import React, { createContext, useContext } from 'react'

export interface FormContextProps {
  width?: number
  initialValue?: any
}
const FormContext = createContext<FormContextProps>({} as any)

const initFormProps: FormContextProps = {
  width: 200,
  initialValue: {},
}

export const FormProvider = ({ children, ...props }) => {
  const values = {
    ...initFormProps,
    ...props,
  }

  return <FormContext.Provider value={values}>{children}</FormContext.Provider>
}

export const useFormContext = () => {
  return useContext(FormContext)
}
