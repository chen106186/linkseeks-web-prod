import { getMemberManagePageitems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(getMemberManagePageitems, { defaultParams: [{ roleTypeEnum: '2' }] })

  const selectData = useMemo(
    () => ({
      level: data?.levels?.map((_item) => ({ label: _item.levelTag, value: _item.level })),
      roleId: data?.roles?.map((_item) => ({ label: _item.roleName, value: _item.roleId })),
      memberType: data?.memberTypes?.map((_item) => ({
        label: _item.memberTypeName,
        value: _item.memberType,
      })),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
