/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-25 10:55:49
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import RepairForm from './components/RepairForm'

const AddRepair: React.FC = () => {
  const { orderId, orderType } = usePageStatus()

  return <RepairForm orderId={orderId} orderType={+orderType} isEdit />
}

export default AddRepair
