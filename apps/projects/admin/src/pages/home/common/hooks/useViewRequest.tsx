import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInViewport } from '@linkseeks/hooks'

interface ResponseDataType {
  code: number
  message: string
}

/***
 * 当下拉滚动到可视区域时请求数据
 */
function useViewRequest<T, P>(fn: (postData: P) => Promise<ResponseDataType & { data: T }>, params?: P) {
  const [loading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [inViewPort, ref] = useInViewport<HTMLDivElement>()
  const [hasRequest, setHasRequest] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<T | null>(null)
  // const hasFetchingRef = useRef(false);

  const fetchData = useCallback(
    async (params) => {
      setLoading(() => true)
      try {
        const { data, code, message } = await fn(params)
        setHasRequest(() => true)
        // throw new Error("123");
        if (code === 1000) {
          setResponseData(data as T)
        }
      } catch (error) {
        setIsError(() => true)
      } finally {
        setHasRequest(() => true)
        setLoading(() => false)
      }
    },
    [fn],
  )

  useEffect(() => {
    if (!inViewPort || !fn || loading || hasRequest) {
      return
    }
    async function init() {
      // hasFetchingRef.current = true
      await fetchData(params)
    }
    init()
  }, [inViewPort])

  const refresh = async <T1 extends P>(refreshParams: T1) => {
    fetchData(refreshParams || params)
  }

  const filterEmptyList = useMemo(() => {
    if (!responseData) {
      return responseData
    }

    if (Array.isArray(responseData)) {
      return responseData
    }
    const result = {}
    if (!responseData) {
      return result
    }
    Object.keys(responseData).forEach((_row) => {
      if (responseData[_row] && responseData[_row].length !== 0) {
        result[_row] = responseData[_row]
      }
    })
    return result
  }, [responseData])
  return { loading, isError, ref, hasRequest, refresh, responseData, filterEmptyList, inViewPort }
}

export default useViewRequest
