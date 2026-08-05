import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ActionType, FormSearchType, LinkageAction, SearchFieldProps } from '../types'
import { Form } from '@linkseeks/ui'
import { useMemoizedFn } from '@linkseeks/hooks'
import useCacheQuery from '../hooks/useCacheQuery'
import { getCurrentRouter } from '@linkseeks/router-core'

const StandardFormTableContext = createContext<ReturnType<StandardFormTableContextProps>>({} as any)

const useCreateTableRef = ({ cacheId }) => {
  const actionRef = useRef<ActionType>({} as ActionType)
  const linkagesRef = useRef<any>({})
  const [form] = Form.useForm()
  const cacheQuery = useCacheQuery()

  const cacheFormData = useMemo(() => {
    if (cacheId) {
      return cacheQuery.getCacheData(cacheId)
    }
  }, [cacheId])

  const { cache: isCache } = getCurrentRouter(location.pathname) || {}

  useEffect(() => {
    // 如果缓存数据存在，则使用缓存查询条件
    if (cacheFormData) {
      form.setFieldsValue(cacheFormData.search)
    }
  }, [cacheFormData])
  const tableValue = {
    actionRef,
    formSearchRef: form,
    setActionRef(newRef: ActionType) {
      actionRef.current = newRef
    },
    setLinkages(name: string, fn: any) {
      console.log(`${name} 字段已注册联动`)
      linkagesRef.current[name] = fn
    },
    handleChangeValues: useMemoizedFn((formValue, linkageAction: LinkageAction) => {
      formValue.forEach((field) => {
        const key = field.name.join(',')
        const value = field.value
        linkagesRef.current[key] && linkagesRef.current[key](value, linkageAction, form)
      })
    }),
    cacheQuery,
    cacheId,
    isCache,
  }

  return tableValue
}

export type StandardFormTableContextProps = typeof useCreateTableRef

export const StandardFormTableProvider = ({ children, initValue }) => {
  const { cacheId = location.pathname } = initValue || {}
  const dispatchValue = useCreateTableRef({ cacheId })

  return <StandardFormTableContext.Provider value={dispatchValue}>{children}</StandardFormTableContext.Provider>
}

export const useFormTable = () => {
  const formTable = useContext(StandardFormTableContext)

  return formTable
}
