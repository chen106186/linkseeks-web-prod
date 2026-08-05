import React, { useState } from 'react'
import type { ApiRequestConfig } from '@linkseeks/request'
import { useRouter } from './useRouter'

export interface IHttpRequestReturn<T> {
  data: T | null
  loading: boolean
  err: any
  run(params?: any)
}

/**
 * 简易版本的useRequest hooks， 用于处理带有loading的业务场景
 * @auth xjm
 */
export function useHttpRequest<T>(
  api: (params?, config?) => Promise<T>,
  config?: ApiRequestConfig & { back?: boolean },
): IHttpRequestReturn<T> {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [err, setErr] = useState()
  const { goBack } = useRouter()

  const run = (params) => {
    setLoading(true)
    api(params)
      .then((res: any) => {
        setData(res.data)
        if (res.code === 1000 && config && config.back) {
          setTimeout(() => {
            goBack()
          }, 1000)
        }
      })
      .catch((err) => {
        setErr(err)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 200)
      })
  }

  return {
    data,
    loading,
    err,
    run,
  }
}
