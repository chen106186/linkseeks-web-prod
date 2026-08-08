import { useEffect, useState } from 'react'

type ResponseType<T> = {
  data: T
  code: number
  message: string
}

type Options<Q, R> = {
  id: string
  api: (params: { id: string }) => Promise<ResponseType<Q>>
  logApi: (params: { goodsId: string }) => Promise<ResponseType<R>>
}

function useGetInitialValueDetail<T, R extends any[]>(options: Options<T, R>) {
  const [initialValue, setInitialValue] = useState<T>(null)

  useEffect(() => {
    async function getInitialValue() {
      const { data, code } = await options.api({ id: options.id })
      if (code === 1000) {
        setInitialValue(data)
      }
    }
    getInitialValue()
  }, [])

  return { initialValue }
}

export default useGetInitialValueDetail
