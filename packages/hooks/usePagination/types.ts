import type { Options, Result } from '../useRequest/types'
import { ApiResult } from '../useRequest/useRequestApi'

export type Data = { totalCount: number; data: any[] }

export type Params = [{ current: string; pageSize: string; [key: string]: any }, ...any[]]

export type Service<TData extends ApiResult<Data>, TParams extends Params> = (...args: TParams) => Promise<TData>

export interface PaginationResult<TData extends Data, TParams extends Params> extends Result<TData, TParams> {
  pagination: {
    current: number
    pageSize: number
    total: number
    totalPage: number
    onChange: (current: number, pageSize: number) => void
    changeCurrent: (current: number) => void
    changePageSize: (pageSize: number) => void
  }
}

export interface PaginationOptions<TData extends ApiResult<Data>, TParams extends Params>
  extends Options<TData, TParams> {
  defaultPageSize?: number
  defaultCurrent?: number
}
