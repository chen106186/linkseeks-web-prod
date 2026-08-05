import { useCallback, useMemo } from 'react'
import { getCommodityCountryAreaGetCountryAreaSelectList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

/**
 * 获取以label,value形式的 国家地区
 */
export const useCountryCodeList = () => {
  const { data, run, runAsync, loading } = useRequestApi(getCommodityCountryAreaGetCountryAreaSelectList, {
    cacheKey: 'countryCode-list',
    staleTime: -1,
  })

  const dispatchData = useMemo(() => {
    if (data) {
      return data.map((v) => ({
        label: v.name,
        value: v.code,
      }))
    } else {
      return []
    }
  }, [data])

  const telList = useMemo(() => {
    if (data) {
      return data.map((v) => ({
        label: `${v.code} ${v.telCode}`,
        value: v.telCode,
      }))
    }
  }, [data])

  const getTelLength = useCallback(
    (telCode: string) => {
      if (data) {
        return data.find((v) => v.telCode === telCode)?.telLength || 0
      } else {
        return 0
      }
    },
    [data],
  )

  const getCountryCode = useCallback(
    (countryCodeValue: any) => {
      if (dispatchData) {
        return dispatchData.find((v) => v.value === countryCodeValue)
      } else {
        return {
          label: '',
          value: '',
        }
      }
    },
    [dispatchData],
  )

  const defaultTelCode = useMemo(() => {
    return data?.[0].telCode || ''
  }, [data])

  const defaultCountryCode = useMemo(() => {
    return dispatchData?.[0]
  }, [dispatchData])
  return {
    countryCodeList: dispatchData || [],
    refresh: run,
    refreshAsync: runAsync,
    telList,
    getTelLength,
    getCountryCode,
    defaultTelCode,
    defaultCountryCode,
    loading,
  }
}

export default useCountryCodeList
