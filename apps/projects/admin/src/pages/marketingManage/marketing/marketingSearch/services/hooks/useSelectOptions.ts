import {
  getMarketingPlatformActivityGetOuterStatusList,
  getMarketingPlatformActivityGetInnerStatusList,
  getMarketingPlatformActivitySignupGetActivityTypeList,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingPlatformActivitySignupGetActivityTypeList)
  const { data: dataOuterStatus } = useRequestApi(getMarketingPlatformActivityGetOuterStatusList)
  const { data: dataInnerStatus } = useRequestApi(getMarketingPlatformActivityGetInnerStatusList)

  const selectData = useMemo(
    () => ({
      activityType: data?.map((item) => ({ label: item.name, value: item.status })),
      outerStatus: dataOuterStatus?.map((item) => ({ label: item.name, value: item.status })),
      innerStatus: dataInnerStatus?.map((item) => ({ label: item.name, value: item.status })),
    }),
    [data, dataOuterStatus, dataInnerStatus],
  )

  return selectData
}

export default useSelectOptions
