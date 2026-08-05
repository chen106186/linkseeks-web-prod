import { getMarketingPlatformActivitySignupGetActivityTypeList } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingPlatformActivitySignupGetActivityTypeList)

  const selectData = useMemo(
    () => ({
      activityType: data?.map((item) => ({ label: item.name, value: item.status })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
