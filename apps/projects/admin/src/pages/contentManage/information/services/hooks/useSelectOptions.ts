import { getManageContentColumnAll } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getManageContentColumnAll)

  const selectData = useMemo(
    () => ({
      columnId: data?.map((item) => ({ label: item.name, value: item.id })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
