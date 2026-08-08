/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-18 11:24:25
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrConfirmBackVerify: React.FC = () => {
  const { id } = usePageStatus()

  return (
    <>
      <DetailInfo id={id} target="/afterAbility/returnApplication/returnPrConfirmBack" isEditRefundDeliver />
    </>
  )
}

export default ReturnPrConfirmBackVerify
