/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-25 17:00:46
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-23 17:09:45
 * @Description: 编辑商家优惠券
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import CouponForm from './components/CouponForm'

const MerchantCouponEdit: React.FC = () => {
  const { id } = usePageStatus()
  return <CouponForm id={+id} />
}

export default MerchantCouponEdit
