import { getLogisticsOrderSubmitStatusList, getLogisticsPlatformSelectListMemberCompanyQuery } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getLogisticsOrderSubmitStatusList)
  const { data: dataCompany } = useRequestApi(getLogisticsPlatformSelectListMemberCompanyQuery)

  const selectData = useMemo(
    () => ({
      status: data?.map((item) => ({ label: item.message, value: item.code })),
      companyId: dataCompany?.map((item) => ({ label: item.name, value: item.id })),
    }),
    [data, dataCompany],
  )

  return selectData
}

export default useSelectOptions
