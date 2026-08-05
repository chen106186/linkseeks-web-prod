import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import WarehouseForm from './components/WarehouseForm'

const WarehouseDetail: React.FC = () => {
  const { id } = usePageStatus()

  return <WarehouseForm id={id} />
}

export default WarehouseDetail
