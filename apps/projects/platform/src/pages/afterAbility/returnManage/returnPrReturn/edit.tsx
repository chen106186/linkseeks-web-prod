/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-04 17:22:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:07:58
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrReturnVerify: React.FC = () => {
  const { id } = usePageStatus()

  return (
    <>
      <DetailInfo id={id} target="/afterAbility/returnManage/returnPrReturn" isEditRefund />
    </>
  )
}

export default ReturnPrReturnVerify
