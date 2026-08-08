import React from 'react'
import { useQuery, useLocation } from '@linkseeks/router-core'
import AddedAddressLayout from './form'

const ReceivingAddressEdit = () => {
  const { id } = useQuery()
  return <AddedAddressLayout mode="edit" id={id as any} />
}
export default ReceivingAddressEdit
