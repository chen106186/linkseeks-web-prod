/*
 * @Description: 变更申请货源清单Card
 */
import React from 'react'
import MellowCard from '@/components/MellowCard'
import ModifiesSupplyList from '../ModifiesSupplyList'
import { useWebIntl } from '@apps/locales'

interface ModifiesSupplyListCardProps {
  /**
   * 数据，待定
   */
  data: any
}

const ModifiesSupplyListCard: React.FC<ModifiesSupplyListCardProps> = (props) => {
  const { data } = props
  const translate = useWebIntl()
  return (
    <MellowCard title={translate('web.resource.commodity.huoyuanqingdan')}>
      <ModifiesSupplyList data={data} />
    </MellowCard>
  )
}

export default ModifiesSupplyListCard
