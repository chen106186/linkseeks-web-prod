import { useIntl } from '@linkseeks/i18n'
import React from 'react'
// import TimelyDeliveryRate from './chart';
import PercentChart from './percentChart'
import CustomizeCard from '../CustomizeCard'
import StatusLabel from '../StatusLabel'

const AfterSoldEvaluation = () => {
  const intl = useIntl()

  const data = [
    {
      title: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldBackEv',
      })}`,
      value: [2, 6, 12, 16, 64],
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldChangeEv',
      })}`,
      value: [2, 7, 12, 16, 64],
    },
    {
      title: `${intl.formatMessage({
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldMaintainEv',
      })}`,
      value: [5, 0, 18, 16, 64],
    },
  ]

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
        id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldEv',
      })}
      bodyStyle={{ padding: '24px 16px', height: '312px' }}
      extra={<StatusLabel options={options} />}
    >
      {data.map((_item) => {
        return (
          <div style={{ marginBottom: '48px' }} key={_item.title}>
            <PercentChart data={_item.value} title={_item.title} />
          </div>
        )
      })}
      {/* <PercentChart data={data} title={intl.formatMessage({ id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldBackEv'})} />
      <PercentChart data={data} title={intl.formatMessage({ id: 'member.memberWarning.dashboard.components.AfterSoldEvaluation.index.afterSoldBackEv'})} /> */}
    </CustomizeCard>
  )
}

export default AfterSoldEvaluation
