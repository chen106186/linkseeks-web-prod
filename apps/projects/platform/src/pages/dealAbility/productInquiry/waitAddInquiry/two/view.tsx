import React from 'react'
import AddForm from '../addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeInquiryListAdd } from '@apps/apis'

const RfqEnquiryOrder = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return (
    <AddForm
      id={id}
      isEdit
      isDefault
      title={getCurrentRouter(pathname)?.title}
      fetchRequest={postTradeInquiryListAdd}
      two
    />
  )
}
export default RfqEnquiryOrder
