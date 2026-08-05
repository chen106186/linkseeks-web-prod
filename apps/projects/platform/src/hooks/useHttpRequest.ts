import React, { useState, useEffect } from 'react';
import { IApiRequest } from '@/utils/request';
import { IRequestSuccess } from '..';

export type CombineService<R, P extends any[]> = ((...args: P) => Promise<IRequestSuccess<R>>)

export interface IHttpRequestReturn<R, P extends any[]> {
  data: R | null,
  loading: boolean,
  err: any,
  run: CombineService<R, P>,
}

export interface useHttpRequestConfig extends IApiRequest {
  /**
   * 是否手动触发请求，默认 true
   */
  manual?: boolean
}

/**
 * 简易版本的useRequest hooks， 用于处理带有loading的业务场景
 * @auth xjm
 */
export function useHttpRequest<R, P extends any[] = any>(api: CombineService<R, P>, selfConfig?: useHttpRequestConfig): IHttpRequestReturn<R, P> {
  const {
    manual = true,
  } = selfConfig || {}

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<R | null>(null)
  const [err, setErr] = useState()

  const run: CombineService<R, P> = (...rest) => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      api(...rest).then((res) => {
        setData(res.data)
        resolve(res)
      }).catch(err => {
        setErr(err)
        reject(err)
      }).finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 200)
      })
    })
  }

  useEffect(() => {
    if (!manual) {
      // @ts-ignore
      run();
    }
  }, [])

  return {
    data,
    loading,
    err,
    run
  }
}
