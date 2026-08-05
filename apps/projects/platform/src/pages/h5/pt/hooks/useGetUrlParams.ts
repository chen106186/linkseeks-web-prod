import { useMemo, useState } from 'react'

function useGetUrlParams<T extends Record<string, any>>() {
  const url = window.location.href

  const params: T = useMemo(() => {
    const pattern = new RegExp(/(\w+)=(\w+)/, 'gi')
    const res: T = {} as T
    url.replace(pattern, (match, p1, p2) => {
      ;(res as any)[p1] = p2
      return `${p1}=${p2}`
    })
    return res
  }, [url])

  return { params }
}

export default useGetUrlParams
