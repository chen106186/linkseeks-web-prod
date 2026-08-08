import { postMemberManagePlatformMarketingInvitePageItems } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import { message } from 'antd'
import { useMemo } from 'react'

const useSelectOptions = () => {
  const { data } = useRequestApi(postMemberManagePlatformMarketingInvitePageItems, { ctlType: 'none' })
  message.destroy()
  const selectData = useMemo(
    () => ({
      level: data?.levels.map((item) => {
        return { label: item.levelTag, value: item.level }
      }),
      roleId: data?.roles.map((item) => {
        return { label: item.roleName, value: item.roleId }
      }),
      memberType: data?.memberTypes.map((item) => {
        return { label: item.name, value: item.value }
      }),
    }),
    [data],
  )

  return selectData
}

export default useSelectOptions
