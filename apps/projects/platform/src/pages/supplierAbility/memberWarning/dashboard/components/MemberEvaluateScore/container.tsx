import { useIntl } from '@linkseeks/i18n'
import React, { useMemo } from 'react'
import CustomizeCard from '../CustomizeCard'
import StatusLabel from '../StatusLabel'
import Chart from './scoreChart'

const MemberEvaluateScoreContainer = () => {
  const intl = useIntl()
  const options = [
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.veryGood',
      })}`,
    },
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.good',
      })}`,
    },
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.common',
      })}`,
    },
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.noGood',
      })}`,
    },
    {
      label: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.veryNoGood',
      })}`,
    },
  ]

  return (
    <CustomizeCard
      title={intl.formatMessage({
        id: 'supplier.supplierWarning.dashboard.components.supplierEvaluateScore.container.supplierEvaluateValue',
      })}
      bodyStyle={{ height: '312px', padding: '0' }}
      extra={<StatusLabel options={options} />}
    >
      <Chart />
    </CustomizeCard>
  )
}

export default MemberEvaluateScoreContainer
