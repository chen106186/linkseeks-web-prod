import { useEffect, useState } from 'react'

type ResponseType<T> = {
  data: T
  code: number
  message: string
}

type Options<Q, R> = {
  id: string
  api: (params: { id: string }) => Promise<ResponseType<Q>>
  logApi: (params: { materielId: string }) => Promise<ResponseType<R>>
}

function useGetInitialValueDetail<T, R extends any[]>(options: Options<T, R>) {
  const [initialValue, setInitialValue] = useState<T>(null)
  const [record, setRecord] = useState<R>([] as R)

  const isValidJson = (str) => {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  useEffect(() => {
    async function getInitialValue() {
      const { data, code } = (await options.api({ id: options.id })) as any
      if (code === 1000 && data) {
        setInitialValue({
          ...data,
          materielVersionResponse: {
            ...data?.materielVersionResponse,
            materiel: isValidJson(data?.materielVersionResponse.materiel)
              ? JSON.parse(data?.materielVersionResponse.materiel)
              : {},
          },
        })
      }
    }
    getInitialValue()
  }, [])

  useEffect(() => {
    if (!options.logApi) {
      return
    }
    async function getLogger() {
      const { data, code } = await options.logApi({ materielId: options.id })
      if (code === 1000) {
        setRecord(data)
      }
    }
    getLogger()
  }, [])

  return { initialValue, record }
}

export default useGetInitialValueDetail
