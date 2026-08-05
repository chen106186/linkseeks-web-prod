import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberMaintenanceDetailBasic } from '@apps/apis'
import { useMount, useRequestApi, useSetState } from '@linkseeks/hooks'
import { useMemberInfo } from '../contexts/memberContext'
import { useEffect } from 'react'

const useMemberBasicInfo = () => {
  const { id, validateId } = usePageStatus()
  const { setMemberMaintainInfo } = useMemberInfo()
  const { loading } = useRequestApi(getMemberMaintenanceDetailBasic, {
    defaultParams: [{ memberId: id, validateId }],
    onSuccess({ data }) {
      setMemberMaintainInfo(data)
    },
  })

  return {
    loading,
  }
}

export default useMemberBasicInfo
