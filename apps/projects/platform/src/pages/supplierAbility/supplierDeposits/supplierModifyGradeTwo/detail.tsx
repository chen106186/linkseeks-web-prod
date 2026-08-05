/*
 * @Description: 待审核供应商变更(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierModifyGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierModifyGradeTwoDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierModifyGradeTwoDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default SupplierModifyGradeTwoDetails
