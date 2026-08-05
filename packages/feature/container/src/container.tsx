import React, { createContext, FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { ProvidersContext, ProvidersType, RootBasicContext, RootBasicContextProps } from './context'

export type ProvidersContextProps = ProvidersType[]

export type NestContainerProps = {
  containers: ProvidersType[]
  children: ReactNode
}

const isProviderWithValue = (provider: ProvidersType) => {
  return (provider.type as any).displayName === 'Provider' && 'value' in provider.props
}

export interface RootContainerProps<T> {
  modules?: Record<string, T>
  children?: React.ReactNode
}

/**
 * 所有前端项目的基本容器
 * 不应该包含任何业务性质
 */
export const BaseContainer: React.FC<RootContainerProps<any>> = (props) => {
  const { modules, children } = props

  const ContextValue: RootBasicContextProps<typeof modules> = {
    // 这里做一些系统的全局性数据
  }

  return <RootBasicContext.Provider value={ContextValue}>{children}</RootBasicContext.Provider>
}

const renderProviders = (providers: ProvidersContextProps, children: ReactNode) => {
  if (!providers.length) {
    return children
  }

  const [{ type: ProviderComponent, props }, ...resetProviders] = providers
  return <ProviderComponent {...props}>{renderProviders(resetProviders, children)}</ProviderComponent>
}

/**
 * 容器的业务嵌套，理论上我们可以传入不同的Provider供项目使用
 */
export const NestContainer: React.FC<NestContainerProps> = ({ containers, children }) => {
  if (!containers.every(isProviderWithValue)) {
    console.warn('All containers must be Provider components with value prop')
  }

  return <BaseContainer>{renderProviders(containers, children)}</BaseContainer>
}
