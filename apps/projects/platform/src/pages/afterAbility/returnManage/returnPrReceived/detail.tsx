import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrReceivedDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/returnManage/returnPrReceived" />
}

export default ReturnPrReceivedDetail
