/*
 * @Description: 待审核入库资质详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositQualifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const SupplierDepositQualifyDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositQualifyDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default SupplierDepositQualifyDetails
