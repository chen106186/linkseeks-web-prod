import React from 'react'
import AddQuoteForm from './addForm'
import { postTradeAskPurchaseQuoteSaveOrUpdate } from '@apps/apis'

const AddQuote: React.FC = (props: any) => {
  return <AddQuoteForm fetchRequest={postTradeAskPurchaseQuoteSaveOrUpdate} />
}

export default AddQuote
