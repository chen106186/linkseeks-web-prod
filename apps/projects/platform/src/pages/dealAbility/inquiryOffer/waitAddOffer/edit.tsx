import React from 'react'
import AddQuoteForm from './addForm'
import { useQuery, getCurrentRouter, useLocation } from '@linkseeks/router-core'
import { postTradeProductQuotationUpdate } from '@apps/apis'
const EditQuote = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  return (
    <AddQuoteForm
      id={id}
      isEdit
      title={getCurrentRouter(pathname)?.title}
      fetchRequest={postTradeProductQuotationUpdate}
    />
  )
}
export default EditQuote
