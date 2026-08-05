/*
 * @Description: 变更申请考评历史Card
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import { useWebIntl } from '@apps/locales'
import SupplierAssessmentHistory, { SupplierAssessmentHistoryProps } from '../SupplierAssessmentHistory'

interface SupplierAssessmentHistoryCardProps extends SupplierAssessmentHistoryProps {}

const SupplierAssessmentHistoryCard: React.FC<SupplierAssessmentHistoryCardProps> = (props) => {
  const translate = useWebIntl()

  return (
    <MellowCard title={translate('web.resource.member.kaopinjilu')}>
      <SupplierAssessmentHistory {...props} />
    </MellowCard>
  )
}

export default SupplierAssessmentHistoryCard
