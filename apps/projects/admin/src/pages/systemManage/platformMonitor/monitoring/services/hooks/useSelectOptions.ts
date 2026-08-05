import { getApiErrorRecordGetDataFlow, getApiErrorRecordGetTitles } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo, useState, useEffect } from 'react'

const useSelectOptions = () => {
  const [data, setData] = useState([])
  const [dataUrl, setDataUrl] = useState([])

  const getDateFlow = () => {
    getApiErrorRecordGetDataFlow({}, { useApiPrefix: true }).then((res) => {
      if (res.code === 1000 && res.data) {
        setData(res.data)
      }
    })
  }

  const getTitles = () => {
    getApiErrorRecordGetTitles({}, { useApiPrefix: true }).then((res) => {
      if (res.code === 1000 && res.data) {
        setDataUrl(res.data)
      }
    })
  }

  useEffect(() => {
    getDateFlow()
    getTitles()
  }, [])

  const selectData = useMemo(
    () => ({
      type: data?.map((item) => ({ label: item.title, value: item.type })),
      url: dataUrl?.map((item) => ({ label: item.title, value: item.url })),
    }),
    [data, dataUrl],
  )

  return selectData
}

export default useSelectOptions
