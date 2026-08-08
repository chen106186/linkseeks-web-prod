import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberMaintenanceDetailBasic } from '@apps/apis'
import { useMount, useRequestApi, useSetState } from '@linkseeks/hooks'
import { useMemberInfo } from '../contexts/memberContext'
import { useEffect } from 'react'
import { message as messageApi } from '@linkseeks/ui'
import { useHistory } from '@linkseeks/router-core'

const useMemberBasicInfo = (type: 'approved' | 'default' = 'default') => {
  const { id, validateId } = usePageStatus()
  const { setMemberMaintainInfo } = useMemberInfo()
  const history = useHistory()
  const { loading, error } = useRequestApi(getMemberMaintenanceDetailBasic, {
    defaultParams: [{ memberId: id, validateId, detailVersionType: type === 'approved' ? 0 : 1 }],
    onSuccess({ data }) {
      setMemberMaintainInfo(data)
    },
    onError({ message }) {
      messageApi.error(message)
      history.goBack()
    },
  })

  return {
    loading,
  }
}

export default useMemberBasicInfo
