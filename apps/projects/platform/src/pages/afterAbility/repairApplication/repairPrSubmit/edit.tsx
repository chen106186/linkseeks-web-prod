/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-25 10:55:56
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import RepairForm from './components/RepairForm'

const EditRepair: React.FC = () => {
  const { id } = usePageStatus()

  return <RepairForm id={id} isEdit />
}

export default EditRepair
