/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:44:29
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 16:44:29
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import { getMarketingCouponWaitAuditTwoGet } from '@apps/apis'

const MerchantCouponNotVerify2Detail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponWaitAuditTwoGet({
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

export default MerchantCouponNotVerify2Detail
