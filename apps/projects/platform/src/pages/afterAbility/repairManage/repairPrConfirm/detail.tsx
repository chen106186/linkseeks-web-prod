import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const RepairPrConfirmDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/repairManage/repairPrConfirm" />
}

export default RepairPrConfirmDetail
