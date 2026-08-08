/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 15:55:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 17:49:27
 * @Description: 商家优惠券查询详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import { getMarketingCouponSummaryGet } from '@apps/apis'

const MerchantCouponQueryDetail: React.FC<{}> = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponSummaryGet({
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

export default MerchantCouponQueryDetail
