/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 18:02:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:10:47
 * @Description: 待确认入库
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberDepositConfirmDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyComingConfirmDetail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberDepositConfirmDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default MemberPrVerifyComingConfirmDetail
