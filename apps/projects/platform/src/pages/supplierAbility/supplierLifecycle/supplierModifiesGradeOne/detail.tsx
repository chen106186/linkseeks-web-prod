/*
 * @Description: 待审核变更申请单(一级)详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberSupplierLifecycleSummaryDetail } from '@apps/apis'
import SupplierModifiesProfile from '../components/SupplierModifiesProfile'
import { useHttpRequest } from '@/hooks/useHttpRequest'

const SupplierModifiesDetails: React.FC<any> = (props) => {
  const { id } = usePageStatus()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberSupplierLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  return <SupplierModifiesProfile loading={infoLoading} data={details} />
}

export default SupplierModifiesDetails
