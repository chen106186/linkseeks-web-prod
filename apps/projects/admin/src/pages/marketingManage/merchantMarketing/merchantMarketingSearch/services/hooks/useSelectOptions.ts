import {
  getMarketingPlatformMerchantActivityGetActivityTypeList,
  getMarketingPlatformMerchantActivityGetInnerStatusList,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingPlatformMerchantActivityGetActivityTypeList)
  const { data: dataInner } = useRequestApi(getMarketingPlatformMerchantActivityGetInnerStatusList)

  const selectData = useMemo(
    () => ({
      activityType: data?.map((item) => ({ label: item.name, value: item.status })),
      innerStatus: dataInner?.map((item) => ({ label: item.name, value: item.status })),
    }),
    [data, dataInner],
  )

  return selectData
}

export default useSelectOptions
