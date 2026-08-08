/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:16:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-06 16:59:22
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import { getMarketingCouponWaitAuditOneGet } from '@apps/apis'

const MerchantCouponNotVerify1Detail: React.FC = () => {
  const { id } = usePageStatus()

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponWaitAuditOneGet({
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

export default MerchantCouponNotVerify1Detail
