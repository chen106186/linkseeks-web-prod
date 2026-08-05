import { getPurchaseBiddingExternalStatus } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getPurchaseBiddingExternalStatus)

  const selectData = useMemo(
    () => ({
      externalState: data?.map((item) => ({ label: item.name, value: item.satatus })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
