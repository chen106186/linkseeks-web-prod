import { getMemberValidateConfirmPageitems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMemberValidateConfirmPageitems)

  const selectData = useMemo(
    () => ({
      memberType: data?.memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
      roleId: data?.memberRoles.map((item) => ({ label: item.roleName, value: item.roleId })),
      level: data?.memberLevels.map((item) => ({ label: item.levelTag, value: item.level })),
      source: data?.source.map((item) => ({ label: item.text, value: item.id })),
      innerStatus: data?.innerStatus.map((item) => ({ label: item.text, value: item.id })),
      outerStatus: data?.outerStatus.map((item) => ({ label: item.text, value: item.id })),
      status: data?.status.map((item) => ({ label: item.text, value: item.id })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
