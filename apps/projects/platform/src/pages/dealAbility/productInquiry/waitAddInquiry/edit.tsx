import React from 'react'
import AddForm from './addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeInquiryListUpdate } from '@apps/apis'
const EditEnquiryOrder: React.FC<{}> = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return <AddForm id={id} isEdit title={getCurrentRouter(pathname)?.title} fetchRequest={postTradeInquiryListUpdate} />
}
export default EditEnquiryOrder
