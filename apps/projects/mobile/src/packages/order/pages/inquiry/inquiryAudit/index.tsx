import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { setNavigationBarTitle, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { postTradeMobileInquiryDocumentsReview, postTradeMobileInquiryDocumentsReviewTwo } from '@apps/apis'
import AuditLayout from '../../auditLayout'
import { usePageInit } from '@/hooks/usePageInit'
const InquiryQuotationAuditLayout = () => {
  const intl = useIntl()
  usePageInit()
  // setNavigationBarTitle({
  //   title: intl.formatMessage({ id: 'inquiry.shenhebutongguoyuanyin', defaultMessage: '审核不通过原因' }),
  // })
  const params = getCurrentInstance().preloadData || {}
  const { id, PAGE, refresh } = params // 详情数据

  return (
    <AuditLayout
      id={id as unknown as number}
      PostFn={PAGE === 'ONE' ? postTradeMobileInquiryDocumentsReview : postTradeMobileInquiryDocumentsReviewTwo}
      refresh={refresh}
    />
  )
}
export default GlobalWrapper(InquiryQuotationAuditLayout)
