/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 11:40:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:12:07
 * @Description: 待审核入库资质详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositQualifyDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyComingQualificationsDetail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberSupplierDepositQualifyDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrVerifyComingQualificationsDetail
