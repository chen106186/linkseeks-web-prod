import { getAftersalesRepairGoodsPageItems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getAftersalesRepairGoodsPageItems)

  const selectData = useMemo(
    () => ({
      outerStatus: data?.outerStatusList
        ?.map((item) => ({ label: item.name, value: item.status }))
        .filter((item) => item.value),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
