import React, { useCallback, useMemo } from 'react'
import { memberSchema } from '../../memberInspection/common/schema/addSchema'
import { memberColumns } from '../../memberInspection/common/columns/memberColumns'

type IRes<P> = {
  data: P
  code: number
}

const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}
/**
 * 获取下属会员
 */
export function useGetCommonSubMember<T, P = any>(api: (params: T) => Promise<IRes<P>>) {
  const schema = useMemo(() => memberSchema, [])
  const columns = useMemo(() => memberColumns, [])

  const handleFetchData = useCallback(
    async (params: T): Promise<P> => {
      const { data, code } = await api(params)
      if (code === 1000) {
        return data
      }
      return DEFAULT_RETURN_DATA as any
    },
    [api],
  )

  return { memberSchema: schema, memberColumns: columns, handleFetchData }
}
