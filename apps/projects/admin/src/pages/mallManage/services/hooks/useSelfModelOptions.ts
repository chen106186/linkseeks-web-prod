import { getCommoditySelfShopModelSelfShopModelList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelfModelOptions = () => {
  const { data, loading } = useRequestApi(getCommoditySelfShopModelSelfShopModelList)

  const selectData = useMemo(
    () => ({
      selfShopModelId: data?.map((item) => ({ label: item.name, value: item.id })),
    }),
    [data],
  )

  return selectData
}

export default useSelfModelOptions
