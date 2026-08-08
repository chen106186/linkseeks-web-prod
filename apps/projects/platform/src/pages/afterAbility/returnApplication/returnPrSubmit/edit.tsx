/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-25 10:55:26
 * @Description:
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnForm from './components/ReturnForm'

const EditReturn: React.FC = () => {
  const { id } = usePageStatus()

  return <ReturnForm id={id} isEdit />
}

export default EditReturn
