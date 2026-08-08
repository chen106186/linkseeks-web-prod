/*
 * @Description: 待审核入库(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerDepositGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerDepositGradeTwoDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerDepositGradeTwoDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default CustomerDepositGradeTwoDetails
