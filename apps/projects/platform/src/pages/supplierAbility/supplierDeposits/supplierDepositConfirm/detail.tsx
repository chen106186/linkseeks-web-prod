/*
 * @Description: 待确认入库审查详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositConfirmDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierDepositConfirmDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositConfirmDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default SupplierDepositConfirmDetails
