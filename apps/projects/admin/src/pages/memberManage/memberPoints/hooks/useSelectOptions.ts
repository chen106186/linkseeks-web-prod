import { getMemberMemberPointsGetPageCondition } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMemberMemberPointsGetPageCondition) as any

  const selectData = useMemo(
    () => ({
      subRoleId: data?.roleIdAndName,
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
