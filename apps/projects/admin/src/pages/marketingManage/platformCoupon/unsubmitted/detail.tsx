/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 18:16:30
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-06 17:01:54
 * @Description: 待提交商家优惠券详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import CouponDetail from '../components/CouponDetail'
import { getMarketingCouponPlatformWaitAuditGet } from '@apps/apis'

const PlatformCouponUnsubmittedDetail: React.FC<{}> = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformWaitAuditGet({
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

export default PlatformCouponUnsubmittedDetail
