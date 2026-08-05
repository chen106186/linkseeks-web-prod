import { getTradeProductInquiryExternalStateEnum } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getTradeProductInquiryExternalStateEnum)

  const selectData = useMemo(
    () => ({
      externalState: data?.map((item) => ({ label: item.name, value: item.state })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
