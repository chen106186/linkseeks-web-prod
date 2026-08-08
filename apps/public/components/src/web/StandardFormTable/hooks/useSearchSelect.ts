import { useRequestApi } from '@linkseeks/hooks'

/**
 * 表格上方的筛选条件
 */
const useSearchSelect = (service: any) => {
  const { data, loading } = useRequestApi(service, { ready: !!service })

  return {
    data,
    loading,
  }
}

export default useSearchSelect
