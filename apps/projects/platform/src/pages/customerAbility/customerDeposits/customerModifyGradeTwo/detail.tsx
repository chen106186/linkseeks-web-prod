/*
 * @Description: 待审核客户变更(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberCustomerModifyGradeTwoDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const CustomerModifyGradeTwoDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberCustomerModifyGradeTwoDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default CustomerModifyGradeTwoDetails
