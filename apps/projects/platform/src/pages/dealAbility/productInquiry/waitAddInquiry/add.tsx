import React from 'react'
import AddForm from './addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeInquiryListAdd } from '@apps/apis'
const AddEnquiryOrder = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return (
    <AddForm
      id={id}
      isEdit={id && true}
      title={getCurrentRouter(pathname)?.title}
      fetchRequest={postTradeInquiryListAdd}
    />
  )
}
export default AddEnquiryOrder
