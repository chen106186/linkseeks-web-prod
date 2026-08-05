import React from 'react'
import { history } from '@linkseeks/router-manager'
import AddedAddressLayout from './form'
import { useQuery, useLocation } from '@linkseeks/router-core'
const ShipperAddressEdit = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return <AddedAddressLayout mode="edit" id={id as any} />
}
export default ShipperAddressEdit
