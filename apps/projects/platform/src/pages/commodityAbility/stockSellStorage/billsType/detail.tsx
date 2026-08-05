import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import BillTypeForm from './components/BillTypeForm'

const BillsTypeDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <BillTypeForm id={id} />
}

export default BillsTypeDetail
