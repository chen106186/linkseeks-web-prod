import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import {
  postTradeMobileInquiryDocumentsReview,
  postTradeMobileInquiryDocumentsReviewTwo,
  postTradeMobileNotarizeEnquiryQuotedPriceAffirm,
  postTradeMobileNotarizeEnquiryQuotedPriceSubmit,
} from '@apps/apis'
import AuditLayout from '../../auditLayout'
const InquiryAuditLayout = () => {
  const params = getCurrentInstance().preloadData || {}
  const { id, PAGE, refresh } = params // 详情数据
  const intl = useIntl()
  const PostFn = () => {
    switch (PAGE) {
      case 'WAIT':
        return postTradeMobileNotarizeEnquiryQuotedPriceSubmit
      case 'ONE':
        return postTradeMobileInquiryDocumentsReview
      case 'TWO':
        return postTradeMobileInquiryDocumentsReviewTwo
      case 'SUBMIT':
        return postTradeMobileNotarizeEnquiryQuotedPriceAffirm
    }
  }
  return (
    <AuditLayout
      title={
        PAGE === 'SUBMIT'
          ? intl.formatMessage({
              id: 'inquiryQuotation.bujieshoubaojiayuanyin',
              defaultMessage: '不接受报价原因',
            })
          : ''
      }
      id={id as unknown as number}
      PostFn={PostFn() as any}
      refresh={refresh}
    />
  )
}
export default GlobalWrapper(InquiryAuditLayout)
