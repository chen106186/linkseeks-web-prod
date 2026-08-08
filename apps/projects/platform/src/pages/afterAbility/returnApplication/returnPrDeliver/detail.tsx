import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrDeliverDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/returnApplication/returnPrDeliver" />
}

export default ReturnPrDeliverDetail
