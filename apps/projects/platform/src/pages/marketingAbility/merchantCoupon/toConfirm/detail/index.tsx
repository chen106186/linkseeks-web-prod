/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:51:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 16:51:17
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import { getMarketingCouponWaitSubmitGet } from '@apps/apis'

const MerchantCouponToConfirmDetail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponWaitSubmitGet({
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

export default MerchantCouponToConfirmDetail
