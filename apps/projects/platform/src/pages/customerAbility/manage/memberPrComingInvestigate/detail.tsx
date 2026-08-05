/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 14:02:55
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:05:54
 * @Description: 待审核入库考察-详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberDepositInspectDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrComingInvestigate: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberDepositInspectDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrComingInvestigate
