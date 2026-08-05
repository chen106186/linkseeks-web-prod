/*
 * @Description: 待确认会员变更详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierModifyConfirmDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierModifyConfirmDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierModifyConfirmDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default SupplierModifyConfirmDetails
