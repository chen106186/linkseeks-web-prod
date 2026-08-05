/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:16:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:09:45
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import CouponDetail from '../components/CouponDetail'
import { getMarketingCouponPlatformWaitAuditOneGet } from '@apps/apis'

const PlatformCouponNotVerify1Detail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformWaitAuditOneGet({
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

export default PlatformCouponNotVerify1Detail
