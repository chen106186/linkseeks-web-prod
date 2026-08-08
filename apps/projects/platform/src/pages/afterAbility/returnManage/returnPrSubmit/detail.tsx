import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../components/DetailInfo'

const ReturnPrSubmitDetail: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} target="/afterAbility/returnManage/returnPrSubmit" />
}

export default ReturnPrSubmitDetail
