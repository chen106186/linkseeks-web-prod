import { getMemberManagePageitems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMemberManagePageitems)

  const selectData = useMemo(
    () => ({
      memberType: data?.memberTypes?.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
      memberRoleId: data?.roles?.map((item) => ({ label: item.roleName, value: item.roleId })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
