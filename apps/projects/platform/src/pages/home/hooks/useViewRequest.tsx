import { IRequestSuccess } from '@/index.d'
import { authService } from '@apps/services'
import { useInViewport } from '@linkseeks/hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Options = {
  /** 是否进行权限过滤处理 */
  isFilterList: boolean
}
/***
 * 当下拉滚动到可视区域时请求数据
 */
function useViewRequest<T, P>(fn: (postData: P) => Promise<IRequestSuccess<T>>, params?: P, options?: Options) {
  const [loading, setLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [inViewPort, ref] = useInViewport<HTMLDivElement>()
  const [hasRequest, setHasRequest] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<T | null>(null)
  const userAuth = authService.getAuth()
  const urls = useMemo(() => authService.getAuthUrlList(authService.getAuthList()), [])
  const { isFilterList = true } = options || {}
  // const hasFetchingRef = useRef(false);

  const fetchData = useCallback(
    async (params) => {
      setLoading(() => true)
      try {
        const { data, code, message } = await fn(params)
        setHasRequest(true)
        // throw new Error("123");
        if (code === 1000) {
          setResponseData(data as T)
        }
      } catch (error) {
        setIsError(true)
      } finally {
        setHasRequest(true)
        setLoading(false)
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
    if (!responseData || !isFilterList) {
      return responseData
    }

    if (Array.isArray(responseData)) {
      return responseData
    }
    const result = {}
    if (!responseData) {
      return result
    }
    // console.log(responseData, "responData");

    Object.keys(responseData).forEach((_row) => {
      if (responseData[_row] && responseData[_row].length !== 0) {
        const tempData = responseData[_row]?.filter((_item) => urls.includes(_item.link))
        if (tempData.length !== 0) {
          result[_row] = tempData
        }
      }
    })
    // console.log(result, "result");
    return result
  }, [responseData])

  const isEmpty = useMemo(() => {
    return filterEmptyList && Object.keys(filterEmptyList).length === 0
  }, [filterEmptyList])

  return {
    loading,
    isError,
    ref,
    hasRequest,
    refresh,
    responseData,
    filterEmptyList,
    inViewPort,
    isEmpty,
  }
}

export default useViewRequest
