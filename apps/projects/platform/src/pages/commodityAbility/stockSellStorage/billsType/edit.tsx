import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import BillTypeForm from './components/BillTypeForm'

const EditBillsType: React.FC = () => {
  const { id } = usePageStatus()

  return <BillTypeForm id={id} isEdit />
}

export default EditBillsType
