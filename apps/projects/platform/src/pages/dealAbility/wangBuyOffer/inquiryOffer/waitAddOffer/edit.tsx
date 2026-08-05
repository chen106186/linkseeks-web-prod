import React from 'react'
import AddQuoteForm from './addForm'
import { useQuery } from '@linkseeks/router-core'
import { postTradeAskPurchaseQuoteSaveOrUpdate } from '@apps/apis'
const EditQuote = (props: any) => {
  const { quoteId } = useQuery()
  return <AddQuoteForm quoteId={quoteId} isEdit fetchRequest={postTradeAskPurchaseQuoteSaveOrUpdate} />
}
export default EditQuote
