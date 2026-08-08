import React from 'react'
import { Icons } from '@apps/mobile-ui'
import InfoCard from '@/components/InfoCard'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'

export type PropsType = {}

const ContractInfoCard = ({}: PropsType) => {
  const intl = useIntl()
  return (
    <InfoCard
      title={intl.formatMessage({ id: 'order.electronicContract', defaultMessage: '电子合同' })}
      subtitle={<Icons name="ChevronRight" size={16} />}
      onCardClick={() => Router.navigateTo('orderExamine/orderContract')}
    />
  )
}

ContractInfoCard.defaultProps = {
  showEditFreight: false,
}

export default ContractInfoCard
