import { getMemberManagePageitems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMemberManagePageitems)

  const selectData = useMemo(
    () => ({
      memberType: data?.memberTypes?.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
      roleId: data?.roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
      level: data?.levels?.map((item) => ({ label: item.levelTag, value: item.level })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
