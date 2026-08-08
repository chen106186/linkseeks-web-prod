import {
  getMarketingPlatformActivityGetOuterStatusList,
  getMarketingPlatformActivitySignupGetActivityTypeList,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingPlatformActivitySignupGetActivityTypeList)
  const { data: dataOuterStatus } = useRequestApi(getMarketingPlatformActivityGetOuterStatusList)

  const selectData = useMemo(
    () => ({
      activityType: data?.map((item) => ({ label: item.name, value: item.status })),
      outerStatus: dataOuterStatus?.map((item) => ({ label: item.name, value: item.status })),
    }),
    [data, dataOuterStatus],
  )

  return selectData
}

export default useSelectOptions
