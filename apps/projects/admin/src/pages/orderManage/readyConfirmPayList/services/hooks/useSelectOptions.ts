import { getOrderPlatformManagePageItems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getOrderPlatformManagePageItems)

  const selectData = useMemo(
    () => ({
      orderType: data?.orderTypes?.map((item) => ({ label: item.text, value: item.id })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
