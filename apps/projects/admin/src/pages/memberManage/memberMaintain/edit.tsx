/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-26 15:51:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-26 15:51:09
 * @Description: 编辑会员
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import MemberForm from './components/MemberForm'

const EditMember: React.FC = () => {
  const { id, validateId } = usePageStatus()

  return <MemberForm id={id} validateId={validateId} isEdit={true} />
}

export default EditMember
