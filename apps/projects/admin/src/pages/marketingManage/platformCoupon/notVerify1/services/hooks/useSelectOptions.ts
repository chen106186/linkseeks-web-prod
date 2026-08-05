import { getMarketingCouponPlatformTypeList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingCouponPlatformTypeList)

  const selectData = useMemo(
    () => ({
      type: data?.map((item) => ({ label: item.name, value: item.value })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
