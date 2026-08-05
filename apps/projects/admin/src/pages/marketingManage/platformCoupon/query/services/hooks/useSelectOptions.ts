import { getMarketingCouponPlatformPageCondition } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingCouponPlatformPageCondition)

  const selectData = useMemo(
    () => ({
      type: data?.typeList?.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
      getWay: data?.getWayList?.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
      status: data?.statusList?.map((item) => ({ label: item.name, value: item.value })).filter((item) => item.value),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
