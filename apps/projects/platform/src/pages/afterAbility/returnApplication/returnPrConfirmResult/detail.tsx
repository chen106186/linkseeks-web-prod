import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrConfirmResultDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/returnApplication/returnPrConfirmResult" />
}

export default ReturnPrConfirmResultDetail
