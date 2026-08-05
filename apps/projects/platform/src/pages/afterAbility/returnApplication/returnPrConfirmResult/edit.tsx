/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:59:39
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrConfirmResultVerify: React.FC = () => {
  const { id } = usePageStatus()

  return (
    <>
      <DetailInfo id={id} target="/afterAbility/returnApplication/returnPrConfirmResult" isEditRefund />
    </>
  )
}

export default ReturnPrConfirmResultVerify
