/*
 * @Description: 待审核供应商变更(一级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierModifyGradeOneDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierModifyGradeOneDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierModifyGradeOneDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default SupplierModifyGradeOneDetails
