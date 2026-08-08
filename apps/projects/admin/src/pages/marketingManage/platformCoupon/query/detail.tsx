/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 15:55:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:20:51
 * @Description: 商家优惠券查询详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import CouponDetail from '../components/CouponDetail'
import { getMarketingCouponPlatformSummaryGet } from '@apps/apis'

const PlatformCouponQueryDetail: React.FC<{}> = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformSummaryGet({
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

export default PlatformCouponQueryDetail
