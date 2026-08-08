import { createContext, useContext, ReactNode, ReactElement } from 'react'

export type RootBasicContextProps<T extends any> = T & {}

export type ProviderWithChildren = ReactElement<{ children: ReactNode }>

export type ContainerProps = {
  containers: ProviderWithChildren[]
  children: ReactNode
}

export type ProvidersType = {
  type: React.ElementType
  props: any
}

export const RootBasicContext = createContext<RootBasicContextProps<any>>({})

export const useRootModule = () => {
  const ctx = useContext(RootBasicContext)
  return ctx
}

export const ProvidersContext = createContext<ProvidersType[]>([])
