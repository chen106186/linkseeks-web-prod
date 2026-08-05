/*
 * @Description: 待汇总评分结果详情
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
