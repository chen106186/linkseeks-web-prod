import { useCallback } from 'react'

interface ResultType {
  totalCount: number
  data: any[]
}

interface IdefaultRes<T> {
  code: number
  data: T
  message: string
}

function useFetchList() {
  const fetchListData = useCallback(
    async <T extends Object, P extends ResultType>(
      api: (params: T) => Promise<IdefaultRes<P>>,
      params: T,
    ): Promise<P> => {
      const { code, data } = await api(params)
      if (code === 1000) {
        return data
      }

      return {
        totalCount: 0,
        data: [],
      } as any
    },
    [],
  )
  return { fetchListData }
}

export default useFetchList
