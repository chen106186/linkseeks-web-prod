/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-07 19:51:22
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrReceivedVerify: React.FC = () => {
  const { id } = usePageStatus()

  return (
    <>
      <DetailInfo id={id} target="/afterAbility/returnManage/returnPrReceived" isEditRefundDeliver />
    </>
  )
}

export default ReturnPrReceivedVerify
