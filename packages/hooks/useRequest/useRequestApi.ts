import { Service, Options, Plugin } from './types'
import useRequest from './useRequest'

export interface ApiResult<TData> {
  data: TData | null
  message: string
  code: number
  response: any
}

/**
 * 专门给直接调用@apps/apis中的接口使用的hook
 *
 * 可以避免 data.data 才能拿到数据的情况
 */
const useRequestApi = <TData, TParams extends any[]>(
  api: Service<ApiResult<TData>, TParams>,
  options?: Options<ApiResult<TData>, TParams>,
  plugins?: Plugin<ApiResult<TData>, TParams>[],
) => {
  const { data, ...reset } = useRequest(api, options, plugins)
  return {
    data: data?.data || null,
    ...reset,
  }
}

export default useRequestApi
