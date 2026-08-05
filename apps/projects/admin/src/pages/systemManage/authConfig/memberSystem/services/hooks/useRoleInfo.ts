import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { getMemberManageRoleGet } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'

const useRoleInfo = () => {
  const { pageStatus, id } = usePageStatus()
  const { data, loading } = useRequestApi(getMemberManageRoleGet, { defaultParams: [{ roleId: id }], ready: !!id })

  return {
    editable: pageStatus !== PageStatus.PREVIEW,
    roleInfo: {
      ...data,
      imFlag: !!data?.imFlag,
    },
    loading,
  }
}

export default useRoleInfo
