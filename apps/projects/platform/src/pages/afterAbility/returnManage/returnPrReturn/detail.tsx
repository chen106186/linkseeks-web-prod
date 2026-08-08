import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrReturnDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/returnManage/returnPrReturn" />
}

export default ReturnPrReturnDetail
