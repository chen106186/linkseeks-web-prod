import React from 'react'
import AddForm from '../addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeInquiryListAdd } from '@apps/apis'
const RfqEnquiryOrder = (props: any) => {
  const { id, spam_id, shopId } = useQuery()
  const { pathname } = useLocation()
  return (
    <AddForm
      id={id}
      isEdit
      shopId={shopId}
      title={getCurrentRouter(pathname)?.title}
      fetchRequest={postTradeInquiryListAdd}
      spam={spam_id}
      rfq
    />
  )
}
export default RfqEnquiryOrder
