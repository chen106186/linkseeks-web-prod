import { getEnhanceSupplierAllOuterAndInner } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getEnhanceSupplierAllOuterAndInner)

  const selectData = useMemo(
    () => ({
      outerStatus: data?.outerList?.map((item: any) => ({ label: item.message, value: item.code })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
