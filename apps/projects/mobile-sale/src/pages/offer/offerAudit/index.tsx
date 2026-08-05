import React from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import AuditLayout, { STATE_TYPE } from '@/components/AuditLayout'
import {
  postTradeAppletProductQuotationtSubmit,
  postTradeAppletProductQuotationtAuditSubmitOne,
  postTradeAppletProductQuotationtAuditSubmitTwo,
  postTradeAppletProductQuotationtToSubmit,
} from '@apps/apis'

const InquiryQuotationAuditLayout = () => {
  const params = getCurrentInstance().preloadData || {}
  const { id, PAGE, STATE, refresh } = params // 详情数据

  const PostFn = () => {
    switch (PAGE) {
      case 'WAIT':
        return postTradeAppletProductQuotationtSubmit
      case 'ONE':
        return postTradeAppletProductQuotationtAuditSubmitOne
      case 'TWO':
        return postTradeAppletProductQuotationtAuditSubmitTwo
      case 'SUBMIT':
        return postTradeAppletProductQuotationtToSubmit
    }
  }

  return (
    <AuditLayout
      title={STATE === STATE_TYPE.PASS ? '确认审核通过' : ''}
      id={id as unknown as number}
      PostFn={PostFn() as any}
      STATE={STATE}
      refresh={refresh}
    />
  )
}
export default InquiryQuotationAuditLayout
