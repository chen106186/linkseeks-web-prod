/*
 * @Description: 变更申请单查询详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberSupplierLifecycleSummaryDetail } from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import SupplierModifiesProfile from '../components/SupplierModifiesProfile'

const SupplierModifiesDetails: React.FC<any> = (props) => {
  const { id } = usePageStatus()

  const { data: details, loading: infoLoading } = useHttpRequest(
    () => getMemberSupplierLifecycleSummaryDetail({ id }),
    { manual: false },
  )

  return <SupplierModifiesProfile loading={infoLoading} data={details} />
}

export default SupplierModifiesDetails
