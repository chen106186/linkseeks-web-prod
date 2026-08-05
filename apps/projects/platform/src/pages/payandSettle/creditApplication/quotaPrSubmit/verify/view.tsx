import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import DetailInfo from '../../components/DetailInfo'

const VerifyQuotaPrSubmit: React.FC = () => {
  const { id, creditId } = usePageStatus()

  return <DetailInfo id={id} creditId={creditId} isEdit />
}

export default VerifyQuotaPrSubmit
