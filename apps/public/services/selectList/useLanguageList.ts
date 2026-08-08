import { useMemo } from 'react'
import { getCommodityLanguageGetLanguageList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

/**
 * 获取以label,value形式的 语言列表
 * 同时提供默认语言，取列表中的第一项
 */
export const useLanguageList = () => {
  const { data, loading } = useRequestApi(getCommodityLanguageGetLanguageList, {
    cacheKey: 'language-list',
    staleTime: -1,
  })

  const defaultLanguage = useMemo(() => {
    return (
      data?.[0] || {
        label: '简体中文',
        value: 'zh-CN',
      }
    )
  }, [data])
  return {
    data: data || [],
    loading,
    defaultLanguage,
  }
}

export default useLanguageList
