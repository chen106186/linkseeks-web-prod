/*
 * @Description: 待审核客户变更(一级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerModifyGradeOneDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerModifyGradeOneDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerModifyGradeOneDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default CustomerModifyGradeOneDetails
