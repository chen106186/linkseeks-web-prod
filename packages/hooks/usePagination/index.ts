import { useMemo } from 'react'
import useMemoizedFn from '../useMemoizedFn'
import useRequest from '../useRequest'

import type { Data, PaginationOptions, Params, Service, PaginationResult } from './types'
import { ApiResult } from '../useRequest/useRequestApi'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_CURRENT = 1
function transformPageNumber(params) {
  return {
    ...params,
    current: Number(params?.current || DEFAULT_CURRENT),
    pageSize: Number(params?.pageSize || DEFAULT_PAGE_SIZE),
  }
}
const usePagination = <TData extends ApiResult<Data>, TParams extends Params>(
  service: Service<TData, TParams>,
  options: PaginationOptions<TData, TParams> = {},
) => {
  const { defaultPageSize = DEFAULT_PAGE_SIZE, defaultCurrent = DEFAULT_CURRENT, ...rest } = options
  const result = useRequest(service, {
    defaultParams: [{ current: defaultCurrent, pageSize: defaultPageSize }],
    refreshDepsAction: () => {
      changeCurrent(DEFAULT_CURRENT)
    },
    ...rest,
  })

  const { current = defaultCurrent, pageSize = defaultPageSize } = (transformPageNumber(result.params[0]) || {}) as {
    current: number
    pageSize: number
  }

  const total = result.data?.totalCount || result.data?.data?.totalCount || 0
  const totalPage = useMemo(() => Math.ceil(total / pageSize), [pageSize, total])

  const onChange = (c: number, p: number) => {
    let toCurrent = c <= 0 ? 1 : c
    const toPageSize = p <= 0 ? 1 : p
    const tempTotalPage = Math.ceil(total / toPageSize)
    if (toCurrent > tempTotalPage) {
      toCurrent = Math.max(1, tempTotalPage)
    }

    const [oldPaginationParams = {}, ...restParams] = result.params || []

    result.run(
      {
        ...oldPaginationParams,
        current: toCurrent,
        pageSize: toPageSize,
      },
      ...restParams,
    )
  }

  const changeCurrent = (c: number) => {
    onChange(c, pageSize)
  }

  const changePageSize = (p: number) => {
    onChange(current, p)
  }

  return {
    ...result,
    pagination: {
      current,
      pageSize,
      total,
      totalPage,
      onChange: useMemoizedFn(onChange),
      changeCurrent: useMemoizedFn(changeCurrent),
      changePageSize: useMemoizedFn(changePageSize),
    },
  } as PaginationResult<TData, TParams>
}

export default usePagination
