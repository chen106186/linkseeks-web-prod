/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:44:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:12:20
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import CouponDetail from '../components/CouponDetail'
import { getMarketingCouponPlatformWaitAuditTwoGet } from '@apps/apis'

const PlatformCouponNotVerify2Detail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformWaitAuditTwoGet({
          id,
        }),
    },
    CouponDetail,
  )

  return (
    <div>
      <CouponDetailPro />
    </div>
  )
}

export default PlatformCouponNotVerify2Detail
