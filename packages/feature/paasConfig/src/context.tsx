import React, { createContext, useContext } from 'react'
import BaseConfig from './base.config.json'

type baseConfigType = typeof BaseConfig

interface PaasContextProps extends baseConfigType {}

export interface PaasConfig {
  children: React.ReactNode
}

const PaasContext = createContext<PaasContextProps>({
  ...BaseConfig,
})

export const PaasProvider = (props: PaasConfig) => {
  const value = {
    ...BaseConfig,
  }

  return <PaasContext.Provider value={value}>{props.children}</PaasContext.Provider>
}

export const usePassConfig = () => {
  const paasConfig = useContext(PaasContext)

  return paasConfig
}
