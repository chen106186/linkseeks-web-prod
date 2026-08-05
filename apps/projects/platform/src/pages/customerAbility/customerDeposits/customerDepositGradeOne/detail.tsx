/*
 * @Description: 待审核入库(一级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerDepositGradeOneDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerDepositGradeOneDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositGradeOneDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default CustomerDepositGradeOneDetails
