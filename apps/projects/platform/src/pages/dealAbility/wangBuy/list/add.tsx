import React from 'react'
import AddForm from './addForm'
import { useQuery } from '@linkseeks/router-core'
import { postTradeAskPurchaseSaveOrUpdate } from '@apps/apis'
const AddEnquiryOrder = (props: any) => {
  const { id } = useQuery()
  return <AddForm id={id} isEdit={false} fetchRequest={postTradeAskPurchaseSaveOrUpdate} />
}
export default AddEnquiryOrder
