import {
  getMarketingSocialDistributionGetSocialDistributionStatusList,
  getMarketingSocialDistributionGetSocialDistributionLevelList,
} from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMarketingSocialDistributionGetSocialDistributionStatusList)
  const { data: dataLevelName } = useRequestApi(getMarketingSocialDistributionGetSocialDistributionLevelList)

  const selectData = useMemo(
    () => ({
      status: data?.map((item) => ({ label: item.name, value: item.status })),
      levelId: dataLevelName?.map((item) => ({ label: item.name, value: item.value })),
    }),
    [data, dataLevelName],
  )

  return selectData
}

export default useSelectOptions
