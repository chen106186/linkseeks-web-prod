import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import BillTypeForm from './components/BillTypeForm'

const AddBillsType: React.FC = () => {
  const { id } = usePageStatus()

  return <BillTypeForm />
}

export default AddBillsType
