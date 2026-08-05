/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 10:26:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:08:34
 * @Description: 待确认会员变更详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberModifyConfirmDetail } from '@apps/apis'
import MemberProfile from '../../components/MemberProfile'

const MemberPrVerifyChangeConfirmDetail: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const { data: dataSource, loading } = useHttpRequest(() => getMemberModifyConfirmDetail({ validateId }), {
    manual: false,
  })

  return <MemberProfile dataSource={dataSource} loading={loading} showNew />
}

export default MemberPrVerifyChangeConfirmDetail
