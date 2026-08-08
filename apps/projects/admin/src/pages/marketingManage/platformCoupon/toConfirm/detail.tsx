/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:51:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:15:56
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import CouponDetail from '../components/CouponDetail'
import { getMarketingCouponPlatformWaitSubmitGet } from '@apps/apis'

const PlatformCouponToConfirmDetail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformWaitSubmitGet({
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

export default PlatformCouponToConfirmDetail
