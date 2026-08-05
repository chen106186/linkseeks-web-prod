/*
 * @Description: 待审核变更申请单(二级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberCustomerLifecycleSummaryDetail } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import CustomerModifiesProfile from '../components/CustomerModifiesProfile'

const CustomerModifiesDetails: React.FC<any> = (props) => {
  const { id } = usePageStatus()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberCustomerLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  return <CustomerModifiesProfile loading={infoLoading} data={details} />
}

export default CustomerModifiesDetails
