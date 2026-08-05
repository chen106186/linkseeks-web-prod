import React, { useCallback, useEffect, useState } from 'react'

/**
 * 获取详情
 */

type ParamsType = {
  id: number
}

type HeadersType = {
  [key: string]: any
}

type Ires<T> = {
  code: number
  data: T
  message: string
}

function useInitialValue<T, P>(
  api: (params: P, headers?: HeadersType) => Promise<Ires<T>>,
  params: P,
  headers?: HeadersType,
): { loading: boolean; initialValue: T; refresh: (params: P) => void } {
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValue, setInitialValue] = useState<null | T>(null)

  const fetchData = useCallback(
    async (params) => {
      setLoading(true)
      const { data, code } = await api(params)
      setLoading(false)
      if (code === 1000) {
        setInitialValue(data)
      }
    },
    [headers],
  )

  useEffect(() => {
    if (!params) {
      return
    }
    fetchData(params)
  }, [])

  const refresh = useCallback((params) => {
    fetchData(params)
  }, [])

  return { loading, initialValue: initialValue as T, refresh }
}

export default useInitialValue
