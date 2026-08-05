/*
 * @Description: 变更申请考评历史Card
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import CustomerAssessmentHistory, { CustomerAssessmentHistoryProps } from '../CustomerAssessmentHistory'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

interface CustomerAssessmentHistoryCardProps extends CustomerAssessmentHistoryProps {}

const CustomerAssessmentHistoryCard: React.FC<CustomerAssessmentHistoryCardProps> = (props) => {
  return (
    <MellowCard title={translate('web.resource.member.kaopinjilu')}>
      <CustomerAssessmentHistory {...props} />
    </MellowCard>
  )
}

export default CustomerAssessmentHistoryCard
